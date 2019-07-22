import { Link } from "gatsby";
import * as React from "react";

import MegaMenu from "./MegaMenu";

import { getMenu, getSiteConfig } from "../graphql/gatsby_fragments";
import Icon from "./Icon";

type MainHeaderProps = Pick<
  ReturnType<typeof getSiteConfig>,
  "title" | "description" | "socialLinks"
> & { menu: ReturnType<typeof getMenu>; organization: string };

const MainHeader = ({
  title,
  description,
  menu,
  socialLinks,
  organization
}: MainHeaderProps) => (
  <>
    <div className="it-nav-wrapper">
      <div className="it-header-center-wrapper it-small-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="it-header-center-content-wrapper">
                <div className="it-brand-wrapper">
                  <Link to="/">
                    {/* <Icon icon="code-circle" /> */}
                    <div className="it-brand-text">
                      <h2 className="no_toc">{title}</h2>
                      <h3 className="no_toc d-none d-md-block">
                        {description}
                      </h3>
                    </div>
                  </Link>
                </div>
                <div className="it-right-zone">
                  <div className="d-none d-lg-block">{organization}</div>
                  <div className="it-socials d-none d-md-flex">
                    <ul>
                      {(socialLinks || []).map(
                        socialLink =>
                          socialLink &&
                          socialLink.name &&
                          socialLink.url &&
                          socialLink.icon && (
                            <li key={socialLink.name}>
                              <a
                                href={socialLink.url}
                                aria-label={socialLink.name}
                              >
                                <Icon icon={socialLink.icon} />
                              </a>
                            </li>
                          )
                      )}
                    </ul>
                  </div>
                  <div className="it-search-wrapper" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="it-header-navbar-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <MegaMenu menu={menu} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default MainHeader;
