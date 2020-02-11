import { Link } from "gatsby";
import * as React from "react";

import MegaMenu from "./MegaMenu";

import { getMenu, getSiteConfig } from "../graphql/gatsby";
import { getSessionInfo } from "../utils/auth";
import Icon from "./Icon";

type MainHeaderProps = Pick<
  NonNullable<ReturnType<typeof getSiteConfig>>,
  // tslint:disable-next-line: max-union-size
  "title" | "description" | "socialLinks" | "siteLogo"
> & {
  menu: ReturnType<typeof getMenu>;
  organization: string;
  user: ReturnType<typeof getSessionInfo>;
};

const MainHeader = ({
  title,
  description,
  menu,
  socialLinks,
  organization,
  user,
  siteLogo
}: MainHeaderProps) => (
  <>
    <div className="it-nav-wrapper">
      <div className="it-header-center-wrapper it-small-header" role="banner">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="it-header-center-content-wrapper">
                <div className="it-brand-wrapper">
                  <Link to="/">
                    {siteLogo && <img src={siteLogo} alt="Logo" />}
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
              <MegaMenu menu={menu} user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default MainHeader;
