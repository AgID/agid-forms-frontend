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
    <nav className="sidebar-wrapper it-line-right-side">
      <div className="sidebar-linklist-wrapper">
        <div className="link-list-wrapper">
          {" "}
          <h2 className="display-3 no_toc mb-4">
            <Link to="/" className="primary-color-a12 text-decoration-none">
              <span className="primary-color-a9">&lt;</span> {siteName}
            </Link>
          </h2>
          <ul className="link-list">
            {contextMenu.menu.items.slice(0, 1).map(item => {
              return (
                item && (
                  <li
                    key={item.slug!}
                    className="mb-md-2"
                    style={{ borderLeft: "4px solid blue" }}
                  >
                    <Link
                      to={item.slug!}
                      className="list-item large py-2 font-weight-bold neutral-1-color-b5"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              );
            })}
            {contextMenu.menu.items.slice(1).map(item => {
              return (
                item && (
                  <li key={item.slug!} className="mb-md-2 pl-3">
                    <Link
                      to={item.slug!}
                      className="list-item large py-2"
                      activeClassName="font-weight-bold primary-color-a11"
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
