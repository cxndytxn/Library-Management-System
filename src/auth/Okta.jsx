import { Redirect } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { Spinner } from "../components/Spinner";
import LoginWidget from "./LoginWidget";

const Okta = ({ config }) => {
  const { oktaAuth, authState } = useOktaAuth();
  const onSuccess = (tokens) => {
    oktaAuth.handleLoginRedirect(tokens);
    console.log(tokens);
  };

  const onError = (err) => {
    console.log("Error: ", err);
  };

  if (!authState) {
    return <Spinner />;
  }

  return authState.isAuthenticated ? (
    <Redirect to={{ pathname: "/" }} />
  ) : (
    <LoginWidget onSuccess={onSuccess} onError={onError} />
  );
};

export default Okta;
