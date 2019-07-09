import { graphql } from "gatsby";
import { FormConfig } from "../generated/graphql/FormConfig";
import { PageConfig } from "../generated/graphql/PageConfig";
import { ViewConfig } from "../generated/graphql/ViewConfig";
import { FieldT, FormGroupT, FormsectionT, FormT } from "../utils/forms";

export const FormSchemaFragment = graphql`
  fragment FormSchemaFragment on FormYamlConnection {
    edges {
      node {
        id
        version
        language
        enabled
        slug_pattern
        title_pattern
        sections {
          title
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

export function getGroupFields(group: FormGroupT) {
  return group.fields && group.repeatable
    ? (group.fields as ReadonlyArray<FieldT>).map(field =>
        field ? { ...field, name: `${group.name}.0.${field.name}` } : ""
      )
    : group.fields || [];
}

/**
 * Flatten form fields into array
 */
export function getFormFields(form: FormT) {
  if (!form.sections || !form.sections[0]) {
    return [];
  }
  return (form.sections as ReadonlyArray<FormsectionT>).reduce(
    (prevSection: ReadonlyArray<FieldT>, curSection: FormsectionT) => {
      return curSection && curSection.groups
        ? [
            ...prevSection,
            ...curSection.groups.reduce(
              (prevGroup, curGroup) =>
                curGroup && curGroup.fields
                  ? ([
                      ...prevGroup,
                      ...getGroupFields(curGroup)
                    ] as ReadonlyArray<FieldT>)
                  : prevGroup,
              [] as ReadonlyArray<FieldT>
            )
          ]
        : prevSection;
    },
    [] as ReadonlyArray<FieldT>
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
