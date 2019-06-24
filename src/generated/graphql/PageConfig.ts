/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PageConfig
// ====================================================

export interface PageConfig_menu_edges_node_menu_subtree {
  readonly __typename: "ConfigYamlMenuSubtree";
  readonly name: string | null;
  readonly slug: string | null;
}

export interface PageConfig_menu_edges_node_menu {
  readonly __typename: "ConfigYamlMenu";
  readonly name: string | null;
  readonly slug: string | null;
  readonly subtree: ReadonlyArray<
    PageConfig_menu_edges_node_menu_subtree | null
  > | null;
}

export interface PageConfig_menu_edges_node {
  readonly __typename: "ConfigYaml";
  readonly menu: ReadonlyArray<PageConfig_menu_edges_node_menu | null> | null;
}

export interface PageConfig_menu_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: PageConfig_menu_edges_node;
}

export interface PageConfig_menu {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<PageConfig_menu_edges>;
}

export interface PageConfig_siteConfig_edges_node_owners {
  readonly __typename: "ConfigYamlOwners";
  readonly name: string | null;
  readonly url: string | null;
}

export interface PageConfig_siteConfig_edges_node_languages {
  readonly __typename: "ConfigYamlLanguages";
  readonly name: string | null;
}

export interface PageConfig_siteConfig_edges_node_slimHeaderLinks {
  readonly __typename: "ConfigYamlSlimHeaderLinks";
  readonly name: string | null;
  readonly url: string | null;
}

export interface PageConfig_siteConfig_edges_node_socialLinks {
  readonly __typename: "ConfigYamlSocialLinks";
  readonly name: string | null;
  readonly url: string | null;
  readonly icon: string | null;
}

export interface PageConfig_siteConfig_edges_node_footerLinks {
  readonly __typename: "ConfigYamlFooterLinks";
  readonly name: string | null;
  readonly url: string | null;
}

export interface PageConfig_siteConfig_edges_node {
  readonly __typename: "ConfigYaml";
  readonly title: string | null;
  readonly description: string | null;
  readonly defaultLanguage: string | null;
  readonly owners: ReadonlyArray<
    PageConfig_siteConfig_edges_node_owners | null
  > | null;
  readonly languages: ReadonlyArray<
    PageConfig_siteConfig_edges_node_languages | null
  > | null;
  readonly slimHeaderLinks: ReadonlyArray<
    PageConfig_siteConfig_edges_node_slimHeaderLinks | null
  > | null;
  readonly socialLinks: ReadonlyArray<
    PageConfig_siteConfig_edges_node_socialLinks | null
  > | null;
  readonly footerLinks: ReadonlyArray<
    PageConfig_siteConfig_edges_node_footerLinks | null
  > | null;
}

export interface PageConfig_siteConfig_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: PageConfig_siteConfig_edges_node;
}

export interface PageConfig_siteConfig {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<PageConfig_siteConfig_edges>;
}

export interface PageConfig {
  readonly menu: PageConfig_menu | null;
  readonly siteConfig: PageConfig_siteConfig | null;
}
