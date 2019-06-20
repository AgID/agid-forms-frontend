/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PageConfigFragment
// ====================================================

export interface PageConfigFragment_edges_node_menu {
  readonly __typename: "ConfigYamlMenu";
  readonly name: string | null;
  readonly slug: string | null;
}

export interface PageConfigFragment_edges_node {
  readonly __typename: "ConfigYaml";
  readonly menu: ReadonlyArray<PageConfigFragment_edges_node_menu | null> | null;
}

export interface PageConfigFragment_edges {
  readonly __typename: "ConfigYamlEdge";
  readonly node: PageConfigFragment_edges_node;
}

export interface PageConfigFragment {
  readonly __typename: "ConfigYamlConnection";
  readonly edges: ReadonlyArray<PageConfigFragment_edges>;
}
