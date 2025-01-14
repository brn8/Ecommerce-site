import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router";

const AdminPortal = ({
  token,
  setToken,
  numItemCart,
  setActive,
  isAdmin,
  setSearch,
}) => {
  const [newProduct, setNewProduct] = useState(false);
  const [productName, setProductName] = useState("");
  const [productImg, setProductImg] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productDiscountAmount, setProductDiscountAmount] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const createNewProductsHandler = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: productName,
        img: productImg,
        description: productDescription,
        price: productPrice,
        quantity: parseInt(productQuantity),
        discountAmount: productDiscountAmount,
        productCategoryName: productCategory,
        created_at: new Date(),
        modified_at: new Date(),
      }),
    });
    if (response.ok) {
      console.log("Product has been Added");
    }
    if (
      productName === "" ||
      productImg === "" ||
      productDescription === "" ||
      productPrice === "" ||
      productQuantity === "" ||
      productDiscountAmount === "" ||
      productCategory === ""
    ) {
      alert("Please fill in all the fields");
    } else {
      setProductName("");
      setProductImg("");
      setProductDescription("");
      setProductPrice("");
      setProductQuantity("");
      setProductDiscountAmount("");
      setProductCategory("");
      setNewProduct(false);
    }
  };

  useEffect(() => {
    if (!newProduct) {
      const fetchProducts = async () => {
        const response = await fetch("/api/product");
        const fetchProduct = await response.json();
        setProducts(fetchProduct);
      };
      fetchProducts();
    }
  }, [newProduct]);

  return (
    <div>
      <NavBar
        token={token}
        setToken={setToken}
        numItemCart={numItemCart}
        setActive={setActive}
        isAdmin={isAdmin}
        setSearch={setSearch}
      />
      <h2 style={{ textAlign: "center" }}>Products</h2>

      <div className="admin-flex-2-container">
        {newProduct ? (
          <div>
            <label>Product Name:</label>
            <br />
            <input
              type="text"
              onChange={(e) => setProductName(e.target.value)}
              value={productName}
              minLength={1}
              required
            />
            <br />
            <label>Image Url:</label>
            <br />
            <input
              type="text"
              onChange={(e) => setProductImg(e.target.value)}
              value={productImg}
              minLength={1}
              required
            />
            <br />
            <label>Description: </label>
            <br />
            <input
              type="text"
              onChange={(e) => setProductDescription(e.target.value)}
              value={productDescription}
              minLength={1}
              required
            />
            <br />
            <label>Price: </label>
            <br />
            <input
              type="text"
              onChange={(e) => setProductPrice(e.target.value)}
              value={productPrice}
              minLength={1}
              required
            />
            <br />
            <label>Quantity: </label>
            <br />
            <input
              type="number"
              onChange={(e) => setProductQuantity(e.target.value)}
              value={productQuantity}
              minLength={1}
              required
            />
            <br />
            <label>Discount Amount: </label>
            <br />
            <input
              type="text"
              onChange={(e) => setProductDiscountAmount(e.target.value)}
              value={productDiscountAmount}
              minLength={1}
              required
            />
            <br />
            <label>Product Category: </label>
            <br />
            <input
              type="text"
              onChange={(e) => setProductCategory(e.target.value)}
              value={productCategory}
              minLength={1}
              required
            />
            <br />
            <div className="shipping-button">
              <div>
                {" "}
                <button onClick={() => setNewProduct(false)}>Cancel</button>
              </div>
              <div>
                <button onClick={createNewProductsHandler}>Add</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <button onClick={() => setNewProduct(true)}>
              + Add New Products
            </button>

            <table>
              <tbody>
                <tr>
                  <th>Select</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Orignial Price</th>
                  <th>Stock</th>
                  <th>Discount</th>
                  <th>Category</th>
                </tr>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <input type="checkbox" style={{ width: "20px" }} />
                    </td>
                    <td>
                      <img
                        src={product.img}
                        style={{ width: "120px", height: "90px" }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>${product.price}</td>
                    <td>{product.quantity}</td>
                    <td>${product.discountAmount}</td>
                    <td>{product.productCategoryName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
