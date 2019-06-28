import { graphql } from "gatsby";
import * as React from "react";
import Layout from "../components/Layout";
import SEO from "../components/Seo";
import { NotFoundConfig } from "../generated/graphql/NotFoundConfig";
import { getMenu, getSiteConfig } from "../graphql/gatsby_fragments";

const NotFoundPage = ({ data }: { data: NotFoundConfig }) => (
  <Layout
    menu={getMenu(data)}
    siteConfig={getSiteConfig(data)}
    title="Pagina non trovata"
  >
    <SEO title="404: Not found" meta={[]} keywords={[]} />
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Layout>
);

export const query = graphql`
  query NotFoundConfig {
    menu: allConfigYaml(
      filter: { menu: { elemMatch: { name: { ne: null } } } }
    ) {
      ...PageConfigFragment
    }
    siteConfig: allConfigYaml(filter: { title: { ne: null } }) {
      ...SiteConfigFragment
    }
  }
`;

export default NotFoundPage;
