import { Link } from "gatsby";
import * as React from "react";

import { CSSTransition } from "react-transition-group";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap";
import { getMenu } from "../graphql/gatsby_fragments";
import Icon from "./Icon";

type MegaMenuProps = {
  menu: ReturnType<typeof getMenu>;
};

const BACKGROUND_COLOR = "#0066cc";
const FOREGROUND_COLOR = "#fff";

const dropdownModifiers = (isOffcanvasOpen: boolean) => ({
  relativePosition: {
    enabled: true,
    fn: (data: any) =>
      isOffcanvasOpen
        ? {
            ...data,
            styles: {
              ...data.styles,
              position: "relative",
              transform: "none"
            }
          }
        : {
            ...data,
            styles: {
              ...data.styles,
              borderRadius: "4px",
              transform: "translate3d(15px, 45px, 0px)",
              animationDuration: "0.2s"
            }
          }
  }
});

export const MegaMenu = ({ menu }: MegaMenuProps) => {
  if (!menu) {
    return <></>;
  }
  const [isOffcanvasOpen, setIsOffcanvasOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState({} as Record<
    string,
    boolean
  >);

  return (
    <nav className="navbar navbar-expand-lg has-megamenu">
      <button
        className="custom-navbar-toggler"
        type="button"
        aria-controls="navbarNavC"
        aria-expanded={isOffcanvasOpen}
        aria-label="Toggle navigation"
        onClick={() => setIsOffcanvasOpen(!isOffcanvasOpen)}
      >
        <Icon className="icon icon-sm icon-light" icon="burger" />
      </button>

      <CSSTransition
        in={isOffcanvasOpen}
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
        <div className={`navbar-collapsable`} id="navbarNavC">
          <div
            className={`overlay ${isOffcanvasOpen ? "d-block" : "d-none"}`}
            onClick={() => setIsOffcanvasOpen(!isOffcanvasOpen)}
          />
          <div className="close-div sr-only">
            <button
              className="btn close-menu"
              type="button"
              onClick={() => setIsOffcanvasOpen(!isOffcanvasOpen)}
            >
              <Icon className="icon icon-sm icon-light" icon="close" />
              close
            </button>
          </div>
          <div className="menu-wrapper">
            <ul className="navbar-nav">
              {menu.map(menuItem => {
                return (
                  menuItem &&
                  menuItem.name &&
                  (menuItem.subtree ? (
                    <Dropdown
                      key={menuItem.slug!}
                      className="nav-item megamenu"
                      tag="li"
                      isOpen={isDropdownOpen[menuItem.slug!]}
                      toggle={() =>
                        setIsDropdownOpen({
                          [menuItem.slug!]: isDropdownOpen[menuItem.slug!]
                            ? !isDropdownOpen[menuItem.slug!]
                            : true
                        })
                      }
                    >
                      <DropdownToggle
                        caret={true}
                        tag="a"
                        className="nav-link"
                        role="button"
                        style={{
                          cursor: "pointer"
                        }}
                      >
                        {menuItem.name}
                        <Icon
                          className="icon d-inline-block"
                          icon="expand"
                          style={{
                            fill: !isOffcanvasOpen
                              ? FOREGROUND_COLOR
                              : BACKGROUND_COLOR
                          }}
                        />
                      </DropdownToggle>
                      <DropdownMenu
                        modifiers={dropdownModifiers(isOffcanvasOpen)}
                      >
                        <div className="link-list-wrapper">
                          <ul className="two-columns mt-2">
                            {menuItem.subtree.map(
                              item =>
                                item &&
                                item.slug && (
                                  <DropdownItem
                                    tag="li"
                                    key={item.slug}
                                    className="p-0"
                                  >
                                    <Link to={item.slug} className="p-0">
                                      {item.name}
                                    </Link>
                                  </DropdownItem>
                                )
                            )}
                          </ul>
                        </div>
                      </DropdownMenu>
                    </Dropdown>
                  ) : (
                    <li className="nav-item megamenu">
                      <Link
                        to={menuItem.slug!}
                        className="nav-link dropdown-toggle"
                      >
                        {menuItem.name}
                      </Link>
                    </li>
                  ))
                );
              })}
            </ul>
          </div>
        </div>
      </CSSTransition>
    </nav>
  );
};

export default MegaMenu;
