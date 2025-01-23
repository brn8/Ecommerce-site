import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import ReactStars from "react-rating-stars-component";
import IndividualProduct from "./IndividualProduct";

const Product = ({
  active,
  setActive,
  setCart,
  cart,
  cartItem,
  token,
  setToken,
  numItemCart,
  setNumItemCart,
  products,
  setProducts,
  search,
  setSearch,
  isAdmin,
  productRating,
  setProductRating,
  filterProduct,
  setFilterProduct,
  filterElectorics,
  filterOfficeSupplies,
  filterAllProduct,
}) => {
  const navigate = useNavigate();
  //const [products, setProducts] = useState([]);
  const [searchWithoutClick, setSearchWithoutClick] = useState("");
  // const [productRating, setProductRating] = useState([]);
  const location = useLocation();
  const { message } = location.state || {};
  console.log("product token: ", token);

  const fetchOrderItem = async () => {
    console.log("token: ", token);
    if (token) {
      try {
        const response = await fetch("http://localhost:3000/api/user/orders", {
          headers: { "Content-Type": "application/json", authtoken: token },
        });
        const data = await response.json();
        console.log("data length: ", data.products.length);
        // console.log("orderItem IDs: ", data.orderItemIds);
        console.log("data: ", data);
        // for (let i = 0; i < data.products.length; i++) {
        //   products.push(data.products[i]);
        //   productQuantity.push(data.orderItemQuantity[i]);
        //   orderItemIds.push(data.orderItemIds[i]);
        // }
        console.log("data.products: ", data.products);
        // console.log("Products are: ", products);
        // console.log("Orderitem ids are: ", data.orderItemIds);
        // setCartItem(products);
        setNumItemCart(data.products);
        // setQuantity(data.orderItemQuantity);
        // setOrderItemId(data.orderItemIds);
      } catch (error) {
        console.log("Error while getting your order items is ", error);
      }
    }
  };

  useEffect(() => {
    fetchOrderItem();
  }, [token]);

  const filterBySearch = (productName) => {
    setFilterProduct(
      products.filter((product) => product.name === productName)
    );
    setSearch("");
    setCategoty(false);
  };

  const searchItem = (e) => {
    setSearch(e.target.value);
    setSearchWithoutClick(e.target.value);
    // setFilterProduct(
    //   products.filter((product) =>
    //     product.name.toLowerCase().includes(e.target.value.toLowerCase())
    //   )
    // );
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
        fetchOrderItem();
        setCart(!cart);
      } catch (error) {
        console.log("Error while adding item to the cart is ", error);
      }
    } else {
      alert("Please Login to add item into the cart!!");
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await fetch("/api/product/review");
      const data = await response.json();
      console.log("data: ", data);
      setProductRating(data.productAvgRating);
    } catch (error) {
      console.log("Error while fetching ratings: ", error);
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      const fetchProduct = await response.json();
      console.log("fetchProduct: ", fetchProduct);
      setProducts(fetchProduct);
      setFilterProduct(fetchProduct);
    };
    fetchOrderItem();
    fetchProducts();
    fetchRatings();
  }, []);

  function clickHandler(product) {
    navigate(`/individualProduct/${product.id}`);
  }

  return (
    <>
      <NavBar
        active={active}
        setActive={setActive}
        cartItem={cartItem}
        token={token}
        setToken={setToken}
        numItemCart={numItemCart}
        isAdmin={isAdmin}
        filterElectorics={filterElectorics}
        filterOfficeSupplies={filterOfficeSupplies}
        filterAllProduct={filterAllProduct}
      />
      <form
        style={{ background: "none", marginTop: "-30px" }}
        onSubmit={(e) => {
          e.preventDefault();
          if (searchWithoutClick.length > 0) {
            setSearch(searchWithoutClick);
            navigate("/searchItem");
          }
        }}
      >
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
                  key={product.id}
                  style={{ listStyleType: "none", cursor: "pointer" }}
                  onClick={() => {
                    setSearch(product.name);
                    navigate("/searchItem");
                  }}
                >
                  {product.name}
                </li>
              );
            })}
        </div>
      </form>

      {/* <div className="navbar-3">
        <button>Ads</button>
        <button>Deals</button>
        <button>Anything about the website</button>
        <button>Coming up next...</button>
      </div> */}

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

      <div className="products">
        {filterProduct
          .filter((product) =>
            message !== undefined
              ? product.productCategoryName === message
              : product.productCategoryName
          )
          .map((product) => {
            return (
              <div
                onClick={() => clickHandler(product)}
                key={product.id}
                className="individulProduct"
              >
                <h3>{product.name}</h3>

                <img
                  src={product.img}
                  style={{ width: "100px", height: "120px" }}
                />

                <p>
                  {parseInt(product.discountAmount) < 0 ? (
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
                  {productRating.find(
                    (rating) => product.id === rating.productId
                  ) ? (
                    <p className="product-rating">
                      <ReactStars
                        count={5}
                        size={20}
                        isHalf={true}
                        value={
                          productRating.find(
                            (rating) => rating.productId === product.id
                          ).average
                        }
                        edit={false}
                        activeColor="#ffd700"
                      />
                      {
                        productRating.find(
                          (rating) => rating.productId === product.id
                        ).average
                      }
                    </p>
                  ) : (
                    ""
                  )}
                </p>

                <span>{product.description}</span>

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    addItemToCart(product);
                  }}
                >
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
