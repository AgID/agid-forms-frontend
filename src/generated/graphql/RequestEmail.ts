/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RequestEmail
// ====================================================

export interface RequestEmail_RequestEmailResponse {
  readonly __typename: "GetPaFromIpa";
  readonly cod_amm: string;
}

export interface RequestEmail {
  readonly RequestEmailResponse: RequestEmail_RequestEmailResponse;
}

export interface RequestEmailVariables {
  readonly cod_amm: string;
  readonly body: string;
}
