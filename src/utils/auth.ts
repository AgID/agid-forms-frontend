import { LOGOUT } from "../graphql/backend";
import { GraphqlClient } from "../graphql/client";
import { intersection } from "../utils/arrays";

const ANONYMOUS_ROLE = "anonymous";
const AUTHENTICATED_ROLE = "authenticated";

export type SessionInfo = {
  userId: string;
  userEmail: string;
  // organization here is a session variable:
  // any user may belong to multiple organizations
  // but she'll be authenticated for a specific one
  organizationName?: string;
  organizationCode?: string;
  roles?: ReadonlyArray<string>;
};

export const BACKEND_TOKEN = "backend_token";
export const GRAPHQL_TOKEN = "graphql_token";

const HAS_LOCAL_STORAGE =
  typeof window !== "undefined" && typeof localStorage !== "undefined";

export const isLoggedIn = () =>
  HAS_LOCAL_STORAGE &&
  localStorage.getItem(BACKEND_TOKEN) &&
  localStorage.getItem(GRAPHQL_TOKEN);

export const storeTokens = (backendToken: string, graphqlToken: string) => {
  if (!HAS_LOCAL_STORAGE) {
    return;
  }
  localStorage.setItem(BACKEND_TOKEN, backendToken);
  localStorage.setItem(GRAPHQL_TOKEN, graphqlToken);
};

export const getBackendToken = () => {
  return HAS_LOCAL_STORAGE ? localStorage.getItem(BACKEND_TOKEN) : null;
};

export const getGraphqlToken = () => {
  return HAS_LOCAL_STORAGE ? localStorage.getItem(GRAPHQL_TOKEN) : null;
};

export const storeSessionInfo = (user: SessionInfo) => {
  if (HAS_LOCAL_STORAGE) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const getSessionInfo = (): SessionInfo | null => {
  const userStr = HAS_LOCAL_STORAGE ? localStorage.getItem("user") : null;
  return userStr ? JSON.parse(userStr) : null;
};

export const getUserRoles = (
  sessionInfo: SessionInfo | null
): ReadonlyArray<string> => {
  return sessionInfo && sessionInfo.roles
    ? [...sessionInfo.roles, AUTHENTICATED_ROLE]
    : [ANONYMOUS_ROLE];
};

export const userHasAnyRole = (
  sessionInfo: SessionInfo | null,
  roles: ReadonlyArray<string>
) => {
  return intersection(getUserRoles(sessionInfo), roles)[0];
};

export const logout = async (client: typeof GraphqlClient) => {
  try {
    await client.clearStore();
    await client.mutate({
      mutation: LOGOUT,
      variables: {
        body: "{}"
      }
    });
  } catch (e) {
    // tslint:disable-next-line: no-console
    console.error(e);
  }
  if (HAS_LOCAL_STORAGE) {
    localStorage.clear();
  }
};
