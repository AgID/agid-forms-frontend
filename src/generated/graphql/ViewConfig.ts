/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ViewConfig
// ====================================================

export interface ViewConfig_menu_edges_node_menu {
  readonly __typename: "ConfigYamlMenu";
  readonly name: string | null;
  readonly slug: string | null;
  readonly authenticated: boolean | null;
}

export interface ViewConfig_menu_edges_node {
  readonly __typename: "ConfigYaml";
  readonly menu: ReadonlyArray<(ViewConfig_menu_edges_node_menu | null)> | null;
}

export interface ViewConfig_menu_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: ViewConfig_menu_edges_node;
}

export interface ViewConfig_menu {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<ViewConfig_menu_edges>;
}

export interface ViewConfig_siteConfig_edges_node_owners {
  readonly __typename: "ConfigYamlOwners";
  readonly name: string | null;
  readonly url: string | null;
}

export interface ViewConfig_siteConfig_edges_node_languages {
  readonly __typename: "ConfigYamlLanguages";
  readonly name: string | null;
}

export interface ViewConfig_siteConfig_edges_node_slimHeaderLinks {
  readonly __typename: "ConfigYamlSlimHeaderLinks";
  readonly name: string | null;
  readonly url: string | null;
}

export interface ViewConfig_siteConfig_edges_node_socialLinks {
  readonly __typename: "ConfigYamlSocialLinks";
  readonly name: string | null;
  readonly url: string | null;
  readonly icon: string | null;
}

export interface ViewConfig_siteConfig_edges_node_footerLinks {
  readonly __typename: "ConfigYamlFooterLinks";
  readonly name: string | null;
  readonly url: string | null;
}

export interface ViewConfig_siteConfig_edges_node {
  readonly __typename: "ConfigYaml";
  readonly title: string | null;
  readonly description: string | null;
  readonly defaultLanguage: string | null;
  readonly author: string | null;
  readonly authorLogo: string | null;
  readonly authorUrl: string | null;
  readonly owners: ReadonlyArray<(ViewConfig_siteConfig_edges_node_owners | null)> | null;
  readonly languages: ReadonlyArray<(ViewConfig_siteConfig_edges_node_languages | null)> | null;
  readonly slimHeaderLinks: ReadonlyArray<(ViewConfig_siteConfig_edges_node_slimHeaderLinks | null)> | null;
  readonly socialLinks: ReadonlyArray<(ViewConfig_siteConfig_edges_node_socialLinks | null)> | null;
  readonly footerLinks: ReadonlyArray<(ViewConfig_siteConfig_edges_node_footerLinks | null)> | null;
}

export interface ViewConfig_siteConfig_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: ViewConfig_siteConfig_edges_node;
}

export interface ViewConfig_siteConfig {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<ViewConfig_siteConfig_edges>;
}

export interface ViewConfig_allFormYaml_edges_node_sections_groups_fields_options {
  readonly __typename: "FormYamlSectionsGroupsFieldsOptions";
  readonly value: string | null;
  readonly label: string | null;
}

export interface ViewConfig_allFormYaml_edges_node_sections_groups_fields {
  readonly __typename: "FormYamlSectionsGroupsFields";
  readonly default: string | null;
  readonly default_checked: boolean | null;
  readonly default_multiple_selection: ReadonlyArray<(string | null)> | null;
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
  readonly options: ReadonlyArray<(ViewConfig_allFormYaml_edges_node_sections_groups_fields_options | null)> | null;
}

export interface ViewConfig_allFormYaml_edges_node_sections_groups {
  readonly __typename: "FormYamlSectionsGroups";
  readonly name: string | null;
  readonly title: string | null;
  readonly description: string | null;
  readonly repeatable: boolean | null;
  readonly fields: ReadonlyArray<(ViewConfig_allFormYaml_edges_node_sections_groups_fields | null)> | null;
}

export interface ViewConfig_allFormYaml_edges_node_sections {
  readonly __typename: "FormYamlSections";
  readonly title: string | null;
  readonly description: string | null;
  readonly groups: ReadonlyArray<(ViewConfig_allFormYaml_edges_node_sections_groups | null)> | null;
}

export interface ViewConfig_allFormYaml_edges_node {
  readonly __typename: "FormYaml";
  readonly id: string;
  readonly version: string | null;
  readonly language: string | null;
  readonly enabled: boolean | null;
  readonly slug_pattern: string | null;
  readonly title_pattern: string | null;
  readonly sections: ReadonlyArray<(ViewConfig_allFormYaml_edges_node_sections | null)> | null;
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
  readonly menu: ViewConfig_menu | null;
  readonly siteConfig: ViewConfig_siteConfig | null;
  readonly allFormYaml: ViewConfig_allFormYaml | null;
}
