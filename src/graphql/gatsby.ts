import { graphql } from "gatsby";
import {
  FormConfig,
  FormConfig_allMenuYaml_edges_node
} from "../generated/graphql/FormConfig";
import {
  LayoutQuery,
  LayoutQuery_menu_edges_node_menu,
  LayoutQuery_siteConfig_edges_node
} from "../generated/graphql/LayoutQuery";
import { ViewConfig } from "../generated/graphql/ViewConfig";
import { FormT } from "../utils/forms";
import { get } from "../utils/safe_access";
import { replaceNodeIdMenu } from "../utils/menu";

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

export const ContextualMenuFragment = graphql`
  fragment ContextualMenuFragment on MenuYamlConnection {
    edges {
      node {
        menu {
          id
          items {
            name
            slug
            roles
          }
        }
      }
    }
  }
`;

export function getContextualMenu(
  data: FormConfig | ViewConfig,
  formId?: string,
  nodeId?: string
): FormConfig_allMenuYaml_edges_node | null {
  if (!formId) {
    return null;
  }
  const menu = data.allMenuYaml
    ? data.allMenuYaml.edges.filter(
        node => get(node, n => n.node.menu.id, "") === formId
      )
    : null;
  return get(menu, n => replaceNodeIdMenu(n, nodeId), null);
}

export const SiteConfigFragment = graphql`
  fragment SiteConfigFragment on ConfigYamlConnection {
    edges {
      node {
        title
        description
        defaultLanguage
        author
        authorLogo
        siteLogo
        authorUrl
        homepage
        hostname
        keywords
        cookiePolicyLink
        hotjar {
          hjid
          hjsv
          surveyUrl
        }
        owners {
          name
          longName
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
        action
        version
        description
        category
        language
        roles
        visible_to
        listed_to
        slug_pattern
        initial_status
        bound_to
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
              accept
              max_size
              multiple
              title
              widget
              ref
              show_if
              valid_if
              enabled_if
              required_if
              ignored_if
              error_msg
              computed_value
              default_computed_value
              options {
                value
                label
                hint
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
