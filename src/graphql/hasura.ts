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

export const NodeFragment = gql`
  fragment NodeFragment on node {
    id
    created_at
    updated_at
    title
    node_group {
      group
      group_ipa_pa {
        des_amm
      }
    }
    content
    language
    status
    version
    type
  }
`;

export const NodeRevisionFragment = gql`
  fragment NodeRevisionFragment on node_revision {
    id
    created_at
    updated_at
    title
    node_revision_group {
      group
      group_ipa_pa {
        des_amm
      }
    }
    content
    language
    status
    version
    type
  }
`;

export const UPSERT_NODE = gql`
  mutation UpsertNode($node: node_insert_input!) {
    insert_node(
      objects: [$node]
      on_conflict: {
        constraint: node_pkey
        update_columns: [status, title, content, version]
      }
    ) {
      returning {
        ...NodeFragment
      }
    }
  }

  ${NodeFragment}
`;

export const GET_LATEST_NODE_WITH_PUBLISHED = gql`
  query GetNode($id: uuid!) {
    latest: node(where: { id: { _eq: $id } }, limit: 1) {
      ...NodeFragment
      published: revisions(
        where: { status: { _eq: "published" } }
        order_by: { version: desc }
        limit: 1
      ) {
        ...NodeRevisionFragment
      }
    }
  }

  ${NodeFragment}
  ${NodeRevisionFragment}
`;

export const GET_NODE_REVISION_WITH_PUBLISHED = gql`
  query GetNodeRevision($id: uuid!, $version: Int!) {
    revision: node_revision(
      where: { _and: { id: { _eq: $id }, version: { _eq: $version } } }
      limit: 1
    ) {
      ...NodeRevisionFragment
    }
    published: node_revision(
      where: { _and: { id: { _eq: $id }, status: { _eq: "published" } } }
      order_by: { version: desc }
      limit: 1
    ) {
      ...NodeRevisionFragment
    }
  }

  ${NodeRevisionFragment}
`;

export const GET_USER_NODES = gql`
  query GetUserNodes($userId: uuid) {
    node(where: { user_id: { _eq: $userId } }) {
      id
      created_at
      updated_at
      title
      group
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
