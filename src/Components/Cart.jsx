import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const Cart = ({
  cartItem,
  cart,
  setCart,
  token,
  setToken,
  active,
  setActive,
}) => {
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
      <NavBar
        active={active}
        setActive={setActive}
        cartItem={cartItem}
        token={token}
        setToken={setToken}
      />
      <h2>Cart</h2>
      {token ? (
        <div className="cartPageFlex">
          <table style={{ borderCollapse: "collapse" }}>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
            {cartItem.length == 0
              ? navigate("/")
              : cartItem.map((addedItem) => {
                  return (
                    <tr>
                      <td>
                        <div className="cartPageItem">
                          <img src={addedItem.products.img} />
                          <div className="cartPageInfomation">
                            <p>
                              <b>{addedItem.products.name}</b>
                            </p>
                            <span>{addedItem.products.description}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {" "}
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
                        </button>{" "}
                        <button onClick={() => deleteOrderItem(addedItem)}>
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                      <td>
                        {" "}
                        <b>
                          $
                          {Math.round(
                            (addedItem.products.price -
                              addedItem.products.discountAmount) *
                              100
                          ) / 100}
                        </b>
                      </td>
                    </tr>
                  );
                })}
          </table>
          <div className="cartPageOrder">
            <textarea
              placeholder="Order Instruction"
              cols="35"
              rows="12"
            ></textarea>
            <p>Total </p>
            <button
              onClick={() =>
                cartItem.length != 0 ? navigate("/shipping") : ""
              }
            >
              Check Out
            </button>
          </div>
        </div>
      ) : (
        <h1>Your Are not LoggedIn!</h1>
      )}
      {/* <div className="cartPageItems">
        <div>
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
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div> */}
    </>
  );
};

export default Cart;
