/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FormConfig
// ====================================================

export interface FormConfig_menu_edges_node_menu_subtree {
  readonly __typename: "ConfigYamlMenuSubtree";
  readonly name: string | null;
  readonly slug: string | null;
}

export interface FormConfig_menu_edges_node_menu {
  readonly __typename: "ConfigYamlMenu";
  readonly name: string | null;
  readonly slug: string | null;
  readonly subtree: ReadonlyArray<
    FormConfig_menu_edges_node_menu_subtree | null
  > | null;
}

export interface FormConfig_menu_edges_node {
  readonly __typename: "ConfigYaml";
  readonly menu: ReadonlyArray<FormConfig_menu_edges_node_menu | null> | null;
}

export interface FormConfig_menu_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: FormConfig_menu_edges_node;
}

export interface FormConfig_menu {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<FormConfig_menu_edges>;
}

export interface FormConfig_siteConfig_edges_node_owners {
  readonly __typename: "ConfigYamlOwners";
  readonly name: string | null;
  readonly url: string | null;
}

export interface FormConfig_siteConfig_edges_node_languages {
  readonly __typename: "ConfigYamlLanguages";
  readonly name: string | null;
}

export interface FormConfig_siteConfig_edges_node_slimHeaderLinks {
  readonly __typename: "ConfigYamlSlimHeaderLinks";
  readonly name: string | null;
  readonly url: string | null;
}

export interface FormConfig_siteConfig_edges_node_socialLinks {
  readonly __typename: "ConfigYamlSocialLinks";
  readonly name: string | null;
  readonly url: string | null;
  readonly icon: string | null;
}

export interface FormConfig_siteConfig_edges_node_footerLinks {
  readonly __typename: "ConfigYamlFooterLinks";
  readonly name: string | null;
  readonly url: string | null;
}

export interface FormConfig_siteConfig_edges_node {
  readonly __typename: "ConfigYaml";
  readonly title: string | null;
  readonly description: string | null;
  readonly defaultLanguage: string | null;
  readonly owners: ReadonlyArray<
    FormConfig_siteConfig_edges_node_owners | null
  > | null;
  readonly languages: ReadonlyArray<
    FormConfig_siteConfig_edges_node_languages | null
  > | null;
  readonly slimHeaderLinks: ReadonlyArray<
    FormConfig_siteConfig_edges_node_slimHeaderLinks | null
  > | null;
  readonly socialLinks: ReadonlyArray<
    FormConfig_siteConfig_edges_node_socialLinks | null
  > | null;
  readonly footerLinks: ReadonlyArray<
    FormConfig_siteConfig_edges_node_footerLinks | null
  > | null;
}

export interface FormConfig_siteConfig_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: FormConfig_siteConfig_edges_node;
}

export interface FormConfig_siteConfig {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<FormConfig_siteConfig_edges>;
}

export interface FormConfig_allFormYaml_edges_node_form_fields_options {
  readonly __typename: "FormYamlForm_fieldsOptions";
  readonly value: string | null;
  readonly label: string | null;
}

export interface FormConfig_allFormYaml_edges_node_form_fields {
  readonly __typename: "FormYamlForm_fields";
  readonly default: string | null;
  readonly default_checked: boolean | null;
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
    FormConfig_allFormYaml_edges_node_form_fields_options | null
  > | null;
}

export interface FormConfig_allFormYaml_edges_node {
  readonly __typename: "FormYaml";
  readonly id: string;
  readonly version: string | null;
  readonly language: string | null;
  readonly enabled: boolean | null;
  readonly slug_pattern: string | null;
  readonly title_pattern: string | null;
  readonly form_fields: ReadonlyArray<
    FormConfig_allFormYaml_edges_node_form_fields | null
  > | null;
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
  readonly menu: FormConfig_menu | null;
  readonly siteConfig: FormConfig_siteConfig | null;
  readonly allFormYaml: FormConfig_allFormYaml | null;
}
