import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = ({ cartItem }) => {
  const navigate = useNavigate();
  return (
    <>
      <button className="cartButton" onClick={() => navigate("/")}>
        X
      </button>
      <div className="cartPageItems">
        {cartItem.map((addedItem) => {
          return (
            <div className="cartPageItem">
              <img src={addedItem.products.img} />
              <div className="cartPageInfomation">
                <p>
                  <b>{addedItem.products.name}</b>
                </p>
                <span>{addedItem.products.description}</span>
                <span>
                  <b>
                    $
                    {Math.round(
                      (addedItem.products.price -
                        addedItem.products.discountAmount) *
                        100
                    ) / 100}
                  </b>
                </span>
                <br />
                <div className="cartPageButton">
                  <button>-</button>
                  <span>{addedItem.quantity} </span>
                  <button>+</button> | <button>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Cart;
