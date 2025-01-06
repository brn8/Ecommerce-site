import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CartButton = ({ cart, setCartItem }) => {
  const [orderItem, setOrderItem] = useState([]);
  const navigate = useNavigate();
  const addToCartItem = () => {
    setCartItem(orderItem);
    navigate("/cart");
  };
  useEffect(() => {
    const currentOrder = async () => {
      const response = await fetch("/api/orderItem");
      const fetchOrderItem = await response.json();
      setOrderItem(fetchOrderItem);
    };
    currentOrder();
  }, [cart]);
  return (
    <>
      <div className="cart">
        <button onClick={addToCartItem}>
          Cart{" "}
          {orderItem.length > 0 ? (
            <span style={{ color: "darkorange" }}>{orderItem.length}</span>
          ) : (
            ""
          )}
        </button>
      </div>
    </>
  );
};

export default CartButton;
