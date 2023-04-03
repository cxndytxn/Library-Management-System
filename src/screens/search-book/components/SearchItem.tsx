import { Link } from "react-router-dom";
import BookModel from "../../../models/BookModel";

export const SearchItem: React.FC<{ book: BookModel }> = (props) => {
  return (
    <div className="card mt-3 shadow p-3 mb-3 rounded">
      <div className="row g-0">
        <div className="col-md-3 col-lg-2 my-auto">
          <div className="d-none d-lg-flex justify-content-center">
            {props.book.img ? (
              <img
                src={props.book.img}
                alt={props.book.title}
                width="123"
                height="196"
              />
            ) : (
              <img
                src="../../../images/books-images/book-luv2code-1000.png"
                alt={props.book.title}
                width="123"
                height="196"
              />
            )}
          </div>
          <div className="d-lg-none d-flex justify-content-center align-items-center">
            {props.book.img ? (
              <img
                src={props.book.img}
                alt={props.book.title}
                width="123"
                height="196"
              />
            ) : (
              <img
                src="../../../images/books-images/book-luv2code-1000.png"
                alt={props.book.title}
                width="123"
                height="196"
              />
            )}
          </div>
        </div>
        <div className="col-md-9 col-lg-8">
          <div className="card-body">
            <h5 className="card-title">{props.book.author}</h5>
            <h4>{props.book.title}</h4>
            <p className="card-text">{props.book.description}</p>
          </div>
        </div>
        <div className="col-lg-2 d-flex justify-content-center align-items-center">
          <Link
            className="btn btn-dark text-white main-color"
            to={`/checkout/${props.book.id}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
