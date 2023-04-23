import React from "react";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  return (
    <div className="checkout-progress d-flex justify-content-center mt-5">
      {shipping ? (
        <Link className="float-right" to="/shipping">
          <div className="triangle2-active"></div>
          <div className="step active-step">Envio</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#!" disabled>
          <div className="triangle2-incompleted"></div>
          <div className="step incompleted">Envio</div>
          <div className="triangle-incompleted"></div>
        </Link>
      )}
      {confirmOrder ? (
        <Link className="float-right" to="/order/confirm">
          <div className="triangle2-active"></div>
          <div className="step active-step">Confirm Order</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#!" disabled>
          <div className="triangle2-incompleted"></div>
          <div className="step incompleted">Confirmar Orden</div>
          <div className="triangle-incompleted"></div>
        </Link>
      )}
      {payment ? (
        <Link className="float-right" to="/payment">
          <div className="triangle2-active"></div>
          <div className="step active-step">Pago</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#!" disabled>
          <div className="triangle2-incompleted"></div>
          <div className="step incompleted">Pago</div>
          <div className="triangle-incompleted"></div>
        </Link>
      )}
    </div>
  );
};

export default CheckoutSteps;
