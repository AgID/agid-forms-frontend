/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NotFoundConfig
// ====================================================

export interface NotFoundConfig_menu_edges_node_menu {
  readonly __typename: "ConfigYamlMenu";
  readonly name: string | null;
  readonly slug: string | null;
  readonly authenticated: boolean | null;
}

export interface NotFoundConfig_menu_edges_node {
  readonly __typename: "ConfigYaml";
  readonly menu: ReadonlyArray<(NotFoundConfig_menu_edges_node_menu | null)> | null;
}

export interface NotFoundConfig_menu_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: NotFoundConfig_menu_edges_node;
}

export interface NotFoundConfig_menu {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<NotFoundConfig_menu_edges>;
}

export interface NotFoundConfig_siteConfig_edges_node_owners {
  readonly __typename: "ConfigYamlOwners";
  readonly name: string | null;
  readonly url: string | null;
}

export interface NotFoundConfig_siteConfig_edges_node_languages {
  readonly __typename: "ConfigYamlLanguages";
  readonly name: string | null;
}

export interface NotFoundConfig_siteConfig_edges_node_slimHeaderLinks {
  readonly __typename: "ConfigYamlSlimHeaderLinks";
  readonly name: string | null;
  readonly url: string | null;
}

export interface NotFoundConfig_siteConfig_edges_node_socialLinks {
  readonly __typename: "ConfigYamlSocialLinks";
  readonly name: string | null;
  readonly url: string | null;
  readonly icon: string | null;
}

export interface NotFoundConfig_siteConfig_edges_node_footerLinks {
  readonly __typename: "ConfigYamlFooterLinks";
  readonly name: string | null;
  readonly url: string | null;
}

export interface NotFoundConfig_siteConfig_edges_node {
  readonly __typename: "ConfigYaml";
  readonly title: string | null;
  readonly description: string | null;
  readonly defaultLanguage: string | null;
  readonly owners: ReadonlyArray<(NotFoundConfig_siteConfig_edges_node_owners | null)> | null;
  readonly languages: ReadonlyArray<(NotFoundConfig_siteConfig_edges_node_languages | null)> | null;
  readonly slimHeaderLinks: ReadonlyArray<(NotFoundConfig_siteConfig_edges_node_slimHeaderLinks | null)> | null;
  readonly socialLinks: ReadonlyArray<(NotFoundConfig_siteConfig_edges_node_socialLinks | null)> | null;
  readonly footerLinks: ReadonlyArray<(NotFoundConfig_siteConfig_edges_node_footerLinks | null)> | null;
}

export interface NotFoundConfig_siteConfig_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: NotFoundConfig_siteConfig_edges_node;
}

export interface NotFoundConfig_siteConfig {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<NotFoundConfig_siteConfig_edges>;
}

export interface NotFoundConfig {
  readonly menu: NotFoundConfig_menu | null;
  readonly siteConfig: NotFoundConfig_siteConfig | null;
}
