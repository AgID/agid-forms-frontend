/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserProfileConfig
// ====================================================

export interface UserProfileConfig_allConfigYaml_edges_node_menu {
  readonly __typename: "ConfigYamlMenu";
  readonly name: string | null;
  readonly slug: string | null;
}

export interface UserProfileConfig_allConfigYaml_edges_node {
  readonly __typename: "ConfigYaml";
  readonly menu: ReadonlyArray<UserProfileConfig_allConfigYaml_edges_node_menu | null> | null;
}

export interface UserProfileConfig_allConfigYaml_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: UserProfileConfig_allConfigYaml_edges_node;
}

export interface UserProfileConfig_allConfigYaml {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<UserProfileConfig_allConfigYaml_edges>;
}

export interface UserProfileConfig {
  readonly allConfigYaml: UserProfileConfig_allConfigYaml | null;
}
