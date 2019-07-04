/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNode
// ====================================================

export interface GetNode_latest_published {
  readonly __typename: "node_revision";
  readonly id: any;
  readonly created_at: any;
  readonly updated_at: any;
  readonly title: string;
  readonly content: any;
  readonly language: string;
  readonly status: string;
  readonly version: number;
}

export interface GetNode_latest {
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
  /**
   * An array relationship
   */
  readonly published: ReadonlyArray<GetNode_latest_published>;
}

export interface GetNode {
  /**
   * fetch data from the table: "node"
   */
  readonly latest: ReadonlyArray<GetNode_latest>;
}

export interface GetNodeVariables {
  readonly id: any;
}
