import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavBar";

const Account = () => {
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

  const filler_info = {
    email: "some@email.com",
    name: "FirstName LastName",
    phone_number: "+1 012-345-6789",
  };
  const filler_addresses = [
    {
      street: "1234 Some Address Road",
      city: "Basic City",
      state: "AState",
      country: "United States",
      zip: 12345,
    },
    {
      street: "5678 Another Address Road",
      city: "Simple City",
      state: "State2",
      country: "United States",
      zip: 67890,
    },
    {
      name: "Another Name",
      street: "5678 Another Address Road",
      city: "Simple City",
      state: "State2",
      country: "United States",
      zip: 67890,
      phone_number: "+1 987-654-3210",
    },
  ];
  // --------------end of placeholders

  const navigate = useNavigate();
  // --- states containing user account details
  const [info, setInfo] = useState(filler_info);
  const [orders, setOrders] = useState(filler_orders);
  const [addresses, setAddresses] = useState(filler_addresses);

  //--- states for address form
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);

  // make async function once backend done
  function handleSubmit(e) {
    e.preventDefault();
    const newAddress = {
      name: name,
      street: street,
      city: city,
      state: state,
      country: country,
      zip: zip,
      phone_number: phone,
    };
    setAddresses([...addresses, newAddress]);

    setName("");
    setStreet("");
    setCity("");
    setState("");
    setCountry("");
    setZip("");
    setPhone("");
    setShowForm(false);
  }

  return (
    <>
      <NavBar cartItem="" />
      <h1 className="account-headers" style={{ paddingLeft: "50px" }}>
        My Account
      </h1>
      <p
        onClick={() => {
          navigate("/");
          //   log out user (remove token) here
        }}
        className="account-links"
        style={{ paddingLeft: "50px" }}
      >
        {`Log Out >`}
      </p>
      <div className="account">
        <div className="account-orders">
          <h2 className="account-headers">Order History</h2>

          <table className="orders">
            <tr className="account-headers">
              <th style={{ width: "15%" }}>Order</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
            {orders.map((val, key) => {
              return (
                <tr key={key}>
                  {/*make this a link/navigate to specific order page*/}
                  <td>{val.order}</td>
                  <td>{val.date}</td>
                  <td>{val.payment}</td>
                  <td>{val.status}</td>
                  <td>{val.total}</td>
                </tr>
              );
            })}
          </table>
        </div>
        <div className="account-details">
          <div>
            <h2 className="account-headers">Account Details</h2>
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
                      {val.name} <br />
                      {val.country} <br />
                      {val.street} <br />
                      {val.city}, {val.state} {val.zip} <br />
                      {val.phone_number}
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
              {`+ Add Addresses`}
            </p>
          </div>
          {showForm && (
            <form className="address-form" onSubmit={handleSubmit}>
              <label>
                Name:
                <br />
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <br />

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
                <input value={zip} onChange={(e) => setZip(e.target.value)} />
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

              <label>
                Phone Number:
                <br />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <br />
              <em>* Required fields</em>
              <br />
              <button>Submit</button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Account;
