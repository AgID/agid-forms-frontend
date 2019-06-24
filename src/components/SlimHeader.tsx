import * as React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap";
import { getSiteConfig } from "../graphql/gatsby_fragments";
import { getUser, isLoggedIn } from "../utils/auth";
import Icon from "./Icon";

type SlimHeaderProps = Pick<
  ReturnType<typeof getSiteConfig>,
  // tslint:disable-next-line: max-union-size
  "owners" | "slimHeaderLinks" | "defaultLanguage" | "languages"
> & { user: ReturnType<typeof getUser> } & { onLogout: (args: any) => any };

export const SlimHeader = ({
  owners,
  slimHeaderLinks,
  defaultLanguage,
  languages,
  user,
  onLogout
}: SlimHeaderProps) => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = React.useState(
    false
  );
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
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
                              <a href={slimHeaderLink.url} className="px-3">
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
                    isOpen={isLanguageDropdownOpen}
                    toggle={() =>
                      setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                    }
                  >
                    <DropdownToggle
                      caret={true}
                      tag="a"
                      className="nav-link"
                      style={{
                        cursor: "pointer"
                      }}
                    >
                      {defaultLanguage}
                      <Icon className="icon d-block" icon="expand" />
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
                <div className="it-access-top-wrapper">
                  {isLoggedIn() && user ? (
                    <Dropdown
                      isOpen={isUserDropdownOpen}
                      toggle={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    >
                      <DropdownToggle
                        caret={true}
                        tag="a"
                        className="btn btn-primary btn-xs"
                        style={{
                          cursor: "pointer",
                          marginRight: "-16px"
                        }}
                      >
                        <Icon className="icon d-block d-md-none" icon="user" />
                        <Icon
                          className="icon d-none d-md-block"
                          icon="expand"
                        />
                        <span className="icon d-none d-md-block text-lowercase">
                          {user.email}
                        </span>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu">
                        <span className="d-inline-block d-md-none p-4">
                          {user.email}
                        </span>
                        <DropdownItem tag="span">
                          <a
                            className="list-item text-primary"
                            href={`/user/${user.id}`}
                          >
                            <span>profile</span>
                          </a>
                        </DropdownItem>
                        <DropdownItem tag="span">
                          <a
                            className="list-item text-primary"
                            href="#"
                            onClick={onLogout}
                          >
                            <span className="text-danger">logout</span>
                          </a>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  ) : (
                    <a href="/" className="btn btn-primary btn-sm">
                      Accedi
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlimHeader;
