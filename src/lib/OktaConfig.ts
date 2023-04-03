export const OktaConfig = {
  clientId: "0oa83rjc8z1lX4fJf5d7",
  issuer: "https://dev-11791904.okta.com/oauth2/default",
  redirectUri: "http://localhost:3000/login/callback",
  scopes: ["openid", "profile", "email"],
  pkce: true,
  disableHttpsCheck: true,
};
