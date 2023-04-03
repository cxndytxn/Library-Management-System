import ReactPaginate from "react-paginate";
import "./utils/pagination.css";

export const BootstrapReactPagination: React.FC<{
  totalAmount: number;
  totalPages: number;
  currentPage: number;
  paginate: any;
}> = (props) => {
  return (
    <nav
      className="pagination justify-content-center mb-4"
      role="navigation"
      aria-label="pagination"
      key={props.totalAmount}
    >
      <ReactPaginate
        pageCount={props.totalPages}
        forcePage={props.currentPage}
        previousLabel={"< Prev"}
        nextLabel={"Next >"}
        onPageChange={props.paginate}
        containerClassName={"pagination"}
        activeLinkClassName={"page-link active pagination-active"}
        disabledLinkClassName={"page-link disabled"}
        breakClassName="page-item"
        breakLabel={"..."}
        pageClassName="page-item"
        previousClassName="page-item"
        nextClassName="page-item"
        pageLinkClassName="page-link"
        previousLinkClassName="page-link main-color direction-link"
        nextLinkClassName="page-link main-color direction-link"
      />
    </nav>
  );
};
