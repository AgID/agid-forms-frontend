import * as React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap";
import { getSiteConfig } from "../graphql/gatsby_fragments";
import Icon from "./Icon";

type SlimHeaderProps = Pick<
  ReturnType<typeof getSiteConfig>,
  // tslint:disable-next-line: max-union-size
  "owners" | "slimHeaderLinks" | "defaultLanguage" | "languages"
>;

export const SlimHeader = ({
  owners,
  slimHeaderLinks,
  defaultLanguage,
  languages
}: SlimHeaderProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="it-header-slim-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="it-header-slim-wrapper-content">
              {(owners || []).map(
                owner =>
                  owner &&
                  owner.url && (
                    <a
                      className="d-none d-lg-block navbar-brand"
                      href={owner.url}
                      key={owner.url}
                      role="button"
                      aria-expanded="false"
                      aria-controls="header-links"
                    >
                      <span>{owner.name}</span>
                    </a>
                  )
              )}
              <div className="nav-mobile">
                <nav>
                  {(owners || []).map(
                    owner =>
                      owner &&
                      owner.url && (
                        <a
                          className="d-lg-none"
                          href={owner.url}
                          key={owner.url}
                          role="button"
                          aria-expanded="false"
                          aria-controls="header-links"
                        >
                          <span>{owner.name}</span>
                        </a>
                      )
                  )}
                  <div className="link-list-wrapper collapse" id="header-links">
                    <ul className="link-list">
                      {(slimHeaderLinks || []).map(
                        slimHeaderLink =>
                          slimHeaderLink &&
                          slimHeaderLink.name &&
                          slimHeaderLink.url && (
                            <li key={slimHeaderLink.name}>
                              <a href={slimHeaderLink.url}>
                                {slimHeaderLink.name}
                              </a>
                            </li>
                          )
                      )}
                    </ul>
                  </div>
                </nav>
              </div>
              <div className="header-slim-right-zone">
                {languages && (
                  <Dropdown
                    className="nav-item"
                    isOpen={isOpen}
                    toggle={() => setIsOpen(!isOpen)}
                  >
                    <DropdownToggle caret={true} tag="a">
                      {defaultLanguage}
                      <Icon className="icon d-none d-lg-block" icon="expand" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu">
                      {(languages || []).map(
                        lang =>
                          lang &&
                          lang.name && (
                            <DropdownItem key={lang.name} tag="span">
                              <a className="list-item text-primary" href="#">
                                <span>{lang.name}</span>
                              </a>
                            </DropdownItem>
                          )
                      )}
                    </DropdownMenu>
                  </Dropdown>
                )}
                {/* TODO */}
                {false && (
                  <div className="it-access-top-wrapper">
                    <button className="btn btn-primary btn-sm" type="button">
                      Accedi
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlimHeader;
