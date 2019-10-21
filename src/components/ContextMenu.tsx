import { Link } from "gatsby";
import * as React from "react";
import { FormConfig_allMenuYaml_edges_node } from "../generated/graphql/FormConfig";

const ContextMenu = ({
  contextMenu,
  siteName
}: {
  contextMenu: FormConfig_allMenuYaml_edges_node;
  siteName: string;
}) =>
  contextMenu &&
  contextMenu.menu &&
  contextMenu.menu.items && (
    <nav className="sidebar-wrapper">
      <div className="sidebar-linklist-wrapper">
        <div className="link-list-wrapper">
          {" "}
          <h2 className="display-3 no_toc">
            <Link
              to="/"
              className="primary-color-a12 text-decoration-none font-variant-small-caps"
            >
              <span className="primary-color-a9">&lt;</span>{" "}
              {siteName.toLocaleLowerCase()}
            </Link>
          </h2>
          <ul className="link-list">
            {contextMenu.menu.items.map(item => {
              return (
                item && (
                  <li key={item.slug!}>
                    <Link
                      to={item.slug!}
                      className="list-item large py-2"
                      activeClassName="active"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );

export default ContextMenu;
