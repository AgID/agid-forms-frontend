/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PlaceholderImage
// ====================================================

export interface PlaceholderImage_placeholderImage_childImageSharp_fluid {
  readonly __typename: "ImageSharpFluid";
  readonly base64: string | null;
  readonly aspectRatio: number | null;
  readonly src: string | null;
  readonly srcSet: string | null;
  readonly sizes: string | null;
}

export interface PlaceholderImage_placeholderImage_childImageSharp {
  readonly __typename: "ImageSharp";
  readonly fluid: PlaceholderImage_placeholderImage_childImageSharp_fluid | null;
}

export interface PlaceholderImage_placeholderImage {
  readonly __typename: "File";
  readonly childImageSharp: PlaceholderImage_placeholderImage_childImageSharp | null;
}

export interface PlaceholderImage {
  readonly placeholderImage: PlaceholderImage_placeholderImage | null;
}
