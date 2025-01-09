import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
// import { orderItem } from "../../Server/prisma";

const Cart = ({
  quantity,
  setQuantity,
  orderItemId,
  setOrderItemId,
  cartItem,
  setCartItem,
  cart,
  setCart,
  token,
  setToken,
  active,
  setActive,
  numItemCart,
  setNumItemCart,
}) => {
  const navigate = useNavigate();
  let products = [];
  let productQuantity = [];
  let orderItemIds = [];
  // const [quantity, setQuantity] = useState([]);
  // const [orderItemId, setOrderItemId] = useState([]);

  const fetchOrderItem = async () => {
    console.log("token: ", token);
    if (token) {
      try {
        const response = await fetch("http://localhost:3000/api/user/orders", {
          headers: { "Content-Type": "application/json", authtoken: token },
        });
        const data = await response.json();
        console.log("data length: ", data.products.length);
        console.log("orderItem IDs: ", data.orderItemIds);
        console.log("data: ", data);
        // for (let i = 0; i < data.products.length; i++) {
        //   products.push(data.products[i]);
        //   productQuantity.push(data.orderItemQuantity[i]);
        //   orderItemIds.push(data.orderItemIds[i]);
        // }
        console.log("data.products: ", data.products);
        // console.log("Products are: ", products);
        console.log("Orderitem ids are: ", data.orderItemIds);
        // setCartItem(products);
        setNumItemCart(data.products);
        setQuantity(data.orderItemQuantity);
        setOrderItemId(data.orderItemIds);
      } catch (error) {
        console.log("Error while getting your order items is ", error);
      }
    }
  };

  useEffect(() => {
    fetchOrderItem();
    // setCart(!cart);
  }, []);

  const deleteOrderItem = async (orderItem) => {
    console.log("OrderItem in delete: ", orderItem);
    const response = await fetch(`/api/orderItem/${orderItem}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", authtoken: token },
    });
    setCart(!cart);
    fetchOrderItem();
  };

  const subtractItem = async (orderItem, index) => {
    const response = await fetch(`/api/orderItem/${orderItem}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authtoken: token,
      },
      body: JSON.stringify({ quantity: quantity[index] - 1 }),
    });
    const data = await response.json();
    console.log("after adding data: ", data);
    fetchOrderItem();
    setCart(!cart);
  };

  const addItem = async (orderItem, index) => {
    console.log("orderitem: ", orderItem);
    const response = await fetch(`/api/orderItem/${orderItem}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authtoken: token,
      },
      body: JSON.stringify({ quantity: quantity[index] + 1 }),
    });
    const data = await response.json();
    console.log("after adding data: ", data);
    fetchOrderItem();
    setCart(!cart);
  };
  console.log("token: ", token);

  return (
    <>
      <NavBar
        active={active}
        setActive={setActive}
        cartItem={cartItem}
        token={token}
        setToken={setToken}
        numItemCart={numItemCart}
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
            {numItemCart.length == 0 ? (
              //navigate("/")
              <h1>Your cart is empty!</h1>
            ) : (
              numItemCart.map((addedItem, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div className="cartPageItem">
                        <img src={addedItem.img} />
                        <div className="cartPageInfomation">
                          <p>
                            <b>{addedItem.name}</b>
                          </p>
                          <span>{addedItem.description}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      {" "}
                      {productQuantity[index] < 2 ? (
                        <button disabled={true}>-</button>
                      ) : (
                        <button
                          onClick={() =>
                            subtractItem(orderItemId[index], index)
                          }
                        >
                          -
                        </button>
                      )}
                      <span>{quantity[index]} </span>
                      <button
                        onClick={() => addItem(orderItemId[index], index)}
                      >
                        {console.log(
                          "order item id index: ",
                          orderItemId[index]
                        )}
                        +
                      </button>{" "}
                      <button
                        onClick={() => deleteOrderItem(orderItemId[index])}
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                    <td>
                      {" "}
                      <b>
                        $
                        {Math.round(
                          (addedItem.price * quantity[index] -
                            addedItem.discountAmount) *
                            100
                        ) / 100}
                      </b>
                    </td>
                  </tr>
                );
              })
            )}
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
