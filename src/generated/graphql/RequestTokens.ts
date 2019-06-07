/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LoginCredentialsInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: RequestTokens
// ====================================================

export interface RequestTokens_RequestTokensResponse {
  readonly __typename: "LoginTokens";
  readonly graphql_token: string;
  readonly backend_token: string;
}

export interface RequestTokens {
  readonly RequestTokensResponse: RequestTokens_RequestTokensResponse | null;
}

export interface RequestTokensVariables {
  readonly cod_amm: string;
  readonly secret: LoginCredentialsInput;
}
