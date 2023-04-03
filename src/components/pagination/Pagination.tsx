import React from "react";

export const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  paginate: any;
  // searchHandleChange: Function;
  // offset: number | undefined;
  // setCurrentPage: Function;
  // setOffset: Function;
  // categorySelection: string;
  // categoryHandleChange: Function;
}> = (props) => {
  let pageNumbers: number[] = [];

  if (props.currentPage === 1) {
    pageNumbers.push(props.currentPage);
    if (props.totalPages >= props.currentPage + 1) {
      pageNumbers.push(props.currentPage + 1);
    }
    if (props.totalPages >= props.currentPage + 2) {
      pageNumbers.push(props.currentPage + 2);
    }
  } else if (props.currentPage > 1) {
    if (props.currentPage >= 3) {
      pageNumbers.push(props.currentPage - 2);
      pageNumbers.push(props.currentPage - 1);
    } else {
      pageNumbers.push(props.currentPage - 1);
    }

    pageNumbers.push(props.currentPage);

    if (props.totalPages >= props.currentPage + 1) {
      pageNumbers.push(props.currentPage + 1);
    }

    if (props.totalPages >= props.currentPage + 2) {
      pageNumbers.push(props.currentPage + 2);
    }

    let length = pageNumbers.length;

    if (length > 3) {
      pageNumbers = pageNumbers.slice(length - 3, length);
    }
  }

  // const handleOnClick = (number: number) => {
  //   if (props.categorySelection === "Book Categories") {
  //     props.offset === undefined
  //       ? props.paginate(number)
  //       : props.paginate(props.offset);
  //     props.offset === undefined
  //       ? props.searchHandleChange(number)
  //       : props.searchHandleChange(props.offset);
  //     props.offset === undefined
  //       ? props.setCurrentPage(number)
  //       : props.setCurrentPage(1);
  //     props.setOffset(undefined);
  //   } else {
  //     props.paginate(number);
  //     props.categoryHandleChange(props.categorySelection, number);
  //   }
  // };

  return (
    <nav aria-label="..." className="ps-0" key={props.currentPage}>
      <ul className="pagination">
        <li
          className="page-item"
          onClick={() => {
            props.paginate(1);
            // props.searchHandleChange(1);
          }}
        >
          <button className="page-link">First Page</button>
        </li>
        {pageNumbers.map((number) => (
          <li
            onClick={() => props.paginate(number)}
            className={
              "page-item " + (props.currentPage === number ? "active" : "")
            }
            key={number}
          >
            <button className="page-link">{number}</button>
          </li>
        ))}
        <li
          className="page-item"
          onClick={() => {
            props.paginate(props.totalPages);
            // props.searchHandleChange(props.totalPages);
          }}
        >
          <button className="page-link">Last Page</button>
        </li>
      </ul>
    </nav>
  );
};
