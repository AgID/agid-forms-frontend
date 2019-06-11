import { graphql, Link } from "gatsby";
import * as React from "react";

// @ts-ignore
import { PageConfigFragment } from "../graphql/gatsby_fragments";

import Layout from "../components/Layout";
import SEO from "../components/Seo";

type MenuConfigQueryT = {
  data: any;
};

const ActionsPage = ({ data }: MenuConfigQueryT) => (
  <Layout menu={data.allConfigYaml.edges[0].node.menu}>
    <SEO title="Actions" meta={[]} keywords={[]} />
    <h1>Modulistica AGID</h1>

    <div>
      <Link to="/form/dichiarazione-accessibilita">
        Nuova dichiarazione di accessibilità
      </Link>
    </div>
  </Layout>
);

export const query = graphql`
  query ActionsPageConfig {
    allConfigYaml(filter: { menu: { elemMatch: { name: { ne: null } } } }) {
      ...PageConfigFragment
    }
  }
`;

export default ActionsPage;
