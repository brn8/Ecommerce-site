import CartButton from "./CartButton";
const NavBar = ({ cartItem }) => {
  return (
    <>
      <div className="nav-bar">
        <img src="https://marketplace.canva.com/EAFzjXx_i5w/1/0/1600w/canva-blue-illustrative-e-commerce-online-shop-logo-fZejT2DpGCw.jpg" />
        <div className="nav-bar-button">
          <button>About Us</button>
          <button>Contact Us</button>
          <button>Category</button>
          <button>Account</button>
        </div>
        <CartButton cartItem={cartItem} />
      </div>
      <div className="nav-bar-2">
        <button>
          <i class="bi bi-star-fill"></i>Electronics
        </button>
        <button>
          <i class="bi bi-star-fill"></i>Office Supplies
        </button>
        <button>
          <i class="bi bi-star-fill"></i>Electronics
        </button>
        <button>
          <i class="bi bi-star-fill"></i>Office Supplies
        </button>
        <button>
          <i class="bi bi-star-fill"></i>Electronics
        </button>
        <button>
          <i class="bi bi-star-fill"></i>Office Supplies
        </button>
      </div>
    </>
  );
};

export default NavBar;
