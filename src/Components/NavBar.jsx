import { useNavigate } from "react-router-dom";
import CartButton from "./CartButton";
import { useState, useEffect } from "react";
const NavBar = ({
  numItemCart,
  active,
  setActive,
  cartItem,
  token,
  setSearch,
  setToken,
  isAdmin,
  filterElectorics,
  filterOfficeSupplies,
  filterAllProduct,
}) => {
  const [showDropDown, setShowDropDown] = useState(false);

  const navigate = useNavigate();
  const handleRoute = () => {
    setSearch("");
    navigate("/");
  };

  function handleClick(option) {
    setActive(option);
    switch (option) {
      case "signup":
        navigate("/signup");
        break;
      case "signin":
        navigate("/login");
        break;
      case "account":
        navigate("/account");
        break;
      case "category":
        navigate("/category");
        break;
      case "contactus":
        navigate("/contactus");
        break;
      case "aboutus":
        navigate("/aboutus");
        break;
      default:
        sessionStorage.removeItem("authToken");
        setToken("");
        navigate("/");
    }
    // if (option == "signup") {
    //   navigate("/signup");
    // } else if (option == "signin") {
    //   navigate("/login");
    // } else if (option == "account") {
    //   navigate("/account");
    // } else {
    //   sessionStorage.removeItem("authToken");
    //   setToken("");
    //   navigate("/");
    // }
  }

  useEffect(() => {
    const authtoken = sessionStorage.getItem("authToken");
    setToken(authtoken);
  }, []);

  return (
    <>
      <div className="nav-bar">
        <img
          src="https://marketplace.canva.com/EAFzjXx_i5w/1/0/1600w/canva-blue-illustrative-e-commerce-online-shop-logo-fZejT2DpGCw.jpg"
          style={{ cursor: "pointer" }}
          onClick={handleRoute}
        />
        <div className="nav-bar-button">
          {isAdmin ? (
            <button onClick={() => navigate("/adminPortal")}>
              Admin Portal
            </button>
          ) : (
            ""
          )}
          <button onClick={() => handleClick("aboutus")}>About Us</button>
          <button onClick={() => handleClick("contactus")}>Contact Us</button>
          {/* <button onClick={() => handleClick("category")}>Category</button> */}
          <div
            className="account-button-wrapper"
            onMouseEnter={() => setShowDropDown(true)}
            onMouseLeave={() => setShowDropDown(false)}
          >
            <button>My Account</button>
            {showDropDown && (
              <div className="account-dropdown">
                {token ? (
                  <>
                    <a onClick={() => handleClick("account")}>Details</a>
                    <a onClick={() => handleClick("logout")}>Logout</a>
                  </>
                ) : (
                  <>
                    {" "}
                    <a onClick={() => handleClick("signup")}>SignUp</a>
                    <a onClick={() => handleClick("signin")}>SignIn</a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <CartButton
          numItemCart={numItemCart}
          cartItem={token ? numItemCart : []}
        />
      </div>

      <div className="nav-bar-2">
        <button onClick={() => filterAllProduct()}>
          <i className="bi bi-star-fill"></i>All Products
        </button>
        <button onClick={() => filterElectorics()}>
          <i className="bi bi-star-fill"></i>Electronics
        </button>
        <button onClick={() => filterOfficeSupplies()}>
          <i className="bi bi-star-fill"></i>Office Supplies
        </button>
        <button onClick={() => filterElectorics()}>
          <i className="bi bi-star-fill"></i>Electronics
        </button>
        <button onClick={() => filterOfficeSupplies()}>
          <i className="bi bi-star-fill"></i>Office Supplies
        </button>
        <button onClick={() => filterElectorics()}>
          <i className="bi bi-star-fill"></i>Electronics
        </button>
        <button onClick={() => filterOfficeSupplies()}>
          <i className="bi bi-star-fill"></i>Office Supplies
        </button>
      </div>
    </>
  );
};

export default NavBar;
