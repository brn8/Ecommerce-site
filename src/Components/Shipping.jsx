import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const Shipping = ({
  setActive,
  token,
  setToken,
  numItemCart,
  setNumItemCart,
  setFirstName,
  setLastName,
  setEmail,
  setContact,
  firstName,
  lastName,
  email,
  contact,
  setAddress,
  setCity,
  setState,
  setZipcode,
  setCountry,
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
}) => {
  const [disableInformation, setdisableInformation] = useState(true);
  const [disableAddress, setdisableAddress] = useState(true);
  const [disablePayment, setdisablePayment] = useState(true);
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");
  // const [contact, setContact] = useState("");
  // const [address, setAddress] = useState("");
  // const [city, setCity] = useState("");
  // const [state, setState] = useState("");
  // const [zipCode, setZipcode] = useState("");
  // const [country, setCountry] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [nameOncard, setNameOnCard] = useState("");
  const [expiration1, setExpiration1] = useState("");
  const [expiration2, setExpiration2] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  // setToken(sessionStorage.setItem("authtoken", token));

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

  // useEffect(() => {
  //   const fetchClientSecret = async () => {
  //     try {
  //       const response = await fetch("/api/payment-intent", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           authtoken: token,
  //         },
  //         body: JSON.stringify({
  //           amount: 200,
  //         }),
  //       });
  //       const data = await response.json();
  //       setClientSecret(data.clientSecret);
  //     } catch (error) {
  //       console.error("Error fetching payment intent:", error);
  //     }
  //   };

  //   fetchClientSecret();
  // }, []);

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
    console.log(zipCode, "jj");

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
  const donepaymentEditingHandler = async (cardDetails) => {
    const response = await fetch("/api/payment", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authtoken: token,
      },
      body: JSON.stringify({
        cardNumber: cardDetails.cardNumber,
        nameOnCard: nameOncard,
        expiration: cardDetails.expiration,
        // securityCode,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Payment detail are updated successfully!");
    }
    setdisablePayment(true);
  };
  const handleShipping = async () => {
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      contact === "" ||
      address === "" ||
      city === "" ||
      state === "" ||
      zipCode === "" ||
      country === "" ||
      nameOncard === ""
    ) {
      alert("Please fill in the required fields (*)");
    } else {
      if (!stripe || !elements) {
        return;
      }

      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        alert(
          "Please fill in the card detail along with any other missing required fields (*)"
        );
      } else {
        const cardDetails = {
          cardNumber: paymentMethod.card.last4,
          nameOnCard: nameOncard,
          expiration:
            paymentMethod.card.exp_month + "/" + paymentMethod.card.exp_year,
        };

        donepaymentEditingHandler(cardDetails);
        doneEditingHandler();
        doneAddressEditingHandler();
        donepaymentEditingHandler();
        navigate("/orderSummary");
      }
    }
  };
  useEffect(() => {
    const userInfo = async () => {
      if (token) {
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
        // if (userData.payment != null) {
        //   setCardNumber(userData.payment.cardNumber);
        //   setNameOnCard(userData.payment.nameOnCard);
        //   setExpiration1(userData.payment.expiration?.split("/")[0]);
        //   setExpiration2(userData.payment.expiration?.split("/")[1]);
        //   // setSecurityCode(userData.payment.securityCode);
        // }
      }
    };
    userInfo();
  }, [token]);

  return (
    <>
      <NavBar
        setActive={setActive}
        token={token}
        setToken={setToken}
        numItemCart={numItemCart}
        setSearch={setSearch}
        isAdmin={isAdmin}
        filterElectorics={filterElectorics}
        filterOfficeSupplies={filterOfficeSupplies}
        filterAllProduct={filterAllProduct}
      />
      <div className="shipping-all-container">
        <h3>Your Information</h3>
        <div className="shipping-flex-1-container">
          <div>
            <label>
              First Name{" "}
              {firstName == "" ? <span style={{ color: "red" }}>*</span> : ""}
            </label>
            <br />
            <input
              type="text"
              value={firstName || ""}
              // disabled={disableInformation}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <br />
            <label>
              Last Name{" "}
              {lastName == "" ? <span style={{ color: "red" }}>*</span> : ""}
            </label>
            <br />
            <input
              type="text"
              value={lastName || ""}
              // disabled={disableInformation}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label>
              Email Address{" "}
              {email == "" ? <span style={{ color: "red" }}>*</span> : ""}
            </label>
            <br />
            <input
              type="text"
              value={email || ""}
              // disabled={disableInformation}
              onChange={(e) => setEmail(e.target.value)}
            />{" "}
            <br />
            <label>
              Contact Number{" "}
              {contact == "" ? <span style={{ color: "red" }}>*</span> : ""}
            </label>
            <br />
            <input
              type="text"
              value={contact || ""}
              // disabled={disableInformation}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          {/* <div className="shipping-editUseButton">
            {disableInformation ? (
              <button onClick={editInformationHandler}>
                Edit your information
              </button>
            ) : (
              <button onClick={doneEditingHandler}>Use this Information</button>
            )}
          </div> */}
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
            <label>
              Address{" "}
              {address == "" ? <span style={{ color: "red" }}>*</span> : ""}
            </label>
            <br />
            <input
              type="text"
              value={address || ""}
              // disabled={disableAddress}
              onChange={(e) => setAddress(e.target.value)}
            />{" "}
            {/* <br /> */}
            {/* <br />
            <input type="text" /> */}
            <br />
            <label>
              City {city == "" ? <span style={{ color: "red" }}>*</span> : ""}
            </label>
            <br />
            <input
              type="text"
              // disabled={disableAddress}
              value={city || ""}
              onChange={(e) => setCity(e.target.value)}
            />{" "}
            <br />
            <label>
              State {state == "" ? <span style={{ color: "red" }}>*</span> : ""}
            </label>
            <br />
            <input
              type="text"
              value={state || ""}
              // disabled={disableAddress}
              onChange={(e) => setState(e.target.value)}
            />{" "}
            <br />
            <label>
              Zipcode{" "}
              {zipCode == "" ? <span style={{ color: "red" }}>*</span> : ""}
            </label>
            <br />
            <input
              type="text"
              value={zipCode || ""}
              // disabled={disableAddress}
              onChange={(e) => setZipcode(e.target.value)}
            />
            <br />
            <label>
              Country{" "}
              {country == "" ? <span style={{ color: "red" }}>*</span> : ""}
            </label>
            <br />
            <input
              type="text"
              value={country || ""}
              // disabled={disableAddress}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          {/* <div className="shipping-editUseButton">
            {disableAddress ? (
              <button onClick={editAddressInformationHandler}>
                Edit your Address
              </button>
            ) : (
              <button onClick={doneAddressEditingHandler}>
                Use this Address
              </button>
            )}
          </div> */}
        </div>
        <h3>Payment Method </h3>
        <div className="shipping-flex-2-container">
          <br />
          <div>
            <label>Card Details</label>
            <br />
            <CardElement></CardElement>
            {/* <input
              type="text"
              // disabled={disablePayment}
              value={cardNumber || ""}
              onChange={(e) => setCardNumber(e.target.value)}
            /> */}
            <br />
            <label>
              Name on Card{" "}
              {nameOncard == "" ? <span style={{ color: "red" }}>*</span> : ""}
            </label>
            <br />
            <input
              type="text"
              // disabled={disablePayment}
              onChange={(e) => setNameOnCard(e.target.value)}
              value={nameOncard || ""}
            />{" "}
            <br />
            {/*
            <label>
              Expiration Date{" "}
              {expiration1 == "" || expiration2 == "" ? (
                <span style={{ color: "red" }}>*</span>
              ) : (
                ""
              )}
            </label>
            <br />
            <input
              type="text"
              // disabled={disablePayment}
              value={expiration1 || ""}
              onChange={(e) => setExpiration1(e.target.value)}
              style={{ width: "140px", marginRight: "10px" }}
            />
            <input
              type="text"
              value={expiration2 || ""}
              onChange={(e) => setExpiration2(e.target.value)}
              // disabled={disablePayment}
              style={{ width: "140px" }}
            />
            <br /> */}
            {/* <label>
              Security Code{" "}
              {securityCode == "" ? (
                <span style={{ color: "red" }}>*</span>
              ) : (
                ""
              )}
            </label>{" "}
            <br />
            <input
              type="password"
              // disabled={disablePayment}
              value={securityCode || ""}
              onChange={(e) => setSecurityCode(e.target.value)}
            /> */}
          </div>
          {/* <div className="shipping-editUseButton">
            {disablePayment ? (
              <button onClick={editpaymentInformationHandler}>
                Edit your Address
              </button>
            ) : (
              <button onClick={donepaymentEditingHandler}>
                Use this Address
              </button>
            )}
          </div> */}
        </div>
      </div>

      <div className="shipping-button">
        <div>
          <button onClick={() => navigate("/cart")}>Previous</button>
        </div>
        <div>
          <button onClick={handleShipping}>Next</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shipping;
