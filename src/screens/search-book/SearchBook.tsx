import { useState, useEffect, FormEvent } from "react";
import { BootstrapReactPagination } from "../../components/pagination/BootstrapReactPagination";
// import { Pagination } from "../../components/Pagination";
import { Spinner } from "../../components/Spinner";
import BookModel from "../../models/BookModel";
import { SearchItem } from "./components/SearchItem";

export const SearchBook = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [booksPerPage] = useState(5);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [searchUrl, setSearchUrl] = useState("");
  const [categorySelection, setCategorySelection] = useState("All");

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = "http://localhost:8080/api/books";

      let url: string = "";

      if (searchUrl === "") {
        url = `${baseUrl}?page=${currentPage}&size=${booksPerPage}`;
      } else if (
        categorySelection === "Book Categories" ||
        categorySelection === "All"
      ) {
        url =
          baseUrl +
          `/search/findByTitleContaining?title=${search}&page=${currentPage}&size=${booksPerPage}`;
      } else {
        url =
          baseUrl +
          `/search/findByCategory?category=${categorySelection}&page=${currentPage}&size=${booksPerPage}`;
      }

      setIsLoading(true);

      const response = await fetch(url);

      if (!response.ok) {
        return response.json().then((response) => {
          throw new Error(response.error);
        });
      }

      await response.json().then((data) => {
        const jsonData = data._embedded.books;

        setTotalAmount(data.page.totalElements);
        setTotalPages(data.page.totalPages);
        setCurrentPage(data.page.number);

        const loadedBooks: BookModel[] = [];

        for (const key in jsonData) {
          loadedBooks.push({
            id: jsonData[key].id,
            title: jsonData[key].title,
            author: jsonData[key].author,
            description: jsonData[key].description,
            copies: jsonData[key].copies,
            copiesAvailable: jsonData[key].copiesAvailable,
            category: jsonData[key].category,
            img: jsonData[key].img,
          });
        }

        setBooks(loadedBooks);
        setIsLoading(false);
      });
    };

    fetchBooks().catch((e: any) => {
      setIsLoading(false);
      setHttpError(e.message);
    });

    window.scrollTo(0, 0);
  }, [booksPerPage, categorySelection, currentPage, searchUrl]);

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

  const indexOfLastBook: number = (currentPage + 1) * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem =
    booksPerPage * (currentPage + 1) <= totalAmount
      ? booksPerPage * (currentPage + 1)
      : totalAmount;

  const paginate = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    handleSearchChange();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(0);
    handleSearchChange();
  };

  const handleSearchChange = () => {
    setCategorySelection("All");

    if (search === "") {
      setSearchUrl("");
    }

    if (search !== "") {
      setSearchUrl(
        `/search/findByTitleContaining?title=${search}&page=${currentPage}&size=${booksPerPage}`
      );
    }
  };

  const categoryFields = (value: string) => {
    if (
      value.toLowerCase() === "fe" ||
      value.toLowerCase() === "be" ||
      value.toLowerCase() === "data" ||
      value.toLowerCase() === "devops"
    ) {
      setCurrentPage(0);
      setCategorySelection(value);
      setSearchUrl(
        `/search/findByCategory?category=${value}&page=${currentPage}&size=${booksPerPage}`
      );
    } else {
      setCategorySelection("All");
      setSearchUrl(`?page=0&size=${booksPerPage}`);
    }
  };

  const handleCategoriesSwitch = () => {
    switch (categorySelection) {
      case "All":
        return "All";
      case "FE":
        return "Front End";
      case "BE":
        return "Back End";
      case "DATA":
        return "Data";
      case "DEVOPS":
        return "DevOps";
      default:
        break;
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row mt-5 mx-auto mx-sm-0">
          <div className="col-sm-6 p-0 mb-2 mb-sm-0">
            <form
              className="d-flex"
              onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}
            >
              <input
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                value={search}
                className="form-control mx-2"
                style={{ minWidth: "100px" }}
                type="text"
                placeholder="Search"
                aria-label="Search"
              ></input>
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
          <div className="col-4 px-0 px-sm-2">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {handleCategoriesSwitch()}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li onClick={() => categoryFields("All")}>
                  <a className="dropdown-item" href="#">
                    All
                  </a>
                </li>
                <li onClick={() => categoryFields("FE")}>
                  <a className="dropdown-item" href="#">
                    Front End
                  </a>
                </li>
                <li onClick={() => categoryFields("BE")}>
                  <a className="dropdown-item" href="#">
                    Back End
                  </a>
                </li>
                <li onClick={() => categoryFields("DATA")}>
                  <a className="dropdown-item" href="#">
                    Data
                  </a>
                </li>
                <li onClick={() => categoryFields("DEVOPS")}>
                  <a className="dropdown-item" href="#">
                    DevOps
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {totalAmount > 0 ? (
            <div className="mb-4">
              <div className="mt-3 p-0">
                <h5>Number of results: {totalAmount}</h5>
              </div>
              <p className="p-0">
                {indexOfFirstBook + 1} to {lastItem} of {totalAmount} items:
              </p>
              {books.map((book) => (
                <SearchItem book={book} key={book.id} />
              ))}
            </div>
          ) : (
            <div className="mt-5 p-0 mb-5">
              <h3>Can't find what you are looking for?</h3>
              <a
                type="button"
                className="btn main-color btn-md px-4 me-md-2 fw-bold text-white"
                href="#"
              >
                Library Services
              </a>
            </div>
          )}
          {/* {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
              searchHandleChange={searchHandleChange}
              offset={offset}
              setCurrentPage={setCurrentPage}
              setOffset={setOffset}
              categorySelection={categorySelection}
              categoryHandleChange={categoryFields}
            />
          )} */}
          {totalPages > 1 && (
            <BootstrapReactPagination
              currentPage={currentPage}
              paginate={paginate}
              totalAmount={totalAmount}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};
