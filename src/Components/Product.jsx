import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Product = ({ setCart, cart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);
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

  const addItemToCart = async (product) => {
    const response = await fetch("/api/orderItem", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        productId: product.id,
        quantity: 1,
        price: product.price,
      }),
    });
    setCart(!cart);
  };
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      const fetchProduct = await response.json();
      setProducts(fetchProduct);
      setFilterProduct(fetchProduct);
    };
    fetchProducts();
  }, []);

  return (
    <>
      <button onClick={() => navigate("/signup")}>SignUp</button>
      <button onClick={() => navigate("/login")}>Login</button>
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
    </>
  );
};
export default Product;
