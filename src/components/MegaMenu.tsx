import classNames from "classnames";
import { Link } from "gatsby";
import * as React from "react";
import { CSSTransition } from "react-transition-group";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";

import Icon from "./Icon";

type SubTree = ReadonlyArray<{
  name: string;
  slug: string;
  subtitle: string;
  subtree: SubTree;
}>;

type MegaMenuProps = {
  menu: ReadonlyArray<{
    name: string;
    slug: string;
    subtitle: string;
    subtree: SubTree;
  }>;
};

type MegaMenuState = {
  isOffcanvasOpen: boolean;
  isDropdownOpen: { [k: string]: boolean };
};

class MegaMenu extends React.Component<MegaMenuProps, MegaMenuState> {
  constructor(props: MegaMenuProps) {
    super(props);
    this.state = {
      isOffcanvasOpen: false,
      isDropdownOpen: {}
    };
  }

  public toggleOffcanvas() {
    this.setState(prevState => {
      return {
        isOffcanvasOpen: !prevState.isOffcanvasOpen
      };
    });
  }

  public toggleDropdown(menuItem: string) {
    this.setState(prevState => {
      const isDropdownOpen = {
        ...prevState.isDropdownOpen,
        menuItem: !prevState.isDropdownOpen[menuItem]
      };
      return {
        isDropdownOpen
      };
    });
  }

  public renderMenu(parentSlug: string, menuTree: SubTree, depth = 0) {
    return (
      <ul className={`depth-${depth} p-${depth > 0 ? "0" : "2"} megamenu-list`}>
        {menuTree.map(subMenuItem => (
          <li
            className={`mx-${depth > 0 ? "2" : "4"} my-2`}
            key={`${parentSlug}-${subMenuItem.slug}`}
          >
            <Link
              className="w-100 d-inline-block"
              to={`/${parentSlug}/${subMenuItem.slug}`}
            >
              {subMenuItem.name}{" "}
              <span className="sr-only">{subMenuItem.subtitle}</span>
            </Link>
            {subMenuItem.subtree &&
              this.renderMenu(
                `/${parentSlug}/${subMenuItem.slug}`,
                subMenuItem.subtree,
                depth + 1
              )}
          </li>
        ))}
      </ul>
    );
  }

  public render() {
    return (
      <nav
        className="navbar navbar-expand-lg has-megamenu"
        aria-label="main navigation"
      >
        <button
          className="custom-navbar-toggler"
          type="button"
          aria-controls="megaMenu"
          aria-expanded={this.state.isOffcanvasOpen}
          aria-label="Toggle navigation"
          onClick={() => this.toggleOffcanvas()}
        >
          <Icon icon="list" />
        </button>
        <CSSTransition
          in={this.state.isOffcanvasOpen}
          timeout={{
            enter: 1,
            exit: 300
          }}
          classNames={{
            enter: "navbar-collapsable d-block",
            enterDone: "navbar-collapsable d-block expanded",
            exit: "navbar-collapsable d-block",
            exitDone: "navbar-collapsable"
          }}
        >
          {() => (
            <div className="navbar-collapsable" id="megaMenu">
              <div
                className="overlay d-block"
                onClick={() => this.toggleOffcanvas()}
              />
              <div className="close-div sr-only">
                <button
                  className="btn close-menu"
                  type="button"
                  onClick={() => this.toggleOffcanvas()}
                >
                  <Icon icon="close" />
                  close
                </button>
              </div>
              <div className="menu-wrapper">
                <ul className="navbar-nav">
                  {this.props.menu.map(menuItem => (
                    <li
                      key={menuItem.slug}
                      className={classNames({
                        "mb-3": this.state.isOffcanvasOpen
                      })}
                    >
                      {menuItem.subtree ? (
                        <Dropdown
                          isOpen={
                            this.state.isOffcanvasOpen ||
                            this.state.isDropdownOpen[menuItem.slug]
                          }
                          toggle={() => this.toggleDropdown(menuItem.slug)}
                          className="nav-item megamenu"
                        >
                          <DropdownToggle
                            tag="a"
                            className="nav-link dropdown-toggle"
                            style={{
                              marginBottom: this.state.isOffcanvasOpen
                                ? "-16px"
                                : "",
                              cursor: "pointer"
                            }}
                          >
                            {menuItem.name}
                            <Icon
                              icon="expand"
                              className={classNames("icon-xs", "ml-1", {
                                "d-none": this.state.isOffcanvasOpen
                              })}
                            />
                          </DropdownToggle>
                          <DropdownMenu
                            modifiers={{
                              relativePosition: {
                                enabled: true,
                                order: 890,
                                fn: (data: any) => {
                                  data = this.state.isOffcanvasOpen
                                    ? /* eslint-disable indent */
                                      {
                                        ...data,
                                        styles: {
                                          ...data.styles,
                                          borderRadius: "4px",
                                          position: "relative",
                                          transform: "none",
                                          animationDuration: "0.1s"
                                        }
                                      }
                                    : {
                                        ...data,
                                        styles: {
                                          ...data.styles,
                                          borderRadius: "4px",
                                          transform:
                                            "translate3d(25px, 35px, 0px)",
                                          animationDuration: "0.1s"
                                        }
                                      };
                                  /* eslint-enable indent */
                                  return data;
                                }
                              }
                            }}
                            className="p-3"
                          >
                            {this.renderMenu(menuItem.slug, menuItem.subtree)}
                          </DropdownMenu>
                        </Dropdown>
                      ) : (
                        <Link
                          to={`/${menuItem.slug}`}
                          className="nav-link dropdown-toggle"
                        >
                          {menuItem.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CSSTransition>
      </nav>
    );
  }
}

export default MegaMenu;
