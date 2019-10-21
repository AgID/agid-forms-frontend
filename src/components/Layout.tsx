require("typeface-lora");
require("typeface-titillium-web");

import "../styles/global.scss";

import * as React from "react";
import { Container } from "reactstrap";

import ContextMenu from "./ContextMenu";
import Cookiebar from "./Cookiebar";
import Footer from "./Footer";
import Hotjar from "./Hotjar";
import MainHeader from "./MainHeader";
import SlimHeader from "./SlimHeader";

import { navigate } from "gatsby";
import { Trans } from "react-i18next";
import { GraphqlClient } from "../graphql/client";
import { getContextualMenu, getMenu, getSiteConfig } from "../graphql/gatsby";
import { getSessionInfo, logout } from "../utils/auth";

type LayoutProps = {
  children: React.ReactNode;
  menu: ReturnType<typeof getMenu>;
  contextMenu?: ReturnType<typeof getContextualMenu>;
  siteConfig: ReturnType<typeof getSiteConfig>;
  title?: string;
};

const Layout = ({
  children,
  menu,
  title,
  siteConfig,
  contextMenu
}: LayoutProps) => {
  if (!siteConfig) {
    return <p>missing site configuration.</p>;
  }
  const sessionInfo = getSessionInfo();

  return (
    <div className="layout-container">
      {siteConfig.cookiePolicyLink && (
        <Cookiebar policyLink={siteConfig.cookiePolicyLink} />
      )}
      {siteConfig.hotjar &&
        siteConfig.hotjar.hjsv &&
        siteConfig.hotjar.hjid && (
          <Hotjar hjsv={siteConfig.hotjar.hjsv} hjid={siteConfig.hotjar.hjid} />
        )}
      <div className="skiplinks" role="navigation" aria-label="skiplinks">
        <a className="sr-only sr-only-focusable" href="#main">
          <Trans i18nKey="skiplinks.goto_main" />
        </a>
        <a className="sr-only sr-only-focusable" href="#footer">
          <Trans i18nKey="skiplinks.goto_footer" />
        </a>
      </div>
      <div className="it-header-wrapper">
        <SlimHeader
          owners={siteConfig.owners}
          slimHeaderLinks={siteConfig.slimHeaderLinks}
          languages={siteConfig.languages}
          user={sessionInfo}
          onLogout={async () => {
            await logout(GraphqlClient);
            navigate("/");
          }}
        />
        <MainHeader
          title={siteConfig.title}
          description={siteConfig.description}
          socialLinks={siteConfig.socialLinks}
          siteLogo={siteConfig.siteLogo}
          menu={menu}
          user={sessionInfo}
          organization={sessionInfo ? sessionInfo.organizationName : ""}
        />
      </div>
      <Container
        className="py-lg-5 px-3 px-lg-0 justify-content-md-center main"
        id="main"
      >
        <main>
          {title && (
            <h1 className="px-2 py-3 py-lg-0 px-lg-0 main-title">{title}</h1>
          )}
          <div className="page-container py-1 mt-md-2 d-md-flex">
            {contextMenu && (
              <div className="col-md-3 pr-4 pt-2">
                <ContextMenu
                  contextMenu={contextMenu}
                  siteName={siteConfig.title || ""}
                />
              </div>
            )}
            <div className="main-content">{children}</div>
          </div>
        </main>
      </Container>
      <Footer {...siteConfig} />
    </div>
  );
};

export default Layout;
