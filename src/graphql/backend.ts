import gql from "graphql-tag";

export const GET_SECRET_IPA = gql`
  mutation PostAuthEmailIpaCode($ipa_code: String!, $body: String!) {
    post_auth_email_ipa_code(ipa_code: $ipa_code, body: $body)
      @rest(
        path: "/auth/ipa/token/{args.ipa_code}"
        type: "GetPaFromIpa"
        method: "POST"
        bodyKey: "body"
        bodySerializer: "Json"
      ) {
      ipa_pa @type(name: "ipa_pa") {
        cod_amm
        mail2
      }
      ipa_ou @type(name: "ipa_ou") {
        mail_resp
      }
    }
  }
`;

export const GET_TOKENS_IPA = gql`
  mutation PostAuthLoginIpaCode(
    $ipa_code: String!
    $body: LoginCredentialsInput!
  ) {
    post_auth_login_ipa_code(ipa_code: $ipa_code, body: $body)
      @rest(
        path: "/auth/ipa/session/{args.ipa_code}"
        type: "LoginResult"
        method: "POST"
        bodyKey: "body"
      ) {
      graphql_token
      backend_token
      user {
        id
        email
        roles
      }
    }
  }
`;

////////////////////

export const GET_SECRET_EMAIL = gql`
  mutation PostAuthEmailCode($body: EmailPayloadInput!) {
    post_auth_email_email_code(body: $body)
      @rest(
        path: "/auth/email/token"
        type: "EmailPayload"
        method: "POST"
        bodyKey: "body"
      ) {
      email
    }
  }
`;

export const GET_TOKENS_EMAIL = gql`
  mutation PostAuthLoginEmailCode($body: EmailLoginCredentialsInput!) {
    post_auth_login_email_code(body: $body)
      @rest(
        path: "/auth/email/session"
        type: "LoginResult"
        method: "POST"
        bodyKey: "body"
      ) {
      graphql_token
      backend_token
      user {
        id
        email
        roles
      }
    }
  }
`;

////////////////////

export const LOGOUT = gql`
  mutation PostAuthLogout($body: String!) {
    post_auth_logout(body: $body)
      @rest(
        path: "/auth/logout"
        type: "LoginTokens"
        method: "POST"
        bodyKey: "body"
        bodySerializer: "AuthenticatedJson"
      ) {
      message
    }
  }
`;
