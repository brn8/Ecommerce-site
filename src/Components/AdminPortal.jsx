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
  filterElectorics,
  filterOfficeSupplies,
  filterAllProduct,
}) => {
  const [newProduct, setNewProduct] = useState(false);
  const [refetchData, setRefetchData] = useState(0);
  const [edit, setEdit] = useState(0);
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

  const selectedItem = (product) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((p) => {
        if (p.id === product.id) {
          return { ...p, isChecked: !p.isChecked };
        }
        return p;
      });
      return updatedProducts;
    });
  };

  const deleteProducts = async () => {
    await Promise.all(
      products.map(async (p) => {
        if (p.isChecked) {
          await fetch(`/api/products/${p.id}`, {
            method: "DELETE",
          });
        }
      })
    );
    setRefetchData(!refetchData);
  };

  const editProducts = () => {
    const selectedProduct = products.filter((product) => product.isChecked);
    if (selectedProduct.length > 1) {
      alert("Please select one product at a time to edit");
    } else {
      setNewProduct(true);
      setProductName(selectedProduct[0].name);
      setProductImg(selectedProduct[0].img);
      setProductDescription(selectedProduct[0].description);
      setProductPrice(selectedProduct[0].price);
      setProductQuantity(selectedProduct[0].quantity);
      setProductDiscountAmount(selectedProduct[0].discountAmount);
      setProductCategory(selectedProduct[0].productCategoryName);
      setEdit(selectedProduct.map((product) => product.id));
    }
  };

  const EditProductsHandler = async () => {
    try {
      const editProducts = await fetch(`/api/products/${edit[0]}`, {
        method: "PATCH",
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
          modified_at: new Date(),
        }),
      });

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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!newProduct) {
      const fetchProducts = async () => {
        const response = await fetch("/api/product");
        const fetchProduct = await response.json();
        setProducts(
          fetchProduct.map((product) => ({
            ...product,
            isChecked: false,
          }))
        );
      };
      fetchProducts();
    }
  }, [newProduct, refetchData]);

  return (
    <div>
      <NavBar
        token={token}
        setToken={setToken}
        numItemCart={numItemCart}
        setActive={setActive}
        isAdmin={isAdmin}
        setSearch={setSearch}
        filterElectorics={filterElectorics}
        filterOfficeSupplies={filterOfficeSupplies}
        filterAllProduct={filterAllProduct}
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
                {edit ? (
                  <>
                    <button
                      onClick={() => {
                        setProductName("");
                        setProductImg("");
                        setProductDescription("");
                        setProductPrice("");
                        setProductQuantity("");
                        setProductDiscountAmount("");
                        setProductCategory("");
                        setNewProduct(false);
                        setEdit(0);
                      }}
                    >
                      Cancel
                    </button>
                    <button onClick={EditProductsHandler}>Edit</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setNewProduct(false)}>Cancel</button>
                    <button onClick={createNewProductsHandler}>Add</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              {products.filter((p) => p.isChecked).length > 0 ? (
                <>
                  {products.filter((p) => p.isChecked).length == 1 ? (
                    <button onClick={editProducts}>Edit Products</button>
                  ) : (
                    ""
                  )}
                  <button onClick={deleteProducts}>- Delete Products</button>
                </>
              ) : (
                <button onClick={() => setNewProduct(true)}>
                  + Add New Products
                </button>
              )}
            </div>

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
                      <input
                        type="checkbox"
                        checked={product.isChecked}
                        style={{ width: "20px" }}
                        onClick={() => selectedItem(product)}
                      />
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
