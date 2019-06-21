export type UserProfile = {
  id: string;
  email: string;
};

export const BACKEND_TOKEN = "backend_token";
export const GRAPHQL_TOKEN = "graphql_token";

export const isLoggedIn = () =>
  localStorage.getItem(BACKEND_TOKEN) && localStorage.getItem(GRAPHQL_TOKEN);

export const storeTokens = (backendToken: string, graphqlToken: string) => {
  localStorage.setItem(BACKEND_TOKEN, backendToken);
  localStorage.setItem(GRAPHQL_TOKEN, graphqlToken);
};

export const getBackendToken = () => {
  return localStorage.getItem(BACKEND_TOKEN);
};

export const getGraphqlToken = () => {
  return localStorage.getItem(GRAPHQL_TOKEN);
};

export const storeUser = (user: UserProfile) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = (): UserProfile | null => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
  localStorage.clear();
};
