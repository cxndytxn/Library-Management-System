import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "../../../components/Spinner";
import LoansModel from "../../../models/LoansModel";

export const Loans = () => {
  const { authState } = useOktaAuth();
  const [httpError, setHttpError] = useState(null);

  //Loans
  const [loans, setLoans] = useState<LoansModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      if (authState && authState?.isAuthenticated) {
        const url = `http://localhost:8080/api/books/secure/loans`;

        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const json = await response.json();

        setLoans(json);
      }

      setIsLoading(false);
    };

    fetchLoans().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
    window.scroll(0, 0);
  }, [authState]);

  if (isLoading) {
    return <Spinner />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  return (
    <div>
      {/*Desktop*/}
      <div className="d-none d-lg-block mt-2">
        {loans.length > 0 ? (
          <>
            <h5>Current Loan: </h5>
            {loans.map((loan) => (
              <div key={loan.book.id}>
                <div className="row mt-3 mb-3">
                  <div className="col-4 col-md-4 container">
                    {loan.book?.img ? (
                      <img
                        src={loan.book?.img}
                        width="226"
                        height="349"
                        alt={loan.book.title}
                      />
                    ) : (
                      <img
                        src={require("../../../images/books-images/book-luv2code-1000.png")}
                        width="226"
                        height="349"
                        alt={loan.book.title}
                      />
                    )}
                  </div>
                  <div className="card col-3 col-md-3 container d-flex">
                    <div className="card-body">
                      <div className="mt-3">
                        <h4>Loan Options</h4>
                        {loan.daysLeft > 0 && (
                          <p className="text-secondary">
                            Due in {loan.daysLeft} days.
                          </p>
                        )}
                        {loan.daysLeft === 0 && (
                          <p className="text-success">Due today.</p>
                        )}
                        {loan.daysLeft < 0 && (
                          <p className="text-danger">
                            Pass due by {loan.daysLeft} days.
                          </p>
                        )}
                        <div className="list-group mt-3">
                          <button
                            className="list-group-item list-group-item-action"
                            aria-current="true"
                            data-bs-toggle="modal"
                            data-bs-target={`#modal${loan.book.id}`}
                          >
                            Manage Loan
                          </button>
                          <Link
                            to="/search"
                            className="list-group-item list-group-item-action"
                          >
                            Search More Books?
                          </Link>
                        </div>
                      </div>
                      <hr />
                      <p className="mt-3">
                        Help others find their adventure by reviewing books.
                      </p>
                      <Link
                        className="btn btn-primary"
                        to={`/checkout/${loan.book.id}`}
                      >
                        Leave A Review
                      </Link>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="mt-3">No loans.</h3>
            <Link className="btn btn-primary" to="/search">
              Search For A Book
            </Link>
          </>
        )}
      </div>

      {/*Mobile*/}
      <div className="container d-lg-none mt-2">
        {loans.length > 0 ? (
          <>
            <h5 className="mb-3">Current Loan: </h5>
            {loans.map((loan) => (
              <div key={loan.book.id}>
                <div className="d-flex justify-content-center align-items-center">
                  {loan.book?.img ? (
                    <img
                      src={loan.book?.img}
                      width="226"
                      height="349"
                      alt={loan.book.title}
                    />
                  ) : (
                    <img
                      src={require("../../../images/books-images/book-luv2code-1000.png")}
                      width="226"
                      height="349"
                      alt={loan.book.title}
                    />
                  )}
                </div>
                <div className="card d-flec mt-5 mb-3">
                  <div className="card-body container">
                    <div className="mt-3">
                      <h4>Loan Options</h4>
                      {loan.daysLeft > 0 && (
                        <p className="text-secondary">
                          Due in {loan.daysLeft} days.
                        </p>
                      )}
                      {loan.daysLeft === 0 && (
                        <p className="text-success">Due today.</p>
                      )}
                      {loan.daysLeft < 0 && (
                        <p className="text-danger">
                          Pass due by {loan.daysLeft} days.
                        </p>
                      )}
                      <div className="list-group mt-3">
                        <button
                          className="list-group-item list-group-item-action"
                          aria-current="true"
                          data-bs-toggle="modal"
                          data-bs-target={`#mobilemodal${loan.book.id}`}
                        >
                          Manage Loan
                        </button>
                        <Link
                          to="/search"
                          className="list-group-item list-group-item-action"
                        >
                          Search More Books?
                        </Link>
                      </div>
                    </div>
                    <hr />
                    <p className="mt-3">
                      Help others find their adventure by reviewing books.
                    </p>
                    <Link
                      className="btn btn-primary"
                      to={`/checkout/${loan.book.id}`}
                    >
                      Leave A Review
                    </Link>
                  </div>
                </div>
                <hr />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="mt-3">No loans.</h3>
            <Link className="btn btn-primary" to="/search">
              Search For A Book
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
