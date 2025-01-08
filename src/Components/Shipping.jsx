import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Shipping = ({ token, setToken }) => {
  const [userDetail, setUserDetail] = useState({});
  const [disableInformation, setdisableInformation] = useState(true);
  const [disableAddress, setdisableAddress] = useState(true);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [contact, setContact] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [zipCode, setZipcode] = useState(null);
  const [country, setCountry] = useState(null);

  const editInformationHandler = () => {
    setdisableInformation(false);
  };
  const editAddressInformationHandler = () => {
    setdisableAddress(false);
  };
  const doneEditingHandler = async () => {
    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
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
      console.log("Address updated successfully!");
    }
    setdisableInformation(true);
  };

  const doneAddressEditingHandler = async () => {
    const response = await fetch("/api/address", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
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
      console.log("Address updated successfully!");
    }
    setdisableAddress(true);
  };

  doneEditingHandler;
  useEffect(() => {
    const userInfo = async () => {
      const response = await fetch("/api/address", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });
      const userData = await response.json();
      console.log(userData);
      setUserDetail(userData);
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
    };
    userInfo();
  }, []);

  return (
    <>
      <NavBar token={token} setToken={setToken} />
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
            <br />
            <input type="text" /> <br />
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
            <br />
            <br />
            <input type="text" />
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
