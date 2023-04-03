import { Link } from "react-router-dom";
import ReviewModel from "../../../models/ReviewModel";
import { Review } from "./Review";

export const LatestReviews: React.FC<{
  reviews: ReviewModel[];
  bookId: number | undefined;
  mobile: boolean;
}> = (props) => {
  return (
    <div className={props.mobile ? "my-3" : "row my-4"}>
      <div className={props.mobile ? "" : "col-sm-2 col-md-2"}>
        <h2>Latest Reviews</h2>
      </div>
      <div className="col-sm-10 col-md-10">
        {props.reviews.length > 0 ? (
          <>
            {props.reviews.slice(0, 3).map((review) => (
              <Review review={review} key={review.id}></Review>
            ))}
            <Link
              type="button"
              className="btn main-color btn-md text-white"
              to={`/reviews/${props.bookId}`}
            >
              All Reviews
            </Link>
          </>
        ) : (
          <div className="m-3">
            <p className="lead">No reviews available.</p>
          </div>
        )}
      </div>
    </div>
  );
};
