import { graphql, Link } from "gatsby";
import * as React from "react";

import {
  getMenu,
  getSiteConfig,
  // @ts-ignore
  PageConfigFragment
} from "../graphql/gatsby_fragments";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import { ActionsPageConfig } from "../generated/graphql/ActionsPageConfig";

const getForms = (data: ActionsPageConfig) => data.forms!.edges;

const ActionsPage = ({ data }: { data: ActionsPageConfig }) => (
  <Layout menu={getMenu(data)} siteConfig={getSiteConfig(data)}>
    <SEO title="Actions" meta={[]} keywords={[]} />
    <h1>Modulistica AGID</h1>
    <ul>
      {getForms(data).map(({ node }) => {
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
    menu: allConfigYaml(
      filter: { menu: { elemMatch: { name: { ne: null } } } }
    ) {
      ...PageConfigFragment
    }
    siteConfig: allConfigYaml(filter: { title: { ne: null } }) {
      ...SiteConfigFragment
    }
    forms: allFormYaml(filter: { enabled: { eq: true } }) {
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
