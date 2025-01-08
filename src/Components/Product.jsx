import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Product = ({
  active,
  setActive,
  setCart,
  cart,
  cartItem,
  token,
  setToken,
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);


  console.log("token: ", token);


  const [search, setSearch] = useState("");
  const [catergory, setCategoty] = useState(true);
  const filterElectorics = () => {
    setFilterProduct(
      products.filter(
        (product) => product.productCategoryName === "Electronics"
      )
    );
  };
  const filterOfficeSupplies = () => {
    setFilterProduct(
      products.filter(
        (product) => product.productCategoryName === "Office Supplies"
      )
    );
  };
  const filterBySearch = (productName) => {
    setFilterProduct(
      products.filter((product) => product.name === productName)
    );
    setSearch("");
    setCategoty(false);
  };

  const searchItem = (e) => {
    setSearch(e.target.value);
    setFilterProduct(
      products.filter((product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );

    setCategoty(false);
  };
  const addItemToCart = async (product) => {
    console.log("Caret Item: ", cartItem);
    if (token) {
      // const response = await fetch("/api/orderItem", {
      //   method: "POST",
      //   headers: {
      //     "Content-type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     productId: product.id,
      //     quantity: 1,
      //     price: product.price,
      //   }),
      // });
      // setCart(!cart);
      try {
        const response = await fetch("http://localhost:3000/api/user/additem", {
          method: "POST",
          headers: { "Content-Type": "application/json", authtoken: token },
          body: JSON.stringify(product),
        });
        const data = await response;
        console.log("After adding an item: ", data);
        setCart(!cart);
        // fetchOrderItem();
      } catch (error) {
        console.log("Error while adding item to the cart is ", error);
      }
    } else {
      alert("Please Login to add item into the cart!!");
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      const fetchProduct = await response.json();
      setProducts(fetchProduct);
      setFilterProduct(fetchProduct);
    };
    fetchProducts();
    // fetchOrderItem();
  }, []);

  return (
    <>
      <NavBar
        active={active}
        setActive={setActive}
        cartItem={cartItem}
        token={token}
        setToken={setToken}
      />

      <div className="search-container">
        <input
          style={{
            width: "400px",
            borderRadius: "10px",
            padding: "5px",
            backgroundColor: "#def4fd",
          }}
          onChange={searchItem}
          value={search}
          placeholder="Search"
        />
        <br />
      </div>
      <div
        className="search-filter"
        style={{ display: search ? "block" : "none" }}
      >
        {products
          .filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((product) => {
            return (
              <li
                style={{ listStyleType: "none", cursor: "pointer" }}
                onClick={() => filterBySearch(product.name)}
              >
                {product.name}
              </li>
            );
          })}
      </div>
      {/* <div className="navbar-3">
        <button>Ads</button>
        <button>Deals</button>
        <button>Anything about the website</button>
        <button>Coming up next...</button>
      </div> */}
      {catergory ? (
        <div className="itemByCategory">
          <button onClick={filterElectorics}>
            <img src="https://pricenmore.com/wp-content/uploads/2019/03/PRICEnMORE-Banner-All-Electronics-Gadgets-price-1170x500.jpg" />
            <h3>Electronics</h3>
          </button>
          <button onClick={filterOfficeSupplies}>
            <img src="https://media.istockphoto.com/id/136156615/photo/set-of-stationery-items-on-white-background.jpg?s=612x612&w=0&k=20&c=_VUSxD07WzZcj7S39Thvj1SsYBJby2yl6vdCNhkqBck=" />
            <h3>Office Supply</h3>
          </button>
        </div>
      ) : (
        ""
      )}
      <div className="products">
        {filterProduct.map((product) => {
          return (
            <div className="individulProduct">
              <h3>{product.name}</h3>
              <img
                src={product.img}
                style={{ width: "100px", height: "120px" }}
              />
              <p>
                {parseInt(product.discountAmount) == 0 ? (
                  <b>${product.price}</b>
                ) : (
                  <>
                    <b style={{ color: "green" }}>
                      NOW $
                      {Math.round(
                        (product.price - product.discountAmount) * 100
                      ) / 100}{" "}
                    </b>
                    <s style={{ color: "red" }}>
                      {" "}
                      ${Math.round(product.price * 100) / 100}
                    </s>
                  </>
                )}
              </p>
              <span>{product.description}</span>
              <button onClick={() => addItemToCart(product)}>
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>

      <Footer />
    </>
  );
};
export default Product;
