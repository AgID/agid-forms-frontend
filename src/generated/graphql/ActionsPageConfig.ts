/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ActionsPageConfig
// ====================================================

export interface ActionsPageConfig_allConfigYaml_edges_node_menu {
  readonly __typename: "ConfigYamlMenu";
  readonly name: string | null;
  readonly slug: string | null;
}

export interface ActionsPageConfig_allConfigYaml_edges_node {
  readonly __typename: "ConfigYaml";
  readonly menu: ReadonlyArray<ActionsPageConfig_allConfigYaml_edges_node_menu | null> | null;
}

export interface ActionsPageConfig_allConfigYaml_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: ActionsPageConfig_allConfigYaml_edges_node;
}

export interface ActionsPageConfig_allConfigYaml {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<ActionsPageConfig_allConfigYaml_edges>;
}

export interface ActionsPageConfig_allFormYaml_edges_node {
  readonly __typename: "FormYaml";
  readonly id: string;
  readonly version: string | null;
  readonly name: string | null;
}

export interface ActionsPageConfig_allFormYaml_edges {
  readonly __typename: "FormYamlEdge";
  readonly node: ActionsPageConfig_allFormYaml_edges_node;
}

export interface ActionsPageConfig_allFormYaml {
  readonly __typename: "FormYamlConnection";
  readonly edges: ReadonlyArray<ActionsPageConfig_allFormYaml_edges>;
}

export interface ActionsPageConfig {
  readonly allConfigYaml: ActionsPageConfig_allConfigYaml | null;
  readonly allFormYaml: ActionsPageConfig_allFormYaml | null;
}
