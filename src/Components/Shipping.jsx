import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Shipping = ({ token, setToken, numItemCart, setNumItemCart }) => {
  const [disableInformation, setdisableInformation] = useState(true);
  const [disableAddress, setdisableAddress] = useState(true);
  const [disablePayment, setdisablePayment] = useState(true);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [contact, setContact] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [zipCode, setZipcode] = useState(null);
  const [country, setCountry] = useState(null);
  const [cardNumber, setCardNumber] = useState(null);
  const [nameOncard, setNameOnCard] = useState(null);
  const [expiration1, setExpiration1] = useState(null);
  const [expiration2, setExpiration2] = useState(null);
  const [securityCode, setSecurityCode] = useState(null);

  // setToken(sessionStorage.setItem("authtoken", token));

  console.log("token: ", token);

  const fetchOrderItem = async () => {
    console.log("token: ", token);
    if (token) {
      try {
        const response = await fetch("http://localhost:3000/api/user/orders", {
          headers: { "Content-Type": "application/json", authtoken: token },
        });
        const data = await response.json();
        console.log("data length: ", data.products.length);
        // console.log("orderItem IDs: ", data.orderItemIds);
        console.log("data: ", data);
        // for (let i = 0; i < data.products.length; i++) {
        //   products.push(data.products[i]);
        //   productQuantity.push(data.orderItemQuantity[i]);
        //   orderItemIds.push(data.orderItemIds[i]);
        // }
        console.log("data.products: ", data.products);
        // console.log("Products are: ", products);
        // console.log("Orderitem ids are: ", data.orderItemIds);
        // setCartItem(products);
        setNumItemCart(data.products);
        // setQuantity(data.orderItemQuantity);
        // setOrderItemId(data.orderItemIds);
      } catch (error) {
        console.log("Error while getting your order items is ", error);
      }
    }
  };

  useEffect(() => {
    fetchOrderItem();
  }, [token]);

  const editInformationHandler = () => {
    setdisableInformation(false);
  };
  const editAddressInformationHandler = () => {
    setdisableAddress(false);
  };
  const editpaymentInformationHandler = () => {
    setdisablePayment(false);
  };
  const doneEditingHandler = async () => {
    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authtoken: token,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        contact,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("UserDetails are updated successfully!");
    }
    setdisableInformation(true);
  };

  const doneAddressEditingHandler = async () => {
    const response = await fetch("/api/address", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authtoken: token,
      },
      body: JSON.stringify({
        streetAddress: address,
        city,
        state,
        zipCode,
        country,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Address details are updated successfully!");
    }
    setdisableAddress(true);
  };
  const donepaymentEditingHandler = async () => {
    const response = await fetch("/api/payment", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authtoken: token,
      },
      body: JSON.stringify({
        cardNumber,
        nameOnCard: nameOncard,
        expiration: expiration1 + "/" + expiration2,
        securityCode,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Payment detail are updated successfully!");
    }
    setdisablePayment(true);
  };
  useEffect(() => {
    const userInfo = async () => {
      const response = await fetch("/api/address", {
        method: "GET",
        headers: {
          authtoken: token,
        },
      });
      const userData = await response.json();
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);
      setContact(userData.contact);
      if (userData.address != null) {
        setAddress(userData.address.streetAddress);
        setCity(userData.address.city);
        setState(userData.address.state);
        setZipcode(userData.address.zipCode);
        setCountry(userData.address.country);
      }
      if (userData.payment != null) {
        setCardNumber(userData.payment.cardNumber);
        setNameOnCard(userData.payment.nameOnCard);
        setExpiration1(userData.payment.expiration?.split("/")[0]);
        setExpiration2(userData.payment.expiration?.split("/")[1]);
        setSecurityCode(userData.payment.securityCode);
      }
    };
    userInfo();
  }, [token]);

  return (
    <>
      <NavBar token={token} setToken={setToken} numItemCart={numItemCart} />
      <div className="shipping-all-container">
        <h3>Your Information</h3>
        <div className="shipping-flex-1-container">
          <div>
            <label>First Name</label>
            <br />
            <input
              type="text"
              value={firstName}
              disabled={disableInformation}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <br />
            <label>Last Name</label>
            <br />
            <input
              type="text"
              value={lastName}
              disabled={disableInformation}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label>Email Address</label>
            <br />
            <input
              type="text"
              value={email}
              disabled={disableInformation}
              onChange={(e) => setEmail(e.target.value)}
            />{" "}
            <br />
            <label>Contact Number</label>
            <br />
            <input
              type="text"
              value={contact}
              disabled={disableInformation}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="shipping-editUseButton">
            {disableInformation ? (
              <button onClick={editInformationHandler}>
                Edit your information
              </button>
            ) : (
              <button onClick={doneEditingHandler}>Use this Information</button>
            )}
          </div>
        </div>
        <div className="shipping-flex-2-container">
          <div>
            <h3>Billing Address</h3>
            <label>Address</label>
            <br />
            <input type="text" />
            <br />
            {/* <br />
            <input type="text" /> <br /> */}
            <label>City</label>
            <br />
            <input type="text" /> <br />
            <label>State</label>
            <br />
            <input type="text" /> <br />
            <label>Zipcode</label>
            <br />
            <input type="text" />
            <br />
            <label>Country</label>
            <br />
            <input type="text" />
          </div>
          <div>
            <h3>Shipping Address</h3>
            <label>Address</label>
            <br />
            <input
              type="text"
              value={address}
              disabled={disableAddress}
              onChange={(e) => setAddress(e.target.value)}
            />{" "}
            {/* <br /> */}
            {/* <br />
            <input type="text" /> */}
            <br />
            <label>City</label>
            <br />
            <input
              type="text"
              disabled={disableAddress}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />{" "}
            <br />
            <label>State</label>
            <br />
            <input
              type="text"
              value={state}
              disabled={disableAddress}
              onChange={(e) => setState(e.target.value)}
            />{" "}
            <br />
            <label>Zipcode</label>
            <br />
            <input
              type="text"
              value={zipCode}
              disabled={disableAddress}
              onChange={(e) => setZipcode(e.target.value)}
            />
            <br />
            <label>Country</label>
            <br />
            <input
              type="text"
              value={country}
              disabled={disableAddress}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="shipping-editUseButton">
            {disableAddress ? (
              <button onClick={editAddressInformationHandler}>
                Edit your Address
              </button>
            ) : (
              <button onClick={doneAddressEditingHandler}>
                Use this Address
              </button>
            )}
          </div>
        </div>
        <h3>Payment Method </h3>
        <div className="shipping-flex-2-container">
          <br />
          <div>
            <label>Card Number</label>
            <br />
            <input
              type="text"
              disabled={disablePayment}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <br />
            <label>Name on Card</label>
            <br />
            <input
              type="text"
              disabled={disablePayment}
              onChange={(e) => setNameOnCard(e.target.value)}
              value={nameOncard}
            />{" "}
            <br />
            <label>Expiration Date</label>
            <br />
            <input
              type="text"
              disabled={disablePayment}
              value={expiration1}
              onChange={(e) => setExpiration1(e.target.value)}
              style={{ width: "140px", marginRight: "10px" }}
            />
            <input
              type="text"
              value={expiration2}
              onChange={(e) => setExpiration2(e.target.value)}
              disabled={disablePayment}
              style={{ width: "140px" }}
            />
            <br />
            <label>Security Code</label> <br />
            <input
              type="password"
              disabled={disablePayment}
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
            />
          </div>
          <div className="shipping-editUseButton">
            {disablePayment ? (
              <button onClick={editpaymentInformationHandler}>
                Edit your Address
              </button>
            ) : (
              <button onClick={donepaymentEditingHandler}>
                Use this Address
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="shipping-button">
        <div>
          <button>Previous</button>
        </div>
        <div>
          <button>Next</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shipping;
