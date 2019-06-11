import { graphql } from "gatsby";

// subtree {
//   name
//   slug
//   subtitle
// }

export const PageConfigFragment = graphql`
  fragment PageConfigFragment on ConfigYamlConnection {
    edges {
      node {
        menu {
          name
          slug
        }
      }
    }
  }
`;
