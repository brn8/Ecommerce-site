import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

const IndividualProduct = ({
  setProductRating,
  productRating,
  setActive,
  token,
  setToken,
  numItemCart,
  setSearch,
  isAdmin,
  setNumItemCart,
}) => {
  const navigate = useNavigate();
  const [individualProduct, setIndividualProduct] = useState([]);
  const [productReview, setProductReview] = useState([]);
  const [postUserReview, setPostUserReview] = useState({
    comment: "",
    rating: null,
  });
  const [users, setUsers] = useState([]);
  const { id } = useParams();

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

  const fetchProduct = async (id) => {
    try {
      const response = await fetch(`/api/product/${id}`);
      const data = await response.json();
      console.log("data: ", data);
      setIndividualProduct(data.product);
    } catch (error) {
      console.log("Error while fetching product ", error);
    }
  };

  const fetchRatings = async () => {
    try {
      console.log("token while fetching reviews: ", token);
      const response = await fetch("/api/product/review");
      const data = await response.json();
      console.log("data: ", data);
      setProductRating(data.productAvgRating);
      setProductReview(data.productReview);
      setUsers(data.users);
    } catch (error) {
      console.log("Error while fetching ratings: ", error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("token: ", token);
    console.log("User's Review: ", postUserReview.comment);
    console.log("User's Rating: ", postUserReview.rating);

    if (token) {
      if (postUserReview.comment && postUserReview.rating !== null) {
        try {
          const response = await fetch(`/api/user/product/review/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", authtoken: token },
            body: JSON.stringify(postUserReview),
          });
          const data = await response.json();
          console.log("data after posting review: ", data);
          setPostUserReview({ comment: "", rating: null });
          fetchRatings();
        } catch (error) {
          console.log("Error while adding a review: ", error);
        }
      } else {
        alert("Please type in your review!!");
      }
    } else {
      alert("Please Login!");
      setPostUserReview({ comment: "", rating: null });
    }
  };

  const addItemToCart = async (product) => {
    // console.log("Caret Item: ", cartItem);
    if (token) {
      try {
        const response = await fetch("http://localhost:3000/api/user/additem", {
          method: "POST",
          headers: { "Content-Type": "application/json", authtoken: token },
          body: JSON.stringify(product),
        });
        const data = await response;
        console.log("After adding an item: ", data);
        // setCart(!cart);
        fetchOrderItem();
        // navigate("/cart");
      } catch (error) {
        console.log("Error while adding item to the cart is ", error);
      }
    } else {
      alert("Please Login to add item into the cart!!");
    }
  };

  useEffect(() => {
    fetchProduct(id);
    fetchRatings();
    console.log("effect: ", token);
  }, [token]);

  return (
    <>
      <NavBar
        setActive={setActive}
        token={token}
        setToken={setToken}
        numItemCart={numItemCart}
        setSearch={setSearch}
        isAdmin={isAdmin}
      />
      <div className="product-info">
        <div className="product-img">
          <img
            src={individualProduct.img}
            alt={`A Picture of ${individualProduct.name}`}
          />
        </div>
        <div className="product-info-without-img">
          <div className="product-name">{individualProduct.name}</div>
          <div className="product-price">
            {parseInt(individualProduct.discountAmount) < 0 ? (
              <b>${IndividualProduct.price}</b>
            ) : (
              <>
                <b style={{ color: "green" }}>
                  NOW $
                  {Math.round(
                    (individualProduct.price -
                      individualProduct.discountAmount) *
                      100
                  ) / 100}{" "}
                </b>
                <s style={{ color: "red" }}>
                  {" "}
                  ${Math.round(individualProduct.price * 100) / 100}
                </s>
              </>
            )}
          </div>
          <div className="product-rating">
            {productRating.find((rating) => rating.productId == id) ? (
              <ReactStars
                count={5}
                size={24}
                isHalf={true}
                value={Number(
                  productRating.find((rating) => rating.productId == id).average
                )}
                edit={false}
                activeColor="#ffd700"
              />
            ) : (
              ""
            )}
          </div>
          <div className="product-description">
            {individualProduct.description}
          </div>
          <div className="button-container">
            <button onClick={() => addItemToCart(individualProduct)}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div className="review-section">
        <div className="add-review-input-button-container">
          <form onSubmit={submitHandler}>
            <textarea
              className="review"
              placeholder="Add your review..."
              value={postUserReview.comment}
              onChange={(e) =>
                setPostUserReview({
                  ...postUserReview,
                  comment: e.target.value,
                })
              }
            ></textarea>
            <ReactStars
              key={postUserReview.rating}
              count={5}
              size={20}
              isHalf={true}
              value={postUserReview.rating}
              onChange={(newRating) =>
                setPostUserReview({ ...postUserReview, rating: newRating })
              }
              activeColor="#ffd700"
            />
            <button type="submit">Add</button>
          </form>
        </div>
        <div className="user-reviews">
          <h3>Reviews:</h3>
          <div className="reviews">
            {productReview &&
            productReview.find((review) => review.productId == id)
              ? productReview
                  .filter((review) => review.productId == id)
                  .map((review, index) => (
                    <div className="individual-user-review-section" key={index}>
                      <h4>
                        {users.find((user) => user.id == review.userId)
                          ?.firstName || "Anonymous"}{" "}
                        {users.find((user) => user.id == review.userId)
                          ?.lastName || ""}
                        :
                      </h4>
                      <ReactStars
                        count={5}
                        size={20}
                        isHalf={true}
                        value={Number(review.review || null)}
                        edit={false}
                        activeColor="#ffd700"
                      />
                      <p>{review.comment}</p>
                    </div>
                  ))
              : "No Reviews"}
          </div>
        </div>
      </div>
    </>
  );
};

export default IndividualProduct;
