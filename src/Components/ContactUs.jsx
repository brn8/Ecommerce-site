import Footer from "./Footer";
import NavBar from "./NavBar";
import { useEffect, useState } from "react";

const ContactUs = ({ token, setToken, numItemCart, active, setActive, setSearch, isAdmin }) => {
    return (<>
        <NavBar
            token={token}
            setToken={setToken}
            numItemCart={numItemCart}
            active={active}
            setActive={setActive}
            setSearch={setSearch}
            isAdmin={isAdmin}
        />
        <div className="simple-page">
            <div>
                <h2>Contact us on GitHub! </h2>
                <p>
                    <a href="https://github.com/pdp5" rel="noreferrer" target="_blank">Prit</a>
                    <br /><a href="https://github.com/brn8" rel="noreferrer" target="_blank">Brijesh</a>
                    <br /><a href="https://github.com/jess-armstrong" rel="noreferrer" target="_blank">Jessica</a>
                    <br /><a href="https://github.com/roy-is-our-boy13" rel="noreferrer" target="_blank">Roy</a>
                </p>
            </div>
        </div>
        <Footer />
    </>);
}

export default ContactUs;