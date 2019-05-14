import { graphql } from "gatsby";
import * as React from "react";
import Image from "../components/Image";
import Layout from "../components/Layout";
import SEO from "../components/Seo";

type MenuConfigQueryT = {
  data: any;
};

const IndexPage = ({ data }: MenuConfigQueryT) => {
  return (
    <Layout menu={data.allConfigYaml.edges[0].node.menu}>
      <SEO title="Home" meta={[]} keywords={[]} />
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query IndexConfigQuery {
    allConfigYaml {
      edges {
        node {
          menu {
            name
            slug
            subtree {
              name
              slug
              subtitle
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
