import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

const Account = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(null);
  const [addresses, setAddresses] = useState(null);

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
    first_name: "FirstName",
    last_name: "LastName",
    address: {
      street: "1234 Some Address Road",
      city: "Basic City",
      country: "United States",
      zip: 12345,
    },
    phone_number: "+1 012-345-6789",
  };

  return (
    <>
      <Link to="/">Home</Link>
      <h1>My Account</h1>
      <div className="orders">
        <h2>Order History</h2>
        <table>
          <tr>
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
        <h2>Account Details</h2>
        <p>
          {`${filler_info.email}`}
          <br></br>
          {`${filler_info.first_name} ${filler_info.last_name}`}
          <br></br>
          {`${filler_info.address.street}`}
          <br></br>
          {`${filler_info.address.city}, ${filler_info.address.country}`}
          <br></br>
          {filler_info.address.zip} <br></br>
          {filler_info.phone_number}
        </p>
      </div>
    </>
  );
};

export default Account;
