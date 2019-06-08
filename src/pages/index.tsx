import { graphql } from "gatsby";
import * as React from "react";
import Image from "../components/Image";
import Layout from "../components/Layout";
import SEO from "../components/Seo";

import { GET_SECRET, GET_TOKENS } from "../apollo/backend_queries";
import { GET_IPA } from "../apollo/hasura_queries";

import { Mutation, Query } from "react-apollo";

type MenuConfigQueryT = {
  data: any;
};

import { GetIpa } from "../generated/graphql/GetIpa";

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
      <Query<GetIpa> query={GET_IPA}>
        {({ loading, error, data: pdata }) => {
          if (loading) {
            return <div>Loading...</div>;
          }
          if (error) {
            return <div>Error</div>;
          }
          if (pdata) {
            return JSON.stringify(pdata.ipa_pa[0]);
          }
          return "";
        }}
      </Query>{" "}
      <Mutation mutation={GET_SECRET}>
        {(getSecret: any) => (
          <button
            onClick={() =>
              getSecret({ variables: { ipa_code: "agid", body: {} } })
            }
          >
            getSecret
          </button>
        )}
      </Mutation>{" "}
      <Mutation mutation={GET_TOKENS}>
        {(getTokens: any) => (
          <button
            onClick={() =>
              getTokens({
                variables: {
                  body: {
                    secret: "x"
                  }
                }
              })
            }
          >
            getTokens
          </button>
        )}
      </Mutation>{" "}
    </Layout>
  );
};

export const query = graphql`
  query IndexConfigQuery {
    allConfigYaml(filter: { menu: { elemMatch: { name: { ne: null } } } }) {
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
