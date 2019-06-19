/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Form00PageConfig
// ====================================================

export interface Form00PageConfig_allConfigYaml_edges_node_menu_subtree {
  readonly __typename: "ConfigYamlMenuSubtree";
  readonly name: string | null;
  readonly slug: string | null;
  readonly subtitle: string | null;
}

export interface Form00PageConfig_allConfigYaml_edges_node_menu {
  readonly __typename: "ConfigYamlMenu";
  readonly name: string | null;
  readonly slug: string | null;
  readonly subtree: ReadonlyArray<
    Form00PageConfig_allConfigYaml_edges_node_menu_subtree | null
  > | null;
}

export interface Form00PageConfig_allConfigYaml_edges_node {
  readonly __typename: "ConfigYaml";
  readonly menu: ReadonlyArray<
    Form00PageConfig_allConfigYaml_edges_node_menu | null
  > | null;
}

export interface Form00PageConfig_allConfigYaml_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: Form00PageConfig_allConfigYaml_edges_node;
}

export interface Form00PageConfig_allConfigYaml {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<Form00PageConfig_allConfigYaml_edges>;
}

export interface Form00PageConfig_allFormYaml_edges_node_form_fields {
  readonly __typename: "FormYamlForm_fields";
  readonly default: string | null;
  readonly description: string | null;
  readonly name: string | null;
  readonly title: string | null;
  readonly type: string | null;
}

export interface Form00PageConfig_allFormYaml_edges_node {
  readonly __typename: "FormYaml";
  readonly id: string;
  readonly form_fields: ReadonlyArray<
    Form00PageConfig_allFormYaml_edges_node_form_fields | null
  > | null;
}

export interface Form00PageConfig_allFormYaml_edges {
  readonly __typename: "FormYamlEdge";
  readonly node: Form00PageConfig_allFormYaml_edges_node;
}

export interface Form00PageConfig_allFormYaml {
  readonly __typename: "FormYamlConnection";
  readonly edges: ReadonlyArray<Form00PageConfig_allFormYaml_edges>;
}

export interface Form00PageConfig {
  readonly allConfigYaml: Form00PageConfig_allConfigYaml | null;
  readonly allFormYaml: Form00PageConfig_allFormYaml | null;
}
