/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserInfo
// ====================================================

export interface GetUserInfo_user {
  readonly __typename: "user";
  readonly id: any;
  readonly email: string;
}

export interface GetUserInfo {
  /**
   * fetch data from the table: "user"
   */
  readonly user: ReadonlyArray<GetUserInfo_user>;
}

export interface GetUserInfoVariables {
  readonly userId?: any | null;
}
