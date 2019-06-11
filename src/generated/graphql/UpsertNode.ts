/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { node_insert_input } from "./graphql_globals";

// ====================================================
// GraphQL mutation operation: UpsertNode
// ====================================================

export interface UpsertNode_insert_node_returning_user_user_roles {
  readonly __typename: "user_role";
  readonly role_id: string;
}

export interface UpsertNode_insert_node_returning_user {
  readonly __typename: "user";
  readonly id: any;
  /**
   * An array relationship
   */
  readonly user_roles: ReadonlyArray<UpsertNode_insert_node_returning_user_user_roles>;
  readonly email: string;
}

export interface UpsertNode_insert_node_returning {
  readonly __typename: "node";
  readonly id: any;
  readonly type: string;
  readonly created_at: any;
  readonly updated_at: any;
  readonly language: string;
  readonly status: string;
  readonly title: string;
  readonly content: any;
  readonly version: number;
  /**
   * An object relationship
   */
  readonly user: UpsertNode_insert_node_returning_user;
}

export interface UpsertNode_insert_node {
  readonly __typename: "node_mutation_response";
  /**
   * data of the affected rows by the mutation
   */
  readonly returning: ReadonlyArray<UpsertNode_insert_node_returning>;
}

export interface UpsertNode {
  /**
   * insert data into the table: "node"
   */
  readonly insert_node: UpsertNode_insert_node | null;
}

export interface UpsertNodeVariables {
  readonly node: node_insert_input;
}
