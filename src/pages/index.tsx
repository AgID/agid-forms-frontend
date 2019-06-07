import { graphql } from "gatsby";
import * as React from "react";
import Image from "../components/Image";
import Layout from "../components/Layout";
import SEO from "../components/Seo";

import { gql } from "apollo-boost";
import { Mutation, Query } from "react-apollo";

const GET_SECRET = gql`
  mutation RequestEmail($cod_amm: String!, $body: String!) {
    RequestEmailResponse(cod_amm: $cod_amm, body: $body)
      @rest(
        path: "/auth/email/{args.cod_amm}"
        type: "GetPaFromIpa"
        method: "POST"
        bodyKey: "body"
      ) {
      cod_amm
    }
  }
`;

const GET_TOKENS = gql`
  mutation RequestTokens($cod_amm: String!, $secret: LoginCredentialsInput!) {
    RequestTokensResponse(cod_amm: $cod_amm, body: $secret)
      @rest(
        path: "/auth/login/{args.cod_amm}"
        type: "LoginTokens"
        method: "POST"
        bodyKey: "body"
      ) {
      graphql_token
      backend_token
    }
  }
`;

const GET_IPA = gql`
  query GetIpa {
    ipa_pa(where: { cod_amm: { _eq: "agid" } }) {
      cod_amm
      des_amm
    }
    ipa_ou(
      where: {
        _and: {
          cod_amm: { _eq: "agid" }
          cod_ou: { _eq: "Ufficio_Transizione_Digitale" }
        }
      }
    ) {
      cod_ou
      nome_resp
      cogn_resp
      mail_resp
    }
  }
`;

type TSFix = {
  data?: any;
};

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
              getSecret({ variables: { cod_amm: "agid", body: "{}" } })
            }
          >
            getSecret
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
