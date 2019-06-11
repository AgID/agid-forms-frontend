/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PagesQuery
// ====================================================

export interface PagesQuery_allSitePage_nodes {
  readonly __typename: "SitePage";
  readonly path: string | null;
}

export interface PagesQuery_allSitePage {
  readonly __typename: "SitePageConnection";
  readonly nodes: ReadonlyArray<PagesQuery_allSitePage_nodes>;
}

export interface PagesQuery {
  readonly allSitePage: PagesQuery_allSitePage | null;
}
