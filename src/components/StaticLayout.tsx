import { graphql, StaticQuery } from "gatsby";
import * as React from "react";
import { getMenu, getSiteConfig } from "../graphql/gatsby";
import Layout from "./Layout";

const StaticLayout = ({
  children,
  title
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <StaticQuery
      query={graphql`
        query LayoutQuery {
          menu: allConfigYaml(
            filter: { menu: { elemMatch: { name: { ne: null } } } }
          ) {
            ...MenuFragment
          }
          siteConfig: allConfigYaml(filter: { title: { ne: null } }) {
            ...SiteConfigFragment
          }
        }
      `}
      render={data => {
        return (
          <Layout
            siteConfig={getSiteConfig(data)}
            menu={getMenu(data)}
            title={title}
          >
            {children}
          </Layout>
        );
      }}
    />
  );
};

export default StaticLayout;
