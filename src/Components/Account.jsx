import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavBar";

const Account = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(null);
  const [addresses, setAddresses] = useState(null);
  const [showForm, setShowForm] = useState(false);

  //placeholders until backend ready
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
    address: {
      street: "1234 Some Address Road",
      city: "Basic City",
      state: "AState",
      country: "United States",
      zip: 12345,
    },
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
  ];

  return (
    <>
      <NavBar cartItem="" />
      <h1 className="account-headers">My Account</h1>
      <p
        onClick={() => {
          navigate("/");
          //   log out user (remove token) here
        }}
        className="account-links"
      >
        {`Log Out >`}
      </p>
      <div className="account">
        <div className="account-orders">
          <h2 className="account-headers">Order History</h2>
          <table>
            <tr className="account-headers">
              <th>Order</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
            {filler_orders.map((val, key) => {
              return (
                <tr key={key}>
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
          <h2 className="account-headers">Account Details</h2>
          <address>
            {`${filler_info.email}`}
            <br />
            {`${filler_info.name}`}
            <br />
            {filler_addresses[0].country}
            <br />
            {`${filler_addresses[0].street}`}
            <br />
            {`${filler_addresses[0].city}, ${filler_addresses[0].state} ${filler_addresses[0].zip}`}
            <br />

            {filler_info.phone_number}
          </address>
          <p
            onClick={() => {
              setShowForm(true);
            }}
            className="account-links"
          >
            {`View/Add Addresses >`}
          </p>
          {showForm && (
            /*add check for exisiting addresses and display */
            <div className="address-form">
              <label>
                Name:
                <br />
                <input type="text" />
              </label>
              <br />

              <label>
                Street Address:
                <br />
                <input type="text" />
              </label>
              <br />

              <label>
                ZIP:
                <br />
                <input />
              </label>
              <br />

              <label>
                City:
                <br />
                <input />
              </label>
              <br />

              <label>
                Country:
                <br />
                <input />
              </label>
              <br />

              <label>
                Phone Number:
                <br />
                <input type="tel" />
              </label>
              <br />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Account;
