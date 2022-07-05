import gql from "graphql-tag";

export const SEARCH_IPA = gql`
  query SearchIpa($search: String!) {
    search_ipa(args: { search: $search }) {
      cod_amm
      des_amm
      Comune
    }
    ipa_pa(where: { cod_amm: { _ilike: $search } }) {
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
      tipologia_istat
      mail2
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
      cod_uni_ou
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

export const PUBLISH_NODE = gql`
  mutation PublishNode($id: uuid!, $version: Int!) {
    update_node(
      where: { id: { _eq: $id } }
      _set: { status: "published", version: $version }
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
    }
    published: node_revision(
      where: { _and: { id: { _eq: $id }, status: { _eq: "published" } } }
      order_by: { version: desc }
      limit: 1
    ) {
      ...NodeRevisionFragment
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
  query GetUserNodes($userId: uuid!) {
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

export const GET_GROUP_NODES = gql`
  query GetGroupNodes($groupId: String!) {
    node(where: { group: { _eq: $groupId } }) {
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

export const GET_USER_NODES_OF_TYPE = gql`
  query GetUserNodesOfType($userId: uuid!, $nodeType: String!) {
    node: last_published_or_draft(
      where: { _and: { user_id: { _eq: $userId }, type: { _eq: $nodeType } } }
    ) {
      id
      content
      updated_at
      status
      type
    }
  }
`;

export const GET_GROUP_NODES_OF_TYPE = gql`
  query GetGroupNodesOfType($groupId: String!, $nodeType: String!) {
    node: last_published_or_draft(
      where: { _and: { group: { _eq: $groupId }, type: { _eq: $nodeType } } }
    ) {
      id
      content
      updated_at
      status
      type
      version
    }
  }
`;

export const GET_USER_INFO = gql`
  query GetUserInfo($userId: uuid!) {
    user(where: { id: { _eq: $userId } }) {
      id
      email
    }
  }
`;
