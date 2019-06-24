/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SiteConfigQuery
// ====================================================

export interface SiteConfigQuery_allConfigYaml_edges_node_owners {
  readonly __typename: "ConfigYamlOwners";
  readonly name: string | null;
  readonly url: string | null;
}

export interface SiteConfigQuery_allConfigYaml_edges_node_languages {
  readonly __typename: "ConfigYamlLanguages";
  readonly name: string | null;
}

export interface SiteConfigQuery_allConfigYaml_edges_node_slimHeaderLinks {
  readonly __typename: "ConfigYamlSlimHeaderLinks";
  readonly name: string | null;
  readonly url: string | null;
}

export interface SiteConfigQuery_allConfigYaml_edges_node_socialLinks {
  readonly __typename: "ConfigYamlSocialLinks";
  readonly name: string | null;
  readonly url: string | null;
  readonly icon: string | null;
}

export interface SiteConfigQuery_allConfigYaml_edges_node_footerLinks {
  readonly __typename: "ConfigYamlFooterLinks";
  readonly name: string | null;
  readonly url: string | null;
}

export interface SiteConfigQuery_allConfigYaml_edges_node {
  readonly __typename: "ConfigYaml";
  readonly title: string | null;
  readonly description: string | null;
  readonly defaultLanguage: string | null;
  readonly owners: ReadonlyArray<SiteConfigQuery_allConfigYaml_edges_node_owners | null> | null;
  readonly languages: ReadonlyArray<SiteConfigQuery_allConfigYaml_edges_node_languages | null> | null;
  readonly slimHeaderLinks: ReadonlyArray<SiteConfigQuery_allConfigYaml_edges_node_slimHeaderLinks | null> | null;
  readonly socialLinks: ReadonlyArray<SiteConfigQuery_allConfigYaml_edges_node_socialLinks | null> | null;
  readonly footerLinks: ReadonlyArray<SiteConfigQuery_allConfigYaml_edges_node_footerLinks | null> | null;
}

export interface SiteConfigQuery_allConfigYaml_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: SiteConfigQuery_allConfigYaml_edges_node;
}

export interface SiteConfigQuery_allConfigYaml {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<SiteConfigQuery_allConfigYaml_edges>;
}

export interface SiteConfigQuery {
  readonly allConfigYaml: SiteConfigQuery_allConfigYaml | null;
}
