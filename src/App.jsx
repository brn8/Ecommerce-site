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

  useEffect(() => {
    const currentOrder = async () => {
      const response = await fetch("/api/orderItem");
      const fetchOrderItem = await response.json();
      setCartItem(fetchOrderItem);
    };
    currentOrder();
  }, [cart]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Product
                active={active}
                setActive={setActive}
                cart={cart}
                setCart={setCart}
                cartItem={cartItem}
                token={token}
                setToken={setToken}
              />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cartItem={cartItem}
              setCartItem={setCartItem}
              cart={cart}
              setCart={setCart}
              token={token}
              setToken={setToken}
              active={active}
              setActive={setActive}
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
      </Routes>
    </>
  );
}

export default App;
