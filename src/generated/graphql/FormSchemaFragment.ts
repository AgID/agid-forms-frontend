/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FormSchemaFragment
// ====================================================

export interface FormSchemaFragment_edges_node_sections_groups_fields_options {
  readonly __typename: "FormYamlSectionsGroupsFieldsOptions";
  readonly value: string | null;
  readonly label: string | null;
}

export interface FormSchemaFragment_edges_node_sections_groups_fields {
  readonly __typename: "FormYamlSectionsGroupsFields";
  readonly default: string | null;
  readonly default_checked: boolean | null;
  readonly default_multiple_selection: ReadonlyArray<string | null> | null;
  readonly description: string | null;
  readonly name: string | null;
  readonly multiple: boolean | null;
  readonly title: string | null;
  readonly widget: string | null;
  readonly show_if: string | null;
  readonly valid_if: string | null;
  readonly required_if: string | null;
  readonly error_msg: string | null;
  readonly computed_value: string | null;
  readonly options: ReadonlyArray<
    FormSchemaFragment_edges_node_sections_groups_fields_options | null
  > | null;
}

export interface FormSchemaFragment_edges_node_sections_groups {
  readonly __typename: "FormYamlSectionsGroups";
  readonly name: string | null;
  readonly title: string | null;
  readonly description: string | null;
  readonly repeatable: boolean | null;
  readonly fields: ReadonlyArray<
    FormSchemaFragment_edges_node_sections_groups_fields | null
  > | null;
}

export interface FormSchemaFragment_edges_node_sections {
  readonly __typename: "FormYamlSections";
  readonly title: string | null;
  readonly description: string | null;
  readonly groups: ReadonlyArray<
    FormSchemaFragment_edges_node_sections_groups | null
  > | null;
}

export interface FormSchemaFragment_edges_node {
  readonly __typename: "FormYaml";
  readonly id: string;
  readonly version: string | null;
  readonly language: string | null;
  readonly enabled: boolean | null;
  readonly slug_pattern: string | null;
  readonly title_pattern: string | null;
  readonly sections: ReadonlyArray<
    FormSchemaFragment_edges_node_sections | null
  > | null;
}

export interface FormSchemaFragment_edges {
  readonly __typename: "FormYamlEdge";
  readonly node: FormSchemaFragment_edges_node;
}

export interface FormSchemaFragment {
  readonly __typename: "FormYamlConnection";
  readonly edges: ReadonlyArray<FormSchemaFragment_edges>;
}
