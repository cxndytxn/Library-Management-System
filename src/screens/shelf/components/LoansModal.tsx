import LoansModel from "../../../models/LoansModel";

export const LoansModal: React.FC<{
  loansModel: LoansModel;
  mobile: boolean;
}> = (props) => {
  return (
    <div
      className="modal fade"
      id={
        props.mobile
          ? `mobilemodal${props.loansModel.book.id}`
          : `modal${props.loansModel.book.id}`
      }
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      key={props.loansModel.book.id}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-heade">
            <h5 className="modal-title" id="staticBackdropLabel">
              Loan Options
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="mt-3">
                <div className="row">
                  <div className="col-2">
                    {props.loansModel.book?.img ? (
                      <img
                        src={props.loansModel.book?.img}
                        width="56"
                        height="87"
                        alt={props.loansModel.book.title}
                      />
                    ) : (
                      <img
                        src={require("../../../images/books-images/book-luv2code-1000.png")}
                        width="56"
                        height="87"
                        alt={props.loansModel.book.title}
                      />
                    )}
                  </div>
                  <div className="col-10">
                    <h6>{props.loansModel.book.author}</h6>
                    <h4>{props.loansModel.book.title}</h4>
                  </div>
                </div>
                <hr />
                {props.loansModel.daysLeft > 0 && (
                  <p className="text-secondary">
                    Due in {props.loansModel.daysLeft} days.
                  </p>
                )}
                {props.loansModel.daysLeft === 0 && (
                  <p className="text-success">Due today.</p>
                )}
                {props.loansModel.daysLeft < 0 && (
                  <p className="text-danger">
                    Pass due by {props.loansModel.daysLeft} days.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
