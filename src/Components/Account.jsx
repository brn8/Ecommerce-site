import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavBar";

const APIURL = "http://localhost:3000/api/";

const Account = ({ token, setToken, numItemCart, setActive, setSearch }) => {
  //---------placeholders until backend ready
  const filler_orders = [
    {
      order: "#0001",
      date: "Jan 3, 2025",
      payment: "Paid",
      status: "Shipped",
      total: "$100.0",
    },
    {
      order: "#0012",
      date: "Jan 5, 2025",
      payment: "Processing",
      status: "Delivered",
      total: "$13.25",
    },
  ];

  // --------------end of placeholders

  const navigate = useNavigate();
  // --- states containing user account details
  const [info, setInfo] = useState({});
  const [orders, setOrders] = useState(filler_orders);
  const [addresses, setAddresses] = useState([]);

  //--- states for address form
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  //-- bools to show certain elements
  const [showForm, setShowForm] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);

  //-- API Calls
  const addAddress = async () => {
    console.log("innit");

    try {
      const response = await fetch("/api/address", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authtoken: token,
        },
        body: JSON.stringify({
          streetAddress: street,
          city: city,
          state: state,
          zipCode: zip,
          country: country,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Address details are updated successfully!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/address", {
        method: "GET",
        headers: {
          authtoken: token,
        },
      });
      const userData = await response.json();
      console.log(userData);
      return userData;
    } catch (error) {
      console.error(error);
    }
  };

  //-- Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    const newAddress = {
      street: street,
      city: city,
      state: state,
      country: country,
      zip: zip,
    };
    addAddress();
    setAddresses([newAddress]);
    setStreet("");
    setCity("");
    setState("");
    setCountry("");
    setZip("");
    setShowForm(false);
  }

  useEffect(() => {
    async function getUser() {
      const userInfo = await fetchUser();
      setInfo({
        email: userInfo.email,
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        phone_number: userInfo.contact,
      });
      const userAddress = {
        street: userInfo.address.streetAddress,
        city: userInfo.address.city,
        state: userInfo.address.state,
        country: userInfo.address.country,
        zip: userInfo.address.zipCode,
      };
      setAddresses([userAddress]);
    }
    getUser();
  }, [token]);

  return (
    <>
      <NavBar
        token={token}
        setToken={setToken}
        numItemCart={numItemCart}
        setActive={setActive}
        setSearch={setSearch}
      />
      <h1 className="account-headers" style={{ paddingLeft: "50px" }}>
        My Account
      </h1>
      <div className="account">
        <div className="account-orders">
          <h2 className="account-headers">Order History</h2>

          <table className="orders">
            <thead>
              <tr className="account-headers">
                <th style={{ width: "15%" }}>Order</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>

            {orders.map((val, key) => {
              return (
                <tbody>
                  <tr key={key}>
                    {/*make this a link/navigate to specific order page*/}
                    <td>{val.order}</td>
                    <td>{val.date}</td>
                    <td>{val.payment}</td>
                    <td>{val.status}</td>
                    <td>{val.total}</td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
        <div className="account-details">
          <div>
            <h2 className="account-headers">Account Details</h2>
            {addresses.length > 0 ? (
              <address>
                {`${info.email}`}
                <br />
                {`${info.name}`}
                <br />
                {`${addresses[0].country}`}
                <br />
                {`${addresses[0].street}`}
                <br />
                {`${addresses[0].city}, ${addresses[0].state} ${addresses[0].zip}`}
                <br />
                {info.phone_number}
              </address>
            ) : (
              <p>
                No Addresses Saved
                <br />
                {`${info.email}`}
                <br />
                {`${info.name}`}
                <br />
                {info.phone_number}
              </p>
            )}

            {addresses.length > 1 && (
              <p
                className="account-links"
                onClick={() => {
                  if (showAddresses) {
                    setShowAddresses(false);
                  } else {
                    setShowAddresses(true);
                  }
                }}
              >{`View Addresses (${addresses.length - 1}) >`}</p>
            )}
            {showAddresses &&
              addresses.slice(1).map((val, key) => {
                return (
                  <>
                    <address>
                      {val.country} <br />
                      {val.street} <br />
                      {val.city}, {val.state} {val.zip} <br />
                    </address>
                    <br />
                  </>
                );
              })}

            <p
              onClick={() => {
                if (showForm) {
                  setShowForm(false);
                } else {
                  setShowForm(true);
                }
              }}
              className="account-links"
            >
              {`Edit Address`}
            </p>
          </div>
        </div>
        {showForm && (
          <form className="address-form" onSubmit={handleSubmit}>
            <label>
              *Street Address:
              <br />
              <input
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </label>
            <br />

            <label>
              ZIP:
              <br />
              <input
                required
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </label>
            <br />

            <label>
              *City:
              <br />
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>
            <br />

            <label>
              *State:
              <br />
              <input
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </label>
            <br />

            <label>
              *Country:
              <br />
              <input
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </label>
            <br />
            <br />
            <em>* Required fields</em>
            <br />
            <button>Submit</button>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Account;
