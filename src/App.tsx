import "./App.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./screens/home/Home";
import { SearchBook } from "./screens/search-book/SearchBook";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { BookCheckout } from "./screens/book-checkout/BookCheckout";
import { OktaConfig } from "./lib/OktaConfig";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { Security, LoginCallback, SecureRoute } from "@okta/okta-react";
import Okta from "./auth/Okta";
import { ReviewsList } from "./screens/reviews-list/ReviewsList";
import { Shelf } from "./screens/shelf/Shelf";

const oktaAuth = new OktaAuth(OktaConfig);

export const App = () => {
  const history = useHistory();

  const authHandler = () => {
    history.push("/login");
  };

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Security
        oktaAuth={oktaAuth}
        restoreOriginalUri={restoreOriginalUri}
        onAuthRequired={authHandler}
      >
        <Navbar />
        <div className="flex-grow-1">
          <Switch>
            <Route path="/" exact>
              <Redirect to="/home" />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/search">
              <SearchBook />
            </Route>
            <Route path="/reviews/:bookId">
              <ReviewsList />
            </Route>
            <Route path="/checkout/:bookId">
              <BookCheckout />
            </Route>
            <Route path="/login" render={() => <Okta config={OktaConfig} />} />
            <Route path="/login/callback" component={LoginCallback} />
            <SecureRoute path="/shelf">
              <Shelf />
            </SecureRoute>
          </Switch>
        </div>
        <Footer />
      </Security>
    </div>
  );
};
