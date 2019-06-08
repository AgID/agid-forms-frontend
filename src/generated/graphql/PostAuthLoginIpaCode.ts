/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LoginCredentialsInput } from "./graphql_globals";

// ====================================================
// GraphQL mutation operation: PostAuthLoginIpaCode
// ====================================================

export interface PostAuthLoginIpaCode_post_auth_login_ipa_code {
  readonly __typename: "LoginTokens";
  readonly graphql_token: string;
  readonly backend_token: string;
}

export interface PostAuthLoginIpaCode {
  /**
   * The client post a secret code and the IPA code of the Public Administration
   * he wants to personify. If the secret is valid for the provided IPA code,
   * then the backend returns a bearer token to authenicate subsequent API calls.
   */
  readonly post_auth_login_ipa_code: PostAuthLoginIpaCode_post_auth_login_ipa_code;
}

export interface PostAuthLoginIpaCodeVariables {
  readonly ipa_code: string;
  readonly body: LoginCredentialsInput;
}
