import gql from "graphql-tag";

export const SEARCH_IPA = gql`
  query SearchIpa($search: String!) {
    search_ipa(args: { search: $search }) {
      cod_amm
      des_amm
      Comune
    }
    ipa_pa(where: { cod_amm: { _eq: $search } }) {
      cod_amm
      des_amm
      Comune
    }
  }
`;

export const GET_IPA = gql`
  query GetIpa($ipa_code: String!) {
    ipa_pa(where: { cod_amm: { _eq: $ipa_code } }) {
      cod_amm
      des_amm
      Comune
    }
    ipa_ou(
      where: {
        _and: {
          cod_amm: { _eq: $ipa_code }
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

export const UPSERT_NODE = gql`
  mutation UpsertNode($node: node_insert_input!) {
    insert_node(
      objects: [$node]
      on_conflict: {
        constraint: node_pkey
        update_columns: [language, status, title, content]
      }
    ) {
      returning {
        id
        type
        created_at
        updated_at
        language
        status
        title
        content
        version
      }
    }
  }
`;
