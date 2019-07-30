import * as React from "react";
import { Trans } from "react-i18next";

const Cookiebar = () => {
  return (
    <div className="cookiebar">
      <p>
        <Trans i18nKey="cookiebar.alert" />
      </p>
      <div className="cookiebar-buttons">
        <a href="#" className="cookiebar-btn">
          <Trans i18nKey="cookiebar.settings">
            Preferences <span className="sr-only">cookies</span>
          </Trans>
        </a>
        <button
          data-accept="cookiebar"
          className="cookiebar-btn cookiebar-confirm"
        >
          <Trans i18nKey="cookiebar.accept">
            Accept <span className="sr-only">cookies</span>
          </Trans>
        </button>
      </div>
    </div>
  );
};

export default Cookiebar;
