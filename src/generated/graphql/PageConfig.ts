/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PageConfig
// ====================================================

export interface PageConfig_allConfigYaml_edges_node_menu {
  readonly __typename: "ConfigYamlMenu";
  readonly name: string | null;
  readonly slug: string | null;
}

export interface PageConfig_allConfigYaml_edges_node {
  readonly __typename: "ConfigYaml";
  readonly menu: ReadonlyArray<
    PageConfig_allConfigYaml_edges_node_menu | null
  > | null;
}

export interface PageConfig_allConfigYaml_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: PageConfig_allConfigYaml_edges_node;
}

export interface PageConfig_allConfigYaml {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<PageConfig_allConfigYaml_edges>;
}

export interface PageConfig {
  readonly allConfigYaml: PageConfig_allConfigYaml | null;
}
