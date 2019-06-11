/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DefaultSEOQuery
// ====================================================

export interface DefaultSEOQuery_site_siteMetadata {
  readonly __typename: "SiteSiteMetadata";
  readonly title: string | null;
  readonly description: string | null;
  readonly author: string | null;
}

export interface DefaultSEOQuery_site {
  readonly __typename: "Site";
  readonly siteMetadata: DefaultSEOQuery_site_siteMetadata | null;
}

export interface DefaultSEOQuery {
  readonly site: DefaultSEOQuery_site | null;
}
