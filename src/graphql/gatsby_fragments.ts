import { graphql } from "gatsby";
import { FormConfig } from "../generated/graphql/FormConfig";
import { PageConfig } from "../generated/graphql/PageConfig";
import { ViewConfig } from "../generated/graphql/ViewConfig";

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

export const getForm = (data: FormConfig | ViewConfig, formId?: string) => {
  if (!formId) {
    return null;
  }
  const forms = data.allFormYaml
    ? data.allFormYaml.edges.filter(node => node.node.id === formId)
    : null;
  if (!forms || !forms[0] || !forms[0].node) {
    return null;
  }
  const form = forms[0].node;
  if (!form.form_fields) {
    return null;
  }
  return form;
};

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
