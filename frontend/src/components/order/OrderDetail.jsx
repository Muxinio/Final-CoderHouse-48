import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import { clearErrors, getOrderDetail } from "../../actions/orderActions";
import Loader from "../layout/Loader";

const OrderDetail = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { id } = useParams();

  const { loading, error, order } = useSelector((state) => state.orderDetails);
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalPrice,
    orderStatus,
  } = order;

  useEffect(() => {
    dispatch(getOrderDetail(id));

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert, id]);

  const shippingDetails =
    shippingInfo &&
    `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;

  const isPaid =
    paymentInfo && paymentInfo.status === "succeeded" ? true : false;
  return (
    <Fragment>
      <div className="App">
        <div className="container container-fluid">
          <MetaData title={"Order Detail"} />
          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-details">
                  <h1 className="my-5">Order # {order._id}</h1>

                  <h4 className="mb-4">Info del Envio</h4>
                  <p>
                    <b>Nombre:</b> {user && user.name}
                  </p>
                  <p>
                    <b>Telefono:</b> {shippingInfo && shippingInfo.phoneNo}
                  </p>
                  <p className="mb-4">
                    <b>Direccion:</b>
                    {shippingDetails}
                  </p>
                  <p>
                    <b>Importe:</b> ${totalPrice}
                  </p>

                  <hr />

                  <h4 className="my-4">Pago</h4>
                  <p className={isPaid ? "greenColor" : "redColor"}>
                    <b>{isPaid ? "PAID" : "Not Paid"}</b>
                  </p>

                  <h4 className="my-4">Estado de la Orden:</h4>
                  <p
                    className={
                      order.orderStatus &&
                      String(order.orderStatus).includes("Delivered")
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    <b>{orderStatus}</b>
                  </p>

                  <h4 className="my-4">Ordenes Items:</h4>

                  <hr />
                  <div className="cart-item my-1">
                    {orderItems &&
                      orderItems.map((item) => {
                        return (
                          <div key={item.product} className="row my-5">
                            <div className="col-4 col-lg-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                height="45"
                                width="65"
                              />
                            </div>

                            <div className="col-5 col-lg-5">
                              <Link to={`/products/${item.product}`}>
                                {item.name}
                              </Link>
                            </div>

                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                              <p>${item.price}</p>
                            </div>

                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                              <p>{item.quantity} pieza(s)</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <hr />
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default OrderDetail;
