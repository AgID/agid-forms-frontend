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

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import IT from "./src/locales/it";
import EN from "./src/locales/en";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
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
  <ApolloProvider client={GraphqlClient}>{element}</ApolloProvider>
  // </ThemeProvider>
);
