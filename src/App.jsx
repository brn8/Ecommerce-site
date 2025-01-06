import { useState } from "react";
import "./App.css";
import Product from "./Product";
import CartButton from "./CartButton";
import { Route, Routes } from "react-router-dom";
import Cart from "./Cart";

function App() {
  const [cart, setCart] = useState(true);
  const [cartItem, setCartItem] = useState([]);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <CartButton cart={cart} setCartItem={setCartItem} />
            <Product cart={cart} setCart={setCart} />
          </>
        }
      />
      <Route path="/cart" element={<Cart cartItem={cartItem} />} />
    </Routes>
  );
}

export default App;
