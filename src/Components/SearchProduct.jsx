import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const SearchProduct = ({
  search,
  setSearch,
  products,
  token,
  setToken,
  numItemCart,
  setNumItemCart,
  isAdmin,
  filterElectorics,
  filterOfficeSupplies,
  filterAllProduct,
  setActive,
  active,
  cartItem,
}) => {
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
  const addItemToCart = async (product) => {
    if (token) {
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
  const navigate = useNavigate();

  function clickHandler(product) {
    navigate(`/individualProduct/${product.id}`);
  }
  return (
    <>
      <NavBar
        numItemCart={numItemCart}
        setActive={setActive}
        token={token}
        setToken={setToken}
        isAdmin={isAdmin}
        filterElectorics={filterElectorics}
        filterOfficeSupplies={filterOfficeSupplies}
        filterAllProduct={filterAllProduct}
        active={active}
        cartItem={cartItem}
        setSearch={setSearch}
      />
      {products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      ).length == 0 ? (
        <div className="cartEmptyFlex">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/error-404-illustration-download-in-svg-png-gif-file-formats--no-results-service-landing-page-security-empty-state-pack-design-development-illustrations-3613889.png?f=webp"
            style={{ width: "300px", height: "300px" }}
          />
          <span>There were no search results for "{search}"</span>
          <p>Please check your spelling or use different keywords.</p>
          <button
            onClick={() => {
              setSearch("");
              navigate("/");
            }}
          >
            Return to Home
          </button>
        </div>
      ) : (
        <>
          <p
            style={{
              textAlign: "center",
              fontFamily:
                " Lucida Sans, Lucida Sans Regular, Lucida Grande,Lucida Sans Unicode, Geneva, Verdana, sans-serif",
            }}
          >
            <b>Results for "{search}"</b>
          </p>
          <div className="products">
            {products
              .filter((product) =>
                product.name.toLowerCase().includes(search.toLowerCase())
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
        </>
      )}
    </>
  );
};

export default SearchProduct;
