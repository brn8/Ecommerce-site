import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CartButton = ({ cartItem }) => {
  const navigate = useNavigate();
  const addToCartItem = () => {
    navigate("/cart");
  };

  return (
    <>
      <div className="cart">
        <button onClick={addToCartItem}>
          Cart{" "}
          {cartItem.length > 0 ? (
            <span style={{ color: "darkorange" }}>{cartItem.length}</span>
          ) : (
            ""
          )}
        </button>
      </div>
    </>
  );
};

export default CartButton;
