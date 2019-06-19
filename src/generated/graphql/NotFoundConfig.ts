/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NotFoundConfig
// ====================================================

export interface NotFoundConfig_allConfigYaml_edges_node_menu {
  readonly __typename: "ConfigYamlMenu";
  readonly name: string | null;
  readonly slug: string | null;
}

export interface NotFoundConfig_allConfigYaml_edges_node {
  readonly __typename: "ConfigYaml";
  readonly menu: ReadonlyArray<
    NotFoundConfig_allConfigYaml_edges_node_menu | null
  > | null;
}

export interface NotFoundConfig_allConfigYaml_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: NotFoundConfig_allConfigYaml_edges_node;
}

export interface NotFoundConfig_allConfigYaml {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<NotFoundConfig_allConfigYaml_edges>;
}

export interface NotFoundConfig {
  readonly allConfigYaml: NotFoundConfig_allConfigYaml | null;
}
