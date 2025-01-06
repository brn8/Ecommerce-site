import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Account = () => {
  const navigate = useNavigate();
  return (
    <div className="account">
      <Link to="/">Home</Link>
      <h2>My Account</h2>
      <div className="orders"></div>
      <div className="account-details"></div>
    </div>
  );
};

export default Account;
