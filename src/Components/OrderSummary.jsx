import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
const OrderSummary = ({
  token,
  setToken,
  numItemCart,
  setNumItemCart,
  quantity,
  grandTotal,
  productPrice,
  firstName,
  lastName,
  address,
  city,
  state,
  zipCode,
  country,
  setSearch,
}) => {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  return (
    <>
      {numItemCart.length == 0 ? (
        navigate("/cart")
      ) : (
        <>
          <NavBar
            token={token}
            setToken={setToken}
            numItemCart={numItemCart}
            setSearch={setSearch}
          />
          <h2 style={{ textAlign: "center" }}>Order Summary</h2>
          <div style={{ marginLeft: "20px" }}>
            <span>
              <b>Shipping Address</b>
            </span>
            <br />
            <span>
              {firstName} {lastName}
            </span>
            <br />
            <span>{address} </span>
            <span>
              {" "}
              {city}, {state} {zipCode}
            </span>
            <br />
            <span>{country}</span>
            <br /> <br />
          </div>
          <div className="summaryPageFlex">
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
                        <div className="summaryPageItem">
                          <img src={addedItem.img} />
                          <div className="summaryPageInfomation">
                            <p>
                              <b>{addedItem.name}</b>
                            </p>
                            <span>{addedItem.description}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span>{quantity[index]} </span>
                      </td>
                      <td> ${productPrice[index]}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td style={{ border: "none" }}></td>
                  <td style={{ border: "none" }}>
                    <b>Total</b>
                  </td>
                  <td style={{ border: "none" }}>
                    <b style={{ color: "green" }}>${grandTotal}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="summaryPageOrder" style={{ border: "none" }}>
            <button onClick={() => navigate("/shipping")}>Previous</button>
            <button
              onClick={() => {
                alert("Order has been Placed!");
                setSearch("");
                navigate("/");
              }}
            >
              Place order
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default OrderSummary;