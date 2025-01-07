import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = ({ cartItem, cart, setCart }) => {
  const navigate = useNavigate();
  const deleteOrderItem = async (orderItem) => {
    const response = await fetch(`/api/orderItem/${orderItem.id}`, {
      method: "DELETE",
    });
    setCart(!cart);
  };

  const subtractItem = async (orderItem) => {
    const response = await fetch(`/api/orderItem/${orderItem.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ quantity: orderItem.quantity - 1 }),
    });
    setCart(!cart);
  };

  const addItem = async (orderItem) => {
    const response = await fetch(`/api/orderItem/${orderItem.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ quantity: orderItem.quantity + 1 }),
    });
    setCart(!cart);
  };

  return (
    <>
      <button className="cartButton" onClick={() => navigate("/")}>
        X
      </button>
      <div className="cartPageItems">
        {cartItem.length == 0
          ? navigate("/")
          : cartItem.map((addedItem) => {
              return (
                <div className="cartPageItem">
                  <img src={addedItem.products.img} />
                  <div className="cartPageInfomation">
                    <p>
                      <b>{addedItem.products.name}</b>
                    </p>
                    <span>{addedItem.products.description}</span>
                    <span>
                      <b>
                        $
                        {Math.round(
                          (addedItem.products.price -
                            addedItem.products.discountAmount) *
                            100
                        ) / 100}
                      </b>
                    </span>
                    <br />
                    <div className="cartPageButton">
                      {addedItem.quantity < 2 ? (
                        <button disabled={true}>-</button>
                      ) : (
                        <button onClick={() => subtractItem(addedItem)}>
                          -
                        </button>
                      )}
                      <span>{addedItem.quantity} </span>
                      <button onClick={() => addItem(addedItem)}>
                        +
                      </button> |{" "}
                      <button onClick={() => deleteOrderItem(addedItem)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
      <button>Check Out</button>
    </>
  );
};

export default Cart;
