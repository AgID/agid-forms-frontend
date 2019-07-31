import * as React from "react";
import CookieBanner from "react-cookie-banner";
import { Trans, useTranslation } from "react-i18next";

import { Cookies } from "react-cookie-banner";

export const COOKIEBAR_COOKIE_NAME = "user-has-accepted-cookies";

export const hasAcceptedCookies = () => {
  if (typeof window === "undefined") {
    return false;
  }
  const cookies = new Cookies();
  return cookies.get(COOKIEBAR_COOKIE_NAME) !== undefined;
};

const Cookiebar = ({ policyLink }: { policyLink: string }) => {
  const { t } = useTranslation();

  const [hasAcceptedCookiesInt, setHasAcceptedCookies] = React.useState(true);

  React.useEffect(() => {
    setHasAcceptedCookies(hasAcceptedCookies());
  });

  return !hasAcceptedCookiesInt ? (
    <CookieBanner
      buttonMessage={t("cookiebar.accept")}
      styles={{
        button: {
          fontWeight: "600",
          textTransform: "uppercase",
          fontSize: ".875rem",
          display: "inline-block",
          lineHeight: "1em",
          background: "#fff",
          padding: "16px",
          color: "#555"
        },
        banner: {
          backgroundColor: "#435a70",
          position: "absolute",
          maxWidth: "800px",
          left: "50%",
          right: "auto",
          transform: "translateX(-50%)",
          bottom: "0",
          height: "auto",
          padding: "30px",
          borderRadius: "4px 4px 0 0"
        },
        message: {
          lineHeight: "1.55",
          fontWeight: 400,
          textAlign: "left",
          maxWidth: "60%",
          float: "left"
        }
      }}
      link={
        <a href={policyLink}>
          <Trans i18nKey="cookiebar.settings">
            settings<span className="sr-only">cookies</span>
          </Trans>
        </a>
      }
      message={t("cookiebar.alert")}
      // onAccept={() => {}}
      cookie={COOKIEBAR_COOKIE_NAME}
      dismissOnScroll={false}
      disableStyle={false}
    />
  ) : null;
};

export default Cookiebar;
