/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNode
// ====================================================

export interface GetNode_node {
  readonly __typename: "node";
  readonly id: any;
  readonly created_at: any;
  readonly updated_at: any;
  readonly title: string;
  readonly content: any;
  readonly language: string;
  readonly status: string;
  readonly version: number;
  readonly type: string;
}

export interface GetNode {
  /**
   * fetch data from the table: "node"
   */
  readonly node: ReadonlyArray<GetNode_node>;
}

export interface GetNodeVariables {
  readonly id: any;
}
