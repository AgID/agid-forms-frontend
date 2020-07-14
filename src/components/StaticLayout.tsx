import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import URLSearchParams from '@ungap/url-search-params'

import { getContextualMenu, getMenu, getSiteConfig } from "../graphql/gatsby";
import { IBreadcrumbItem } from "./Breadcrumb";
import Layout from "./Layout";

const StaticLayout = ({
  children,
  title,
  contextMenu,
  breadcrumbItems
}: {
  children: React.ReactNode;
  title?: string;
  contextMenu?: ReturnType<typeof getContextualMenu>;
  breadcrumbItems?: ReadonlyArray<IBreadcrumbItem>;
}) => {
  const [innerContextMenu, setInnerContextMenu] = React.useState(contextMenu);

  const data = useStaticQuery(graphql`
    query LayoutQuery {
      menu: allConfigYaml(
        filter: { menu: { elemMatch: { name: { ne: null } } } }
      ) {
        ...MenuFragment
      }
      siteConfig: allConfigYaml(filter: { title: { ne: null } }) {
        ...SiteConfigFragment
      }
      allMenuYaml {
        ...ContextualMenuFragment
      }
    }
  `);

  // extract contextual menu from URL
  React.useEffect(() => {
    const section = window.location.pathname.split("/")[2];
    const nodeId = (new URLSearchParams(window.location.search)).get("id");
    if (!contextMenu && section) {
      setInnerContextMenu(getContextualMenu(data, section, nodeId));
    } else if (contextMenu) {
      setInnerContextMenu(contextMenu);
    }
  });

  return (
    <Layout
      siteConfig={getSiteConfig(data)}
      menu={getMenu(data)}
      title={title}
      contextMenu={innerContextMenu}
      breadcrumbItems={breadcrumbItems}
    >
      {children}
    </Layout>
  );
};

export default StaticLayout;
