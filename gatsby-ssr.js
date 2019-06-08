/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from "react";
import { ApolloProvider } from "react-apollo";
import { GraphqlClient } from "./src/apollo/client";

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={GraphqlClient}>{element}</ApolloProvider>
);
