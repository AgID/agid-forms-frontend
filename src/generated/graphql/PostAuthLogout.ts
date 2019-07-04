/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PostAuthLogout
// ====================================================

export interface PostAuthLogout_post_auth_logout {
  readonly __typename: "SuccessResponse";
  readonly message: string | null;
}

export interface PostAuthLogout {
  /**
   * Delete the session identified by the provided bearer token.
   */
  readonly post_auth_logout: PostAuthLogout_post_auth_logout;
}

export interface PostAuthLogoutVariables {
  readonly body: string;
}
