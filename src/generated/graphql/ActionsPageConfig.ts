/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ActionsPageConfig
// ====================================================

export interface ActionsPageConfig_menu_edges_node_menu_subtree {
  readonly __typename: "ConfigYamlMenuSubtree";
  readonly name: string | null;
  readonly slug: string | null;
}

export interface ActionsPageConfig_menu_edges_node_menu {
  readonly __typename: "ConfigYamlMenu";
  readonly name: string | null;
  readonly slug: string | null;
  readonly subtree: ReadonlyArray<ActionsPageConfig_menu_edges_node_menu_subtree | null> | null;
}

export interface ActionsPageConfig_menu_edges_node {
  readonly __typename: "ConfigYaml";
  readonly menu: ReadonlyArray<ActionsPageConfig_menu_edges_node_menu | null> | null;
}

export interface ActionsPageConfig_menu_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: ActionsPageConfig_menu_edges_node;
}

export interface ActionsPageConfig_menu {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<ActionsPageConfig_menu_edges>;
}

export interface ActionsPageConfig_siteConfig_edges_node_owners {
  readonly __typename: "ConfigYamlOwners";
  readonly name: string | null;
  readonly url: string | null;
}

export interface ActionsPageConfig_siteConfig_edges_node_languages {
  readonly __typename: "ConfigYamlLanguages";
  readonly name: string | null;
}

export interface ActionsPageConfig_siteConfig_edges_node_slimHeaderLinks {
  readonly __typename: "ConfigYamlSlimHeaderLinks";
  readonly name: string | null;
  readonly url: string | null;
}

export interface ActionsPageConfig_siteConfig_edges_node_socialLinks {
  readonly __typename: "ConfigYamlSocialLinks";
  readonly name: string | null;
  readonly url: string | null;
  readonly icon: string | null;
}

export interface ActionsPageConfig_siteConfig_edges_node_footerLinks {
  readonly __typename: "ConfigYamlFooterLinks";
  readonly name: string | null;
  readonly url: string | null;
}

export interface ActionsPageConfig_siteConfig_edges_node {
  readonly __typename: "ConfigYaml";
  readonly title: string | null;
  readonly description: string | null;
  readonly defaultLanguage: string | null;
  readonly owners: ReadonlyArray<ActionsPageConfig_siteConfig_edges_node_owners | null> | null;
  readonly languages: ReadonlyArray<ActionsPageConfig_siteConfig_edges_node_languages | null> | null;
  readonly slimHeaderLinks: ReadonlyArray<ActionsPageConfig_siteConfig_edges_node_slimHeaderLinks | null> | null;
  readonly socialLinks: ReadonlyArray<ActionsPageConfig_siteConfig_edges_node_socialLinks | null> | null;
  readonly footerLinks: ReadonlyArray<ActionsPageConfig_siteConfig_edges_node_footerLinks | null> | null;
}

export interface ActionsPageConfig_siteConfig_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: ActionsPageConfig_siteConfig_edges_node;
}

export interface ActionsPageConfig_siteConfig {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<ActionsPageConfig_siteConfig_edges>;
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
  readonly menu: ActionsPageConfig_menu | null;
  readonly siteConfig: ActionsPageConfig_siteConfig | null;
  readonly allFormYaml: ActionsPageConfig_allFormYaml | null;
}
