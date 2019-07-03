import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import DE from "../locales/de";
import IT from "../locales/it";

const i18n = i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: "it",
    resources: {
      de: {
        translation: DE
      },
      it: {
        translation: IT
      }
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
