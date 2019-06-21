require("typeface-lora");
require("typeface-titillium-web");

import "./layout.scss";

import * as React from "react";
import { Container } from "reactstrap";

import Footer from "./Footer";
import MainHeader from "./MainHeader";
import SlimHeader from "./SlimHeader";

import { getMenu, getSiteConfig } from "../graphql/gatsby_fragments";
import { getUser } from "../utils/auth";

type LayoutProps = {
  children: React.ReactNode;
  menu: ReturnType<typeof getMenu>;
  siteConfig: ReturnType<typeof getSiteConfig>;
};

const Layout = ({ children, menu, siteConfig }: LayoutProps) => (
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
      />
      <MainHeader
        title={siteConfig.title}
        description={siteConfig.description}
        socialLinks={siteConfig.socialLinks}
        menu={menu}
      />
    </div>
    <Container className="py-5 justify-content-md-center main" id="main">
      {children}
    </Container>
    <Footer
      id="footer"
      footerLinks={siteConfig.footerLinks}
      socialLinks={siteConfig.socialLinks}
    />
  </>
);

export default Layout;
