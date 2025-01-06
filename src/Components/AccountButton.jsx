import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountButton = () => {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          navigate("/account");
        }}
      >
        My Account
      </button>
    </>
  );
};

export default AccountButton;
