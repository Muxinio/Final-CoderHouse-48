import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useAlert } from "react-alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearErrors, createOrder } from "../../actions/orderActions";
import { CREATE_ORDER_RESET } from "../../constants/orderConstants";
import { RESET_CART } from "../../constants/cartConstants";

const Payment = () => {
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.newOrder);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  const order = {
    orderItems: cartItems,
    shippingInfo,
  };

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice;
    order.shippingPrice = orderInfo.shippingPrice;
    order.taxPrice = orderInfo.taxPrice;
    order.totalPrice = orderInfo.totalPrice;
  }

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    document.querySelector("#pay_btn").disabled = true;

    let res;

    try {
      const config = {
        header: {
          "Content-Type": "application/json",
        },
      };

      res = await axios.post("/api/v1/payment/process", paymentData, config);

      const clientSecret = res.data.client_secret;

      if (!stripe || !elements) {
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });

      if (result.error) {
        alert.error(result.error.message);
        document.querySelector("#pay_btn").disabled = false;
      } else {
        if (result.paymentIntent.status === "succeeded") {
          // Todo: new Order

          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          dispatch(createOrder(order));
          sessionStorage.removeItem("orderInfo");
          dispatch({ type: RESET_CART });
          localStorage.removeItem("cartItems");
          navigate("/success");
        } else {
          alert.error("There is some issue");
        }
      }
    } catch (error) {
      document.querySelector("#pay_btn").disabled = false;
      alert.error(error.response.data.message);
    }
  };

  return (
    <Fragment>
      <MetaData title={"Payment Checkout"} />
      <CheckoutSteps shipping confirmOrder payment />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Informacion de Tarjeta</h1>
            <div className="form-group">
              <label htmlFor="card_num_field">Numero de Tarjeta </label>
              <CardNumberElement
                type="text"
                id="card_num_field"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_exp_field">Fecha de vencimiento</label>
              <CardExpiryElement
                type="text"
                id="card_exp_field"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_cvc_field">Clave CVC</label>
              <CardCvcElement
                type="text"
                id="card_cvc_field"
                className="form-control"
              />
            </div>

            <button id="pay_btn" type="submit" className="btn btn-block py-3">
              Pay {` - ${orderInfo && orderInfo.totalPrice}`}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
