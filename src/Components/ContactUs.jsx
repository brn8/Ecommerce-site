import Footer from "./Footer";
import NavBar from "./NavBar";
import { useEffect, useState } from "react";

const ContactUs = ({
  token,
  setToken,
  numItemCart,
  active,
  setActive,
  setSearch,
  isAdmin,
  filterElectorics,
  filterOfficeSupplies,
  filterAllProduct,
}) => {
  return (
    <>
      <NavBar
        token={token}
        setToken={setToken}
        numItemCart={numItemCart}
        setActive={setActive}
        setSearch={setSearch}
        isAdmin={isAdmin}
        filterElectorics={filterElectorics}
        filterOfficeSupplies={filterOfficeSupplies}
        filterAllProduct={filterAllProduct}
      />
      <div className="simple-page">
        <div className="info">
          <h2>Contact us on GitHub! </h2>
          <p>
            <a href="https://github.com/pdp5" rel="noreferrer" target="_blank">
              Prit
            </a>
            <br />
            <a href="https://github.com/brn8" rel="noreferrer" target="_blank">
              Brijesh
            </a>
            <br />
            <a
              href="https://github.com/jess-armstrong"
              rel="noreferrer"
              target="_blank"
            >
              Jessica
            </a>
            <br />
            <a
              href="https://github.com/roy-is-our-boy13"
              rel="noreferrer"
              target="_blank"
            >
              Roy
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
