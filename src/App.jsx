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

function App() {
  const [firstName, setFirstName] = useState(undefined);
  const [lastName, setLastName] = useState(undefined);
  const [username, setUsername] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [active, setActive] = useState("");
  const [email, setEmail] = useState(undefined);
  const [contact, setContact] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [cart, setCart] = useState(true);
  const [cartItem, setCartItem] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [orderItemId, setOrderItemId] = useState([]);
  const [numItemCart, setNumItemCart] = useState([]);

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
              />
            </div>
          }
        />
        <Route
          path="/account"
          element={<Account token={token} setToken={setToken} />}
        />
        <Route
          path="/shipping"
          element={
            <Shipping
              token={token}
              setToken={setToken}
              numItemCart={numItemCart}
              setNumItemCart={setNumItemCart}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
