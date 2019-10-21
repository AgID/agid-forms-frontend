import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";

import { getContextualMenu, getMenu, getSiteConfig } from "../graphql/gatsby";
import Layout from "./Layout";

const StaticLayout = ({
  children,
  title,
  contextMenu
}: {
  children: React.ReactNode;
  title?: string;
  contextMenu?: ReturnType<typeof getContextualMenu>;
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
    if (!contextMenu && section) {
      setInnerContextMenu(getContextualMenu(data, section));
    }
  }, []);

  return (
    <Layout
      siteConfig={getSiteConfig(data)}
      menu={getMenu(data)}
      title={title}
      contextMenu={innerContextMenu}
    >
      {children}
    </Layout>
  );
};

export default StaticLayout;
