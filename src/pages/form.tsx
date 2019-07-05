import { RouteComponentProps, Router } from "@reach/router";

import { graphql } from "gatsby";
import * as React from "react";

import RouterPage from "../components/RouterPage";
import { FormConfig } from "../generated/graphql/FormConfig";

// @ts-ignore
import { PageConfigFragment } from "../graphql/gatsby_fragments";

import FormTemplate from "./forms/form-template";

const Form = ({ data }: { data: FormConfig }) => (
  <Router>
    <RouterPage
      pageComponent={(
        props: RouteComponentProps<{ formId: string; nodeId: string }>
      ) => (
        <FormTemplate data={data} formId={props.formId} nodeId={props.nodeId} />
      )}
      path="/form/:formId/:nodeId"
    />
    <RouterPage
      pageComponent={(props: RouteComponentProps<{ formId: string }>) => (
        <FormTemplate data={data} formId={props.formId} />
      )}
      path="/form/:formId"
    />
  </Router>
);

export const query = graphql`
  query FormConfig {
    menu: allConfigYaml(
      filter: { menu: { elemMatch: { name: { ne: null } } } }
    ) {
      ...PageConfigFragment
    }
    siteConfig: allConfigYaml(filter: { title: { ne: null } }) {
      ...SiteConfigFragment
    }
    allFormYaml {
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

export default Form;
