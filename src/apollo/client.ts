import ApolloClient from "apollo-boost";
import fetch from "isomorphic-fetch";

// see https://www.apollographql.com/docs/react/recipes/authentication/#Header

// tslint:disable-next-line: no-console
const HASURA_GRAPHQL_ENDPOINT = "https://graphql.danilospinelli.com/v1/graphql";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6ZmFsc2UsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJydGQiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoicnRkIiwieC1oYXN1cmEtb3JnLWlkIjoiYWdpZCIsIngtaGFzdXJhLXVzZXItaWQiOiJkN2ZmN2FmNS01MWJhLTRmMDYtOWU5MS1hMDE0ZTA3Mjg3MWYifSwibmFtZSI6ImFsdmFyb0BhZ2lkLmdvdi5pdCIsImlhdCI6MTU1OTg5OTE1NywiZXhwIjoxNTYyNDkxMTU3fQ.ZoIvaAtyDxoX0qN9rxbogsprQAAR8QUZiNbbGpnzjOg";

export const client = new ApolloClient({
  uri: HASURA_GRAPHQL_ENDPOINT,
  request: async operation => {
    // const token = localStorage.getItem("token");
    // tslint:disable-next-line: no-console
    console.log("getting token from local storage");
    operation.setContext({
      headers: token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {}
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      // tslint:disable-next-line: no-console
      console.error(graphQLErrors);
    }
    if (networkError) {
      // tslint:disable-next-line: no-console
      console.error(networkError);
    }
  },
  fetch
});
