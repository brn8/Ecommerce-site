import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
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
  isAdmin,
  filterElectorics,
  filterOfficeSupplies,
  filterAllProduct,
  setActive,
}) => {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  //--API Calls
  const createPurchase = async () => {
    try {
      const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: token,
        },
        body: JSON.stringify({
          address: fullAddress,
          amountPaid: grandTotal,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Posted new purchase");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteOrders = async () => {
    const response = await fetch(`/api/orderItem/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", authtoken: token },
    });
    setCart(!cart);
  };

  function onClickHandler(e) {
    e.preventDefault();
    createPurchase();
    alert("Order has been Placed!");
    deleteOrders();
    setSearch("");
    navigate("/");
  }

  return (
    <>
      {console.log(numItemCart)}
      {numItemCart.length == 0 ? (
        navigate("/cart")
      ) : (
        <div className="order-summary-page">
          <NavBar
            token={token}
            setToken={setToken}
            numItemCart={numItemCart}
            setSearch={setSearch}
            isAdmin={isAdmin}
            filterElectorics={filterElectorics}
            filterOfficeSupplies={filterOfficeSupplies}
            filterAllProduct={filterAllProduct}
            setActive={setActive}
          />
          <div className="order-summary-info">
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
              <button onClick={onClickHandler}>Place order</button>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default OrderSummary;
