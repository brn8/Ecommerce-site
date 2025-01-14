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
  isAdmin
}) => {
  const [showDropDown, setShowDropDown] = useState(false);

  const navigate = useNavigate();
  const handleRoute = () => {
    setSearch("");
    navigate("/");
  };
  function handleClick(option) {
    setActive(option);
    if (option == "signup") {
      navigate("/signup");
    } else if (option == "signin") {
      navigate("/login");
    } else if (option == "account") {
      navigate("/account");
    } else {
      sessionStorage.removeItem("authToken");
      setToken("");
      navigate("/");
    }
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
         {isAdmin?<button onClick={()=> navigate("/adminPortal")}>Admin Portal</button>:""} 
          <button>About Us</button>
          <button>Contact Us</button>
          <button>Category</button>
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
        <button>
          <i className="bi bi-star-fill"></i>Electronics
        </button>
        <button>
          <i className="bi bi-star-fill"></i>Office Supplies
        </button>
        <button>
          <i className="bi bi-star-fill"></i>Electronics
        </button>
        <button>
          <i className="bi bi-star-fill"></i>Office Supplies
        </button>
        <button>
          <i className="bi bi-star-fill"></i>Electronics
        </button>
        <button>
          <i className="bi bi-star-fill"></i>Office Supplies
        </button>
      </div>
    </>
  );
};

export default NavBar;
