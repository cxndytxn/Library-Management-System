import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import { LatestReviews } from "./components/LatestReviews";
import { ReviewBox } from "./components/ReviewBox";
import { StarsReview } from "./components/StarsReview";

export const BookCheckout = () => {
  const { authState } = useOktaAuth();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [httpError, setHttpError] = useState(null);

  //Review states
  const [reviews, setReviews] = useState<ReviewModel[]>();
  const [stars, setStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);
  const [isReviewed, setIsReviewed] = useState(false);
  const [isLoadingReviewed, setIsLoadingReviewed] = useState(true);

  //Loan count states
  const [loanCount, setLoanCount] = useState(0);
  const [isLoadingLoanCount, setIsLoadingLoanCount] = useState(true);

  //Book checkout states
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(true);

  const bookId = window.location.pathname.split("/")[2];

  //Book useeffect
  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;

      const response = await fetch(baseUrl);

      // if (!response.ok) {
      //   return response.json().then((response) => {
      //     throw new Error(response.error);
      //   });
      // }

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const json = await response.json();

      const loadedBook: BookModel = {
        id: json.id,
        title: json.title,
        author: json.author,
        description: json.description,
        copies: json.copies,
        copiesAvailable: json.copiesAvailable,
        category: json.category,
        img: json.img,
      };

      setBook(loadedBook);
      setIsLoading(false);
    };

    fetchBook().catch((e: any) => {
      setIsLoading(false);
      setHttpError(e.message);
    });
  }, [isCheckedOut]);

  //Review useeffect
  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;

      const response = await fetch(reviewUrl);

      // if (!response.ok) {
      //   return response.json().then((response) => {
      //     throw new Error(response.error);
      //   });
      // }

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const json = await response.json();
      const data = json._embedded.reviews;

      const loadedReviews: ReviewModel[] = [];

      let weightedStarReviews: number = 0;

      for (const key in data) {
        loadedReviews.push({
          id: data[key].id,
          userEmail: data[key].userEmail,
          rating: data[key].rating,
          date: data[key].date,
          book_id: data[key].bookId,
          reviewDescription: data[key].reviewDescription,
        });
        weightedStarReviews = weightedStarReviews + data[key].rating;
      }

      if (loadedReviews) {
        const round = (
          Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
        ).toFixed(1);
        setStars(Number(round));
      }

      setReviews(loadedReviews);
      setIsLoadingReview(false);
    };

    fetchBookReviews().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, [isReviewed]);

  //IsReviewed useeffect
  useEffect(() => {
    const fetchIsReviewed = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8080/api/reviews/secure/is-reviewed?bookId=${bookId}`;

        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const json = await response.json();

        setIsReviewed(json);
      }

      setIsLoadingReviewed(false);
    };

    fetchIsReviewed().catch((error: any) => {
      setIsLoadingReviewed(false);
      setHttpError(error.message);
    });
  }, [authState]);

  //Loan count useeffect
  useEffect(() => {
    const fetchUserLoanCount = async () => {
      if (authState && authState.isAuthenticated) {
        const url = "http://localhost:8080/api/books/secure/loan-count";
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, requestOptions);

        // if (!response.ok) {
        //   return response.json().then((response) => {
        //     throw new Error(response.error);
        //   });
        // }

        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const json = await response.json();

        setLoanCount(json);
      }

      setIsLoadingLoanCount(false);
    };

    fetchUserLoanCount().catch((error: any) => {
      setIsLoadingLoanCount(false);
      setHttpError(error.message);
    });
  }, [authState, isCheckedOut]);

  //Book checkout useeffect
  useEffect(() => {
    const bookCheckout = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8080/api/books/secure/is-book-checked-out?bookId=${bookId}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const bookCheckedOut = await fetch(url, requestOptions);
        if (!bookCheckedOut.ok) {
          throw new Error("Something went wrong!");
        }

        const json = await bookCheckedOut.json();

        setIsCheckedOut(json);
      }
      setIsLoadingCheckout(false);
    };

    bookCheckout().catch((error: any) => {
      setIsLoadingCheckout(false);
      setHttpError(error.message);
    });
  }, [authState]);

  if (
    isLoading ||
    isLoadingReview ||
    isLoadingLoanCount ||
    isLoadingCheckout ||
    isLoadingReviewed
  ) {
    return <Spinner />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const checkoutBook = async () => {
    const url = `http://localhost:8080/api/books/secure/checkout?bookId=${book?.id}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    setIsCheckedOut(true);
  };

  const submitReview = async (stars: number, reviewDescription: string) => {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }

    const reviewRequestModel = new ReviewRequestModel(
      stars,
      bookId,
      reviewDescription
    );

    const url = `http://localhost:8080/api/reviews/secure`;

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewRequestModel),
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    setIsReviewed(true);
  };

  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book?.img} width="226" height="349" alt={book?.title} />
            ) : (
              <img
                src={require("../../images/books-images/book-luv2code-1000.png")}
                width="226"
                height="349"
                alt={book?.title}
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={stars} size={32} />
            </div>
          </div>
          <ReviewBox
            book={book}
            mobile={false}
            loanCount={loanCount}
            isAuthenticated={authState?.isAuthenticated}
            isCheckedOut={isCheckedOut}
            checkoutBook={checkoutBook}
            isReviewed={isReviewed}
            submitReview={submitReview}
          />
        </div>
        <hr />
        <LatestReviews reviews={reviews!} bookId={book?.id} mobile={false} />
      </div>
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ? (
            <img src={book?.img} width="226" height="349" alt={book?.title} />
          ) : (
            <img
              src={require("../../images/books-images/book-luv2code-1000.png")}
              width="226"
              height="349"
              alt={book?.title}
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={stars} size={32} />
          </div>
        </div>
        <ReviewBox
          book={book}
          mobile={true}
          loanCount={loanCount}
          isAuthenticated={authState?.isAuthenticated}
          isCheckedOut={isCheckedOut}
          checkoutBook={checkoutBook}
          isReviewed={isReviewed}
          submitReview={submitReview}
        />
        <hr />
        <LatestReviews reviews={reviews!} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
