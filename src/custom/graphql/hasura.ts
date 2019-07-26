import gql from "graphql-tag";

export const GET_USER_ACCESSIBILITY_DECLS = gql`
  query GetUserAccessibilityDecl($userId: uuid) {
    node: last_published_or_draft(
      where: {
        _and: {
          user_id: { _eq: $userId }
          type: { _eq: "dichiarazione_accessibilita" }
        }
      }
    ) {
      id
      content
      updated_at
      status
      type
    }
  }
`;
