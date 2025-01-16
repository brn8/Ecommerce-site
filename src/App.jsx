import { useState, useEffect } from "react";
import SignupPage from "./Components/SignupPage";
import "./App.css";
import Product from "./Components/Product";
import CartButton from "./Components/CartButton";
import { Route, Routes } from "react-router-dom";
import Cart from "./Components/Cart";
import Account from "./Components/Account";
import LoginPage from "./Components/LoginPage";
import NavBar from "./Components/NavBar";
import Shipping from "./Components/Shipping";
import OrderSummary from "./Components/OrderSummary";
import SearchProduct from "./Components/SearchProduct";
import AdminPortal from "./Components/AdminPortal";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import IndividualProduct from "./Components/IndividualProduct";

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipcode] = useState("");
  const [country, setCountry] = useState("");
  const [token, setToken] = useState("");
  const [cart, setCart] = useState(true);
  const [cartItem, setCartItem] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [orderItemId, setOrderItemId] = useState([]);
  const [numItemCart, setNumItemCart] = useState([]);
  const [productPrice, setProductPrice] = useState([]);
  const [grandTotal, setGrandtotal] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [productRating, setProductRating] = useState([]);

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
    const currentOrder = async () => {
      const response = await fetch("/api/orderItem");
      const fetchOrderItem = await response.json();
      setCartItem(fetchOrderItem);
    };
    currentOrder();
    console.log("Total Cart Item: ", numItemCart);
    // fetchOrderItem();
  }, [cart]);

  useEffect(() => {
    if (token) {
      const checkRole = async () => {
        const response = await fetch("/api/address", {
          method: "GET",
          headers: {
            authtoken: token,
          },
        });
        const userData = await response.json();
        setIsAdmin(userData.isAdmin);
      };
      checkRole();
    } else {
      setIsAdmin(false);
    }
  }, [token]);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Product
                setCartItem={setCartItem}
                active={active}
                setActive={setActive}
                cart={cart}
                setCart={setCart}
                cartItem={cartItem}
                token={token}
                setToken={setToken}
                numItemCart={numItemCart}
                setNumItemCart={setNumItemCart}
                setProducts={setProducts}
                products={products}
                search={search}
                setSearch={setSearch}
                isAdmin={isAdmin}
                productRating={productRating}
                setProductRating={setProductRating}
              />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              quantity={quantity}
              setQuantity={setQuantity}
              orderItemId={orderItemId}
              setOrderItemId={setOrderItemId}
              cartItem={cartItem}
              setCartItem={setCartItem}
              cart={cart}
              setCart={setCart}
              token={token}
              setToken={setToken}
              active={active}
              setActive={setActive}
              numItemCart={numItemCart}
              setNumItemCart={setNumItemCart}
              productPrice={productPrice}
              setProductPrice={setProductPrice}
              grandTotal={grandTotal}
              setGrandtotal={setGrandtotal}
              setSearch={setSearch}
              isAdmin={isAdmin}
              productRating={productRating}
              setProductRating={setProductRating}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <div className="signup-page custom-signup-page">
              <NavBar
                active={active}
                setActive={setActive}
                cartItem={cartItem}
                token={token}
                setToken={setToken}
                isAdmin={isAdmin}
              />
              <SignupPage
                active={active}
                setActive={setActive}
                firstName={firstName}
                lastName={lastName}
                username={username}
                password={password}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setUsername={setUsername}
                setPassword={setPassword}
                email={email}
                setEmail={setEmail}
                contact={contact}
                setContact={setContact}
              />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className="signin-page custom-signin-page">
              <NavBar
                active={active}
                setActive={setActive}
                cartItem={cartItem}
                token={token}
                setToken={setToken}
              />
              <LoginPage
                active={active}
                setActive={setActive}
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setEmail={setEmail}
                setContact={setContact}
              />
            </div>
          }
        />
        <Route
          path="/account"
          element={
            <div>
              <Account
                token={token}
                setToken={setToken}
                numItemCart={numItemCart}
                setActive={setActive}
                setSearch={setSearch}
                isAdmin={isAdmin}
              />
            </div>
          }
        />

        <Route
          path="/searchItem"
          element={
            <SearchProduct
              token={token}
              setToken={setToken}
              numItemCart={numItemCart}
              search={search}
              setSearch={setSearch}
              products={products}
              setNumItemCart={setNumItemCart}
              isAdmin={isAdmin}
            />
          }
        />
        <Route
          path="/adminPortal"
          element={
            <AdminPortal
              token={token}
              setToken={setToken}
              numItemCart={numItemCart}
              setActive={setActive}
              setSearch={setSearch}
              isAdmin={isAdmin}
            />
          }
        />
        <Route
          path="/orderSummary"
          element={
            <OrderSummary
              token={token}
              setToken={setToken}
              numItemCart={numItemCart}
              quantity={quantity}
              grandTotal={grandTotal}
              productPrice={productPrice}
              firstName={firstName}
              lastName={lastName}
              address={address}
              city={city}
              state={state}
              zipCode={zipCode}
              country={country}
              setNumItemCart={setNumItemCart}
              setSearch={setSearch}
              isAdmin={isAdmin}
            />
          }
        />

        <Route
          path="/shipping"
          element={
            <Shipping
              setActive={setActive}
              token={token}
              setToken={setToken}
              numItemCart={numItemCart}
              setNumItemCart={setNumItemCart}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setEmail={setEmail}
              setContact={setContact}
              firstName={firstName}
              lastName={lastName}
              email={email}
              contact={contact}
              setAddress={setAddress}
              setCity={setCity}
              setState={setState}
              setZipcode={setZipcode}
              setCountry={setCountry}
              address={address}
              city={city}
              state={state}
              zipCode={zipCode}
              country={country}
              setSearch={setSearch}
              isAdmin={isAdmin}
            />
          }
        />
        <Route
          path="/individualProduct/:id"
          element={
            <IndividualProduct
              setProductRating={setProductRating}
              productRating={productRating}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
