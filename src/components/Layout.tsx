import "./layout.scss";

import { graphql, StaticQuery } from "gatsby";
import * as React from "react";
import { Container } from "reactstrap";

import Footer from "./Footer";
import MainHeader from "./MainHeader";
import SlimHeader from "./SlimHeader";

require("typeface-lora");
require("typeface-titillium-web");

type LayoutProps = { children: React.ReactNode; menu: any };

const Layout = ({ children, menu }: LayoutProps) => (
  <StaticQuery
    query={graphql`
      query SiteConfigQuery {
        allConfigYaml {
          edges {
            node {
              title
              description
              owners {
                name
                url
              }
              slimHeaderLinks {
                name
                url
              }
              socialLinks {
                name
                url
                icon
              }
              footerLinks {
                name
                url
              }
            }
          }
        }
      }
    `}
    render={data => {
      const config = data.allConfigYaml.edges[1].node;
      return (
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
              owners={config.owners}
              slimHeaderLinks={config.slimHeaderLinks}
            />
            <MainHeader
              title={config.title}
              description={config.description}
              socialLinks={config.socialLinks}
              menu={menu}
            />
          </div>
          <Container className="justify-content-md-center main" id="main">
            {children}
          </Container>
          <Footer
            id="footer"
            footerLinks={config.footerLinks}
            socialLinks={config.socialLinks}
          />
        </>
      );
    }}
  />
);

export default Layout;
