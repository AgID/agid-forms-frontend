import { graphql } from "gatsby";

export const PageConfigFragment = graphql`
  fragment PageConfigFragment on ConfigYamlConnection {
    edges {
      node {
        menu {
          name
          slug
          subtree {
            name
            slug
            subtitle
          }
        }
      }
    }
  }
`;
