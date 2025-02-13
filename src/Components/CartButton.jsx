import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const CartButton = ({ cartItem = [], numItemCart = [] }) => {
  const navigate = useNavigate();
  const addToCartItem = () => {
    navigate("/cart");
  };

  return (
    <>
      <button onClick={addToCartItem}>
        <i className="bi bi-cart" style={{ fontSize: "30px" }}></i>
        {cartItem.length > 0 ? (
          <span
            style={{
              background: "darkorange",
              color: "white",
              padding: "4px",
              borderRadius: "50%",
              position: "absolute",
            }}
          >
            {numItemCart.length}
          </span>
        ) : (
          ""
        )}
      </button>
    </>
  );
};

export default CartButton;
