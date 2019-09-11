/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from "react";
import * as Sentry from "@sentry/browser";

import { ApolloProvider } from "react-apollo";
import { GraphqlClient } from "./src/graphql/client";
import MDXLayout from "./src/components/MDXLayout";

// import { ThemeProvider } from "styled-components";
// import theme from "./theme";

import { setupI18Next } from "./src/utils/i18n";
setupI18Next();

// forward javascript errors to sentry
if (process.env.GATSBY_SENTRY_DSN) {
  Sentry.init({ dsn: process.env.GATSBY_SENTRY_DSN });
  console.log("setup sentry endpoint: %s", process.env.GATSBY_SENTRY_DSN);
}

export const wrapRootElement = ({ element }) => (
  // <ThemeProvider theme={theme}>
  <MDXLayout>
    <ApolloProvider client={GraphqlClient}>{element}</ApolloProvider>
  </MDXLayout>
  // </ThemeProvider>
);
