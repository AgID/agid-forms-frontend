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
        update_columns: [language, status, title, content, version]
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

export const GET_LATEST_NODE_WITH_PUBLISHED = gql`
  query GetNode($id: uuid!) {
    latest: node(where: { id: { _eq: $id } }) {
      id
      created_at
      updated_at
      title
      content
      language
      status
      version
      type
      published: revisions(
        where: { status: { _eq: "published" } }
        order_by: { version: desc }
        limit: 1
      ) {
        id
        created_at
        updated_at
        title
        content
        language
        status
        version
      }
    }
  }
`;

export const GET_NODE_REVISION = gql`
  query GetNodeRevision($id: uuid!, $version: Int!) {
    revision: node_revision(
      where: { _and: { id: { _eq: $id }, version: { _eq: $version } } }
    ) {
      id
      created_at
      updated_at
      title
      content
      language
      status
      version
      type
    }
  }
`;

// (where: { user_id: { _eq: $userId } })
export const GET_USER_NODES = gql`
  query GetUserNodes {
    node {
      id
      created_at
      updated_at
      title
      language
      status
      version
      type
    }
  }
`;

export const GET_USER_INFO = gql`
  query GetUserInfo($userId: uuid) {
    user(where: { id: { _eq: $userId } }) {
      id
      email
    }
  }
`;
