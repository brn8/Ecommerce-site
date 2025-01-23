import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import ReactStars from "react-rating-stars-component";
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
  productPrice,
  setProductPrice,
  grandTotal,
  setGrandtotal,
  setSearch,
  isAdmin,
  productRating,
  setProductRating,
}) => {
  const navigate = useNavigate();
  // let products = [];
  // let productQuantity = [];
  // let orderItemIds = [];
  // const [quantity, setQuantity] = useState([]);
  // const [orderItemId, setOrderItemId] = useState([]);
  // const [grandTotal, setGrandtotal] = useState(null);

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
        setProductPrice(data.productPrices);

        const total = data.productPrices.reduce((accumulator, currentValue) => {
          return Number(accumulator) + Number(currentValue);
        }, 0);
        console.log("total: ", total);

        setGrandtotal(total.toFixed(2));
      } catch (error) {
        console.log("Error while getting your order items is ", error);
      }
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await fetch("/api/product/review");
      const data = await response.json();
      console.log("data: ", data);
      setProductRating(data.productAvgRating);
    } catch (error) {
      console.log("Error while fetching ratings: ", error);
    }
  };

  useEffect(() => {
    fetchOrderItem();
    fetchRatings();
    // setCart(!cart);
  }, [token]);

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

  function clickHandler(product) {
    navigate(`/individualProduct/${product.id}`);
  }

  return (
    <>
      <NavBar
        active={active}
        setActive={setActive}
        cartItem={cartItem}
        token={token}
        setToken={setToken}
        numItemCart={numItemCart}
        setSearch={setSearch}
        isAdmin={isAdmin}
      />
      {token ? (
        <>
          {numItemCart.length == 0 ? (
            <div className="cartEmptyFlex">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-illustration-download-in-svg-png-gif-file-formats--shopping-ecommerce-simple-error-state-pack-user-interface-illustrations-6024626.png"
                style={{ width: "300px", height: "300px" }}
              />
              <h2>
                Your Cart is <span style={{ color: "red" }}>Empty!</span>
              </h2>
              <span>Must add items on cart before you proceed to checkout</span>
              <button onClick={() => navigate("/")}>Return Home</button>
            </div>
          ) : (
            <>
              <h2>Cart</h2>

              <div className="cartPageFlex">
                <table style={{ borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                    {numItemCart.map((addedItem, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <div
                              onClick={() => clickHandler(addedItem)}
                              className="cartPageItem"
                            >
                              <img src={addedItem.img} />
                              <div className="cartPageInfomation">
                                <p className="product-name">
                                  <b>{addedItem.name}</b>
                                </p>
                                <p>
                                  {productRating.find(
                                    (rating) =>
                                      addedItem.id === rating.productId
                                  ) ? (
                                    <p className="product-rating">
                                      <ReactStars
                                        count={5}
                                        size={20}
                                        isHalf={true}
                                        value={
                                          productRating.find(
                                            (rating) =>
                                              rating.productId === addedItem.id
                                          ).average
                                        }
                                        edit={false}
                                        activeColor="#ffd700"
                                      />
                                      {
                                        productRating.find(
                                          (rating) =>
                                            rating.productId === addedItem.id
                                        ).average
                                      }
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </p>

                                <span>{addedItem.description}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            {" "}
                            {quantity[index] < 2 ? (
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
                              onClick={() =>
                                deleteOrderItem(orderItemId[index])
                              }
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                          <td>
                            {" "}
                            <b>
                              ${productPrice[index]}
                              {/* {Math.round(
                          (addedItem.price - addedItem.discountAmount) *
                            quantity[index] *
                            100
                        ) / 100} */}
                            </b>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="cartPageOrder">
                  <textarea
                    placeholder="Order Instruction"
                    cols="35"
                    rows="12"
                  ></textarea>
                  <p>Total: ${grandTotal}</p>

                  <button
                    onClick={() =>
                      cartItem.length != 0 ? navigate("/shipping") : ""
                    }
                  >
                    Check Out
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <h1
            style={{
              textAlign: "center",
              fontFamily:
                " Lucida Sans, Lucida Sans Regular, Lucida Grande,Lucida Sans Unicode, Geneva, Verdana, sans-serif",
            }}
          >
            You are not LoggedIn!{" "}
          </h1>
          <p
            style={{
              textAlign: "center",
              fontFamily:
                " Lucida Sans, Lucida Sans Regular, Lucida Grande,Lucida Sans Unicode, Geneva, Verdana, sans-serif",
            }}
          >
            Please Login to view your cart
          </p>
        </>
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
                          <i className="bi bi-trash"></i>
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
