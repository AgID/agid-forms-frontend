import { graphql } from "gatsby";
import {
  FormConfig,
  FormConfig_allFormYaml_edges_node,
  FormConfig_allFormYaml_edges_node_sections,
  FormConfig_allFormYaml_edges_node_sections_fields
} from "../generated/graphql/FormConfig";
import { PageConfig } from "../generated/graphql/PageConfig";
import {
  ViewConfig,
  ViewConfig_allFormYaml_edges_node
} from "../generated/graphql/ViewConfig";

export const PageConfigFragment = graphql`
  fragment PageConfigFragment on ConfigYamlConnection {
    edges {
      node {
        menu {
          name
          slug
          authenticated
        }
      }
    }
  }
`;

export const getMenu = (data: PageConfig) => data.menu!.edges[0].node.menu;

export const getSiteConfig = (data: PageConfig) =>
  data.siteConfig!.edges[0].node;

// overload
export function getForm(
  data: FormConfig,
  formId?: string
): FormConfig_allFormYaml_edges_node | null;

// overload
export function getForm(
  data: ViewConfig,
  formId?: string
): ViewConfig_allFormYaml_edges_node | null;

export function getForm(
  data: FormConfig | ViewConfig,
  formId?: string
):
  | ViewConfig_allFormYaml_edges_node
  | FormConfig_allFormYaml_edges_node
  | null {
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

/**
 * Flatten form fields into array
 */
export function getFormFields(
  form: ViewConfig_allFormYaml_edges_node | FormConfig_allFormYaml_edges_node
) {
  if (!form.sections || !form.sections[0]) {
    return [];
  }
  return (form.sections as ReadonlyArray<
    FormConfig_allFormYaml_edges_node_sections
  >).reduce(
    (
      prev: ReadonlyArray<FormConfig_allFormYaml_edges_node_sections_fields>,
      cur: FormConfig_allFormYaml_edges_node_sections
    ) => {
      return cur && cur.fields
        ? ([...prev, ...cur.fields] as ReadonlyArray<
            FormConfig_allFormYaml_edges_node_sections_fields
          >)
        : prev;
    },
    [] as ReadonlyArray<FormConfig_allFormYaml_edges_node_sections_fields>
  );
}

export const SiteConfigFragment = graphql`
  fragment SiteConfigFragment on ConfigYamlConnection {
    edges {
      node {
        title
        description
        defaultLanguage
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
