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

import i18next from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";

import IT from "./src/locales/it";
import EN from "./src/locales/en";

i18next.use(initReactI18next).init({
  lng: "it",
  fallbackLng: "it",
  resources: {
    en: {
      translation: EN
    },
    it: {
      translation: IT
    }
  },
  interpolation: {
    escapeValue: false
  }
});

export const wrapRootElement = ({ element }) => (
  // <ThemeProvider theme={theme}>
  <I18nextProvider i18n={i18next}>
    <ApolloProvider client={GraphqlClient}>{element}</ApolloProvider>
  </I18nextProvider>
  // </ThemeProvider>
);
