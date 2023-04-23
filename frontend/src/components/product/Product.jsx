import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product, col }) => {
  return (
    <div className={`col-sm-12 col-md-6 col-lg-${col} my-3`}>
      <div className="card p-3 rounded">
        <img
          className="card-img-top mx-auto"
          src={product.images[0].url}
          alt={product.name}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">
            <a href={`/products/${product._id}`}>{product.name}</a>
          </h5>
          <div className="ratings mt-auto">
            <Rating
              stars={product.ratings}
              reviews={`${product.numofReviews}`}
            />
          </div>
          <p className="card-text">${product.price}</p>
          <Link
            to={`/products/${product._id}`}
            id="view_btn"
            className="btn btn-block"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
