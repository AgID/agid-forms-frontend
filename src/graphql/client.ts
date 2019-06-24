import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { RestLink } from "apollo-link-rest";

import * as fetch from "isomorphic-fetch";

import {
  GATSBY_BACKEND_ENDPOINT,
  GATSBY_HASURA_GRAPHQL_ENDPOINT
} from "../config";
import { getBackendToken, getGraphqlToken } from "../utils/auth";

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

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // tslint:disable-next-line: no-console
    console.error(graphQLErrors);
  }
  if (networkError) {
    // tslint:disable-next-line: no-console
    console.error(networkError);
  }
});

export const GraphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([onErrorLink, restLink, graphqlAuthLink, httpLink])
});
