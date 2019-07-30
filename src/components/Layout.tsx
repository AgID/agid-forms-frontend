require("typeface-lora");
require("typeface-titillium-web");

import "../styles/global.scss";

import * as React from "react";
import { Container } from "reactstrap";

import Footer from "./Footer";
import Hotjar from "./Hotjar";
import MainHeader from "./MainHeader";
import SlimHeader from "./SlimHeader";

import { navigate } from "gatsby";
import { Trans } from "react-i18next";
import { GraphqlClient } from "../graphql/client";
import { getMenu, getSiteConfig } from "../graphql/gatsby";
import { getSessionInfo, logout } from "../utils/auth";

type LayoutProps = {
  children: React.ReactNode;
  menu: ReturnType<typeof getMenu>;
  siteConfig: ReturnType<typeof getSiteConfig>;
  title?: string;
};

const Layout = ({ children, menu, title, siteConfig }: LayoutProps) => {
  if (!siteConfig) {
    return <p>missing site configuration.</p>;
  }
  const sessionInfo = getSessionInfo();
  return (
    <div className="layout-container">
      {siteConfig.hotjar &&
        siteConfig.hotjar.hjsv &&
        siteConfig.hotjar.hjid && (
          <Hotjar hjsv={siteConfig.hotjar.hjsv} hjid={siteConfig.hotjar.hjid} />
        )}
      <div className="skiplinks">
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
          menu={menu}
          user={sessionInfo}
          organization={sessionInfo ? sessionInfo.organizationName : ""}
        />
      </div>
      <Container className="py-5 justify-content-md-center main" id="main">
        <main>
          {title && <h1 style={{ color: "white" }}>{title}</h1>}
          <div className="page-container shadow-md py-4 py-md-5 px-md-5 mt-md-4 rounded bg-white">
            {children}
          </div>
        </main>
      </Container>
      <Footer id="footer" {...siteConfig} />
    </div>
  );
};

export default Layout;
