export const isLoggedIn = () =>
  localStorage.getItem("backend_token") &&
  localStorage.getItem("graphql_token");
