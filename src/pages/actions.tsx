import { graphql, Link } from "gatsby";
import * as React from "react";

// @ts-ignore
import { PageConfigFragment } from "../graphql/gatsby_fragments";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import { ActionsPageConfig } from "../generated/graphql/ActionsPageConfig";

const ActionsPage = ({ data }: { data: ActionsPageConfig }) => (
  <Layout menu={data.allConfigYaml!.edges[0].node.menu}>
    <SEO title="Actions" meta={[]} keywords={[]} />
    <h1>Modulistica AGID</h1>
    <ul>
      {data.allFormYaml!.edges.map(({ node }) => {
        return (
          <li key={node.id}>
            <Link to={`/form/${node.id}`}>{node.name}</Link>
          </li>
        );
      })}
    </ul>
  </Layout>
);

export const query = graphql`
  query ActionsPageConfig {
    allConfigYaml(filter: { menu: { elemMatch: { name: { ne: null } } } }) {
      ...PageConfigFragment
    }
    allFormYaml {
      edges {
        node {
          id
          version
          name
        }
      }
    }
  }
`;

export default ActionsPage;
