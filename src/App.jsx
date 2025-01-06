import { useState, useEffect } from "react";
import SignupPage from "./Components/SignupPage";
import "./App.css";
import Product from "./Components/Product";
import CartButton from "./Components/CartButton";
import { Route, Routes } from "react-router-dom";
import Cart from "./Components/Cart";
import LoginPage from "./Components/LoginPage";

function App() {
  const [firstName, setFirstName] = useState(undefined);
  const [lastName, setLastName] = useState(undefined);
  const [username, setUsername] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [active, setActive] = useState("");

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
              <CartButton cart={cart} cartItem={cartItem} />
              <Product cart={cart} setCart={setCart} />
            </>
          }
        />
        <Route path="/cart" element={<Cart cartItem={cartItem} />} />
        <Route
          path="/signup"
          element={
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
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginPage
              active={active}
              setActive={setActive}
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
