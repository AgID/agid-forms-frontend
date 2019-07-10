require("typeface-lora");
require("typeface-titillium-web");

import "./layout.scss";

import * as React from "react";
import { Container } from "reactstrap";

import Footer from "./Footer";
import MainHeader from "./MainHeader";
import SlimHeader from "./SlimHeader";

import { navigate } from "gatsby";
import { GraphqlClient } from "../graphql/client";
import { getMenu, getSiteConfig } from "../graphql/gatsby_fragments";
import { getUser, logout } from "../utils/auth";

type LayoutProps = {
  children: React.ReactNode;
  menu: ReturnType<typeof getMenu>;
  siteConfig: ReturnType<typeof getSiteConfig>;
  title?: string;
};

const Layout = ({ children, menu, title, siteConfig }: LayoutProps) => (
  <>
    <div className="skiplinks">
      <a className="sr-only sr-only-focusable" href="#main">
        Vai al contenuto principale
      </a>
      <a className="sr-only sr-only-focusable" href="#footer">
        Vai al footer
      </a>
    </div>
    <div className="it-header-wrapper">
      <SlimHeader
        owners={siteConfig.owners}
        slimHeaderLinks={siteConfig.slimHeaderLinks}
        languages={siteConfig.languages}
        defaultLanguage={siteConfig.defaultLanguage}
        user={getUser()}
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
      />
    </div>
    <Container className="py-5 justify-content-md-center main" id="main">
      <main>
        {title && <h1>{title}</h1>}
        <div className="page-container shadow-md py-4 py-md-5 px-md-5 mt-md-4 rounded bg-white">
          {children}
        </div>
      </main>
    </Container>
    <Footer
      id="footer"
      author={siteConfig.author}
      authorLogo={siteConfig.authorLogo}
      authorUrl={siteConfig.authorUrl}
      footerLinks={siteConfig.footerLinks}
      socialLinks={siteConfig.socialLinks}
    />
  </>
);

export default Layout;
