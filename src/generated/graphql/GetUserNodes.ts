/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserNodes
// ====================================================

export interface GetUserNodes_node {
  readonly __typename: "node";
  readonly id: any;
  readonly created_at: any;
  readonly updated_at: any;
  readonly title: string;
  readonly language: string;
  readonly status: string;
  readonly version: number;
  readonly type: string;
}

export interface GetUserNodes {
  /**
   * fetch data from the table: "node"
   */
  readonly node: ReadonlyArray<GetUserNodes_node>;
}
