/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ViewConfig
// ====================================================

export interface ViewConfig_allConfigYaml_edges_node_menu {
  readonly __typename: "ConfigYamlMenu";
  readonly name: string | null;
  readonly slug: string | null;
}

export interface ViewConfig_allConfigYaml_edges_node {
  readonly __typename: "ConfigYaml";
  readonly menu: ReadonlyArray<ViewConfig_allConfigYaml_edges_node_menu | null> | null;
}

export interface ViewConfig_allConfigYaml_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: ViewConfig_allConfigYaml_edges_node;
}

export interface ViewConfig_allConfigYaml {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<ViewConfig_allConfigYaml_edges>;
}

export interface ViewConfig_allFormYaml_edges_node_form_fields {
  readonly __typename: "FormYamlForm_fields";
  readonly default: string | null;
  readonly description: string | null;
  readonly name: string | null;
  readonly title: string | null;
  readonly widget: string | null;
}

export interface ViewConfig_allFormYaml_edges_node {
  readonly __typename: "FormYaml";
  readonly id: string;
  readonly version: string | null;
  readonly form_fields: ReadonlyArray<ViewConfig_allFormYaml_edges_node_form_fields | null> | null;
}

export interface ViewConfig_allFormYaml_edges {
  readonly __typename: "FormYamlEdge";
  readonly node: ViewConfig_allFormYaml_edges_node;
}

export interface ViewConfig_allFormYaml {
  readonly __typename: "FormYamlConnection";
  readonly edges: ReadonlyArray<ViewConfig_allFormYaml_edges>;
}

export interface ViewConfig {
  readonly allConfigYaml: ViewConfig_allConfigYaml | null;
  readonly allFormYaml: ViewConfig_allFormYaml | null;
}
