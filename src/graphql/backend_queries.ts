import gql from "graphql-tag";

export const GET_SECRET = gql`
  mutation PostAuthEmailIpaCode($ipa_code: String!, $body: String!) {
    post_auth_email_ipa_code(ipa_code: $ipa_code, body: $body)
      @rest(
        path: "/auth/email/{args.ipa_code}"
        type: "GetPaFromIpa"
        method: "POST"
        bodyKey: "body"
        bodySerializer: "Json"
      ) {
      ipa_pa @type(name: "ipa_pa") {
        cod_amm
      }
      ipa_ou @type(name: "ipa_ou") {
        mail_resp
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
