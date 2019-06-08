import { gql } from "apollo-boost";

export const GET_SECRET = gql`
  mutation PostAuthEmailIpaCode($ipa_code: String!, $body: String!) {
    post_auth_email_ipa_code(ipa_code: $ipa_code, body: $body)
      @rest(
        path: "/auth/email/{args.ipa_code}"
        type: "GetPaFromIpa"
        method: "POST"
        bodyKey: "body"
      ) {
      ipa_ou @type(name: "ipa_ou") {
        cod_ou
      }
    }
  }
`;

export const GET_TOKENS = gql`
  mutation PostAuthLoginIpaCode(
    $ipa_code: String!
    $body: LoginCredentialsInput!
  ) {
    post_auth_login_ipa_code(ipa_code: $ipa_code, body: $body)
      @rest(
        path: "/auth/login/{args.ipa_code}"
        type: "LoginTokens"
        method: "POST"
        bodyKey: "body"
      ) {
      graphql_token
      backend_token
    }
  }
`;
