/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * unique or primary key constraints on table "node_revision"
 */
export enum node_revision_constraint {
  node_revision_pkey = "node_revision_pkey",
}

/**
 * update columns of table "node_revision"
 */
export enum node_revision_update_column {
  content = "content",
  created_at = "created_at",
  id = "id",
  language = "language",
  status = "status",
  title = "title",
  type = "type",
  updated_at = "updated_at",
  user_id = "user_id",
  version = "version",
}

/**
 * unique or primary key constraints on table "user"
 */
export enum user_constraint {
  user_email_key = "user_email_key",
  user_pkey = "user_pkey",
}

/**
 * unique or primary key constraints on table "user_role"
 */
export enum user_role_constraint {
  user_role_pkey = "user_role_pkey",
}

/**
 * update columns of table "user_role"
 */
export enum user_role_update_column {
  role_id = "role_id",
  user_id = "user_id",
}

/**
 * update columns of table "user"
 */
export enum user_update_column {
  email = "email",
  id = "id",
  metadata = "metadata",
}

export interface LoginCredentialsInput {
  readonly secret: string;
}

/**
 * input type for inserting data into table "node"
 */
export interface node_insert_input {
  readonly content?: any | null;
  readonly created_at?: any | null;
  readonly id?: any | null;
  readonly language?: string | null;
  readonly revisions?: node_revision_arr_rel_insert_input | null;
  readonly status?: string | null;
  readonly title?: string | null;
  readonly type?: string | null;
  readonly updated_at?: any | null;
  readonly user?: user_obj_rel_insert_input | null;
  readonly user_id?: any | null;
  readonly version?: number | null;
}

/**
 * input type for inserting array relation for remote table "node_revision"
 */
export interface node_revision_arr_rel_insert_input {
  readonly data: ReadonlyArray<node_revision_insert_input>;
  readonly on_conflict?: node_revision_on_conflict | null;
}

/**
 * input type for inserting data into table "node_revision"
 */
export interface node_revision_insert_input {
  readonly content?: any | null;
  readonly created_at?: any | null;
  readonly id?: any | null;
  readonly language?: string | null;
  readonly status?: string | null;
  readonly title?: string | null;
  readonly type?: string | null;
  readonly updated_at?: any | null;
  readonly user_id?: any | null;
  readonly version?: number | null;
}

/**
 * on conflict condition type for table "node_revision"
 */
export interface node_revision_on_conflict {
  readonly constraint: node_revision_constraint;
  readonly update_columns: ReadonlyArray<node_revision_update_column>;
}

/**
 * input type for inserting data into table "user"
 */
export interface user_insert_input {
  readonly email?: string | null;
  readonly id?: any | null;
  readonly metadata?: any | null;
  readonly user_roles?: user_role_arr_rel_insert_input | null;
}

/**
 * input type for inserting object relation for remote table "user"
 */
export interface user_obj_rel_insert_input {
  readonly data: user_insert_input;
  readonly on_conflict?: user_on_conflict | null;
}

/**
 * on conflict condition type for table "user"
 */
export interface user_on_conflict {
  readonly constraint: user_constraint;
  readonly update_columns: ReadonlyArray<user_update_column>;
}

/**
 * input type for inserting array relation for remote table "user_role"
 */
export interface user_role_arr_rel_insert_input {
  readonly data: ReadonlyArray<user_role_insert_input>;
  readonly on_conflict?: user_role_on_conflict | null;
}

/**
 * input type for inserting data into table "user_role"
 */
export interface user_role_insert_input {
  readonly role_id?: string | null;
  readonly user_id?: any | null;
}

/**
 * on conflict condition type for table "user_role"
 */
export interface user_role_on_conflict {
  readonly constraint: user_role_constraint;
  readonly update_columns: ReadonlyArray<user_role_update_column>;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
