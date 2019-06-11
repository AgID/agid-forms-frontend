/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FormConfig
// ====================================================

export interface FormConfig_allConfigYaml_edges_node_menu_subtree {
  readonly __typename: "ConfigYamlMenuSubtree";
  readonly name: string | null;
  readonly slug: string | null;
  readonly subtitle: string | null;
}

export interface FormConfig_allConfigYaml_edges_node_menu {
  readonly __typename: "ConfigYamlMenu";
  readonly name: string | null;
  readonly slug: string | null;
  readonly subtree: ReadonlyArray<(FormConfig_allConfigYaml_edges_node_menu_subtree | null)> | null;
}

export interface FormConfig_allConfigYaml_edges_node {
  readonly __typename: "ConfigYaml";
  readonly menu: ReadonlyArray<(FormConfig_allConfigYaml_edges_node_menu | null)> | null;
}

export interface FormConfig_allConfigYaml_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: FormConfig_allConfigYaml_edges_node;
}

export interface FormConfig_allConfigYaml {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<FormConfig_allConfigYaml_edges>;
}

export interface FormConfig_allFormYaml_edges_node_form_fields {
  readonly __typename: "FormYamlForm_fields";
  readonly default: string | null;
  readonly description: string | null;
  readonly name: string | null;
  readonly title: string | null;
  readonly type: string | null;
}

export interface FormConfig_allFormYaml_edges_node {
  readonly __typename: "FormYaml";
  readonly id: string;
  readonly form_fields: ReadonlyArray<(FormConfig_allFormYaml_edges_node_form_fields | null)> | null;
}

export interface FormConfig_allFormYaml_edges {
  readonly __typename: "FormYamlEdge";
  readonly node: FormConfig_allFormYaml_edges_node;
}

export interface FormConfig_allFormYaml {
  readonly __typename: "FormYamlConnection";
  readonly edges: ReadonlyArray<FormConfig_allFormYaml_edges>;
}

export interface FormConfig {
  readonly allConfigYaml: FormConfig_allConfigYaml | null;
  readonly allFormYaml: FormConfig_allFormYaml | null;
}
