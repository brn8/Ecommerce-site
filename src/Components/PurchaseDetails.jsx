import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const PurchaseDetails = ({ token, setToken, numItemCart, active, setActive, setSearch, isAdmin, firstName,
  lastName }) => {
  const { purchaseId } = useParams();
  const [purchase, setPurchase] = useState(null)
  const [itemList, setItemList] = useState(null)
  const navigate = useNavigate();

  //--API Calls
  const fetchLineItems = async () => {
    if (token) {
      try {
        const response = await fetch(`/api/lineItems/${purchaseId}`, {
          method: "GET"
        });
        const lineItems = await response.json();
        return lineItems;
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchPurchase = async () => {
    if (token) {
      try {
        const response = await fetch(`/api/purchases/${purchaseId}`, {
          method: "GET",
          headers: {
            authtoken: token,
          },
        });
        const userData = await response.json();
        return userData;
      } catch (error) {
        console.error(error);
      }
    }
  };


  //-- on load
  useEffect(() => {
    async function getLineItems() {
      const getItems = await fetchLineItems();
      setItemList(getItems);
      const getPurchase = await fetchPurchase()
      setPurchase(getPurchase);
      // getProducts();
    }
    getLineItems();
  }, [token])

  return (
    <>
      {console.log("purchase")}
      {console.log(purchase)}
      {console.log("item list")}
      {console.log(itemList)}


      <NavBar
        token={token}
        setToken={setToken}
        numItemCart={numItemCart}
        active={active}
        setActive={setActive}
        setSearch={setSearch}
        isAdmin={isAdmin}
      />
      <h2 className="account-headers" style={{ paddingLeft: "20px" }}>
        Order #{purchaseId.toString().padStart(4, "0")}
      </h2>

      <div style={{ marginLeft: "20px" }}>
        <b>Order placed on</b>: {purchase && <span>{purchase.created_at.slice(0, 10)}</span>}
        <br />
        <span>
          <b>Status</b>: {purchase && <span>{purchase.status}</span>}
        </span>
        <br />
        <span>
          <b>Shipped to</b>: {purchase && <span>{purchase.address}</span>}
        </span>


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
            {itemList && itemList.map((val, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div className="summaryPageItem">
                      <img src={val.productImg} />
                      <div className="summaryPageInfomation">
                        <p>
                          <b>{val.productName}</b>
                        </p>
                        <span>{val.productDesc}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span>{val.quantity} </span>
                  </td>
                  <td> ${val.price * val.quantity}</td>
                </tr>
              );
            })}
            <tr>
              <td style={{ border: "none" }}></td>
              <td style={{ border: "none" }}>
                <b>Total</b>
              </td>
              <td style={{ border: "none" }}>
                {purchase && <b style={{ color: "green" }}>${purchase.amountPaid}</b>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button onClick={() => navigate("/account")}>Back</button>
      <Footer />
    </>
  )
}

export default PurchaseDetails;