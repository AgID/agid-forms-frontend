/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNodeRevision
// ====================================================

export interface GetNodeRevision_revision {
  readonly __typename: "node_revision";
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

export interface GetNodeRevision {
  /**
   * fetch data from the table: "node_revision"
   */
  readonly revision: ReadonlyArray<GetNodeRevision_revision>;
}

export interface GetNodeRevisionVariables {
  readonly id: any;
  readonly version: number;
}
