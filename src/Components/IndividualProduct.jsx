import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";

const IndividualProduct = ({ setProductRating, productRating }) => {
  const [individualProduct, setIndividualProduct] = useState([]);
  const [productReview, setProductReview] = useState([]);
  const { id } = useParams();

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
      const response = await fetch("/api/product/review");
      const data = await response.json();
      console.log("data: ", data);
      setProductRating(data.productAvgRating);
      setProductReview(data.productReview);
    } catch (error) {
      console.log("Error while fetching ratings: ", error);
    }
  };

  useEffect(() => {
    fetchProduct(id);
    fetchRatings();
  }, []);

  return (
    <>
      <div className="product-info">
        <div className="product-name">{individualProduct.name}</div>
        <div className="product-img">
          <img
            src={individualProduct.img}
            alt={`A Picture of ${individualProduct.name}`}
          />
        </div>
        <div className="product-price">
          {parseInt(individualProduct.discountAmount) == 0 ? (
            <b>${IndividualProduct.price}</b>
          ) : (
            <>
              <b style={{ color: "green" }}>
                NOW $
                {Math.round(
                  (individualProduct.price - individualProduct.discountAmount) *
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
              value={
                productRating.find((rating) => rating.productId == id).average
              }
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
          <button>Add to Cart</button>
        </div>
      </div>
      <div className="review-section">
        <div className="add-review-input-button-container">
          <form>
            <textarea
              className="review"
              placeholder="Add your review..."
            ></textarea>
            <button>Add</button>
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
                      <h4>User Name:</h4>
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
