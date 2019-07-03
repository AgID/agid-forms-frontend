/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from "react";
import { ApolloProvider } from "react-apollo";
import { GraphqlClient } from "./src/graphql/client";

// import { ThemeProvider } from "styled-components";
// import theme from "./theme";

import i18n from "./src/utils/i18n";
import { I18nextProvider } from "react-i18next";

export const wrapRootElement = ({ element }) => (
  // <ThemeProvider theme={theme}>
  <I18nextProvider i18n={i18n}>
    <ApolloProvider client={GraphqlClient}>{element}</ApolloProvider>
  </I18nextProvider>
  // </ThemeProvider>
);
