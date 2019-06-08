/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from "react";
import { ApolloProvider } from "react-apollo";
import { GraphqlClient } from "./src/graphql/client";

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={GraphqlClient}>{element}</ApolloProvider>
);
