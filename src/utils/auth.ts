import { LOGOUT } from "../graphql/backend";
import { GraphqlClient } from "../graphql/client";

export type SessionInfo = {
  userId: string;
  userEmail: string;
  // organization here is a session variable:
  // any user may belong to multiple organizations
  // but she'll be authenticated for a specific one
  organizationName: string;
  organizationCode: string;
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

export const storeSessionInfo = (user: SessionInfo) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getSessionInfo = (): SessionInfo | null => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = async (client: typeof GraphqlClient) => {
  await client.clearStore();
  await client.mutate({
    mutation: LOGOUT,
    variables: {
      body: "{}"
    }
  });
  localStorage.clear();
};
