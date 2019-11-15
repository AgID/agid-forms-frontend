import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { RestLink } from "apollo-link-rest";
import { createUploadLink } from "apollo-upload-client";
import fetch from "isomorphic-fetch";

import { navigate } from "gatsby";
import {
  GATSBY_BACKEND_ENDPOINT,
  GATSBY_HASURA_GRAPHQL_ENDPOINT,
  GATSBY_UPLOAD_ENDPOINT
} from "../config";
import { getBackendToken, getGraphqlToken, logout } from "../utils/auth";
import { ApolloErrorsT, isJwtExpiredError } from "../utils/errors";

// setup your `RestLink` with your endpoint
const restLink = new RestLink({
  uri: GATSBY_BACKEND_ENDPOINT,
  bodySerializers: {
    Json: (data: any, headers: Headers) => {
      return {
        body: data,
        headers: { ...headers, "Content-Type": "application/json" }
      };
    },
    AuthenticatedJson: (data: any, headers: Headers) => {
      const token = getBackendToken();
      return {
        body: data,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
    }
  }
});

const httpLink = new HttpLink({
  uri: GATSBY_HASURA_GRAPHQL_ENDPOINT,
  fetch
});

// see https://www.apollographql.com/docs/react/recipes/authentication/#Header
const graphqlAuthLink = setContext((_, { headers }) => {
  const token = getGraphqlToken();
  return token
    ? {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`
        }
      }
    : headers;
});

const onErrorLink = onError(res => {
  const error = {
    graphQLErrors: res.graphQLErrors,
    networkError: res.networkError,
    message: (res as ApolloErrorsT).message
  };
  if (isJwtExpiredError(error)) {
    logout(GraphqlClient)
      .then(() => navigate("/?session-expired"))
      .catch(() => navigate("/?session-expired"));
  }
});

const uploadLink = createUploadLink({
  uri: `${GATSBY_UPLOAD_ENDPOINT}/graphql`
});

export const GraphqlClient = new ApolloClient({
  // ssrMode: typeof window !== "undefined",
  cache: new InMemoryCache({
    dataIdFromObject: object => {
      // tslint:disable-next-line:no-useless-cast
      if ((object as any).version) {
        // tslint:disable-next-line:no-useless-cast
        return `${object.id}:${(object as any).version}`;
      }
      return object.id;
    }
  }),
  link:
    // Routes the query to the proper client
    // see https://www.loudnoises.us/next-js-two-apollo-clients-two-graphql-data-sources-the-easy-way/
    // to discriminate from variables content
    // see https://stackoverflow.com/questions/56423772/unknown-type-upload-in-apollo-server-2-6
    ApolloLink.split(
      operation => operation.getContext().clientName === "upload",
      ApolloLink.from([onErrorLink, graphqlAuthLink, uploadLink]),
      ApolloLink.from([onErrorLink, restLink, graphqlAuthLink, httpLink])
    )
});
