import { graphql } from "gatsby";
import { FormConfig } from "../generated/graphql/FormConfig";
import {
  LayoutQuery,
  LayoutQuery_menu_edges_node_menu,
  LayoutQuery_siteConfig_edges_node
} from "../generated/graphql/LayoutQuery";
import { ViewConfig } from "../generated/graphql/ViewConfig";
import { FormT } from "../utils/forms";

export const MenuFragment = graphql`
  fragment MenuFragment on ConfigYamlConnection {
    edges {
      node {
        menu {
          name
          slug
          roles
        }
      }
    }
  }
`;

export const getMenu = (
  data: LayoutQuery
): ReadonlyArray<LayoutQuery_menu_edges_node_menu | null> | null =>
  data.menu && Array.isArray(data.menu.edges) && data.menu.edges[0]
    ? data.menu.edges[0].node.menu
    : null;

export const SiteConfigFragment = graphql`
  fragment SiteConfigFragment on ConfigYamlConnection {
    edges {
      node {
        title
        description
        defaultLanguage
        author
        authorLogo
        authorUrl
        homepage
        keywords
        cookiePolicyLink
        hotjar {
          hjid
          hjsv
          surveyUrl
        }
        owners {
          name
          url
        }
        languages {
          name
        }
        slimHeaderLinks {
          name
          url
        }
        socialLinks {
          name
          url
          icon
        }
        footerLinks {
          name
          url
        }
      }
    }
  }
`;

export const getSiteConfig = (
  data: LayoutQuery
): LayoutQuery_siteConfig_edges_node | null =>
  data.siteConfig &&
  Array.isArray(data.siteConfig.edges) &&
  data.siteConfig.edges[0]
    ? data.siteConfig.edges[0].node
    : null;

export const FormSchemaFragment = graphql`
  fragment FormSchemaFragment on FormYamlConnection {
    edges {
      node {
        id
        name
        version
        language
        enabled
        slug_pattern
        title_pattern
        sections {
          title
          name
          description
          groups {
            name
            title
            description
            repeatable
            fields {
              default
              default_checked
              default_multiple_selection
              description
              name
              multiple
              title
              widget
              show_if
              valid_if
              enabled_if
              required_if
              error_msg
              computed_value
              options {
                value
                label
              }
            }
          }
        }
      }
    }
  }
`;

export function getForm(
  data: FormConfig | ViewConfig,
  formId?: string
): FormT | null {
  if (!formId) {
    return null;
  }
  const forms = data.allFormYaml
    ? data.allFormYaml.edges.filter(node => node.node.id === formId)
    : null;
  if (!forms || !forms[0] || !forms[0].node) {
    return null;
  }
  return forms[0].node;
}
