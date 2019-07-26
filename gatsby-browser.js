/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from "react";
import { ApolloProvider } from "react-apollo";
import { GraphqlClient } from "./src/graphql/client";

// import { ThemeProvider } from "styled-components";
// import theme from "./theme";

import { setupI18Next } from "./src/utils/i18n";
setupI18Next();

export const wrapRootElement = ({ element }) => (
  // <ThemeProvider theme={theme}>
  <ApolloProvider client={GraphqlClient}>{element}</ApolloProvider>
  // </ThemeProvider>
);
