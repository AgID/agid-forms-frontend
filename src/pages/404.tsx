import { graphql } from "gatsby";
import * as React from "react";
import Layout from "../components/Layout";
import SEO from "../components/Seo";

type MenuConfigQueryT = {
  data: any;
};

const NotFoundPage = ({ data }: MenuConfigQueryT) => (
  <Layout menu={data.menu}>
    <SEO title="404: Not found" meta={[]} />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Layout>
);

export const query = graphql`
  query NotFoundConfigQuery {
    configYaml {
      menu {
        name
        slug
        subtree {
          name
          slug
        }
      }
    }
  }
`;

export default NotFoundPage;
