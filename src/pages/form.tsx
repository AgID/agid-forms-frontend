import { RouteComponentProps, Router } from "@reach/router";

import { graphql } from "gatsby";
import * as React from "react";

import PrivateRoute from "../components/PrivateRoute";
import { FormConfig } from "../generated/graphql/FormConfig";
import FormTemplate from "../templates/node/form-template";

const Form = ({ data }: { data: FormConfig }) => (
  <Router>
    <PrivateRoute
      component={(
        props: RouteComponentProps<{ formId: string; nodeId: string }>
      ) => (
        <FormTemplate data={data} formId={props.formId} nodeId={props.nodeId} />
      )}
      path="/form/:formId/:nodeId"
    />
    <PrivateRoute
      component={(props: RouteComponentProps<{ formId: string }>) => (
        <FormTemplate data={data} formId={props.formId} />
      )}
      path="/form/:formId"
    />
  </Router>
);

export const query = graphql`
  query FormConfig {
    allFormYaml {
      ...FormSchemaFragment
    }
    allMenuYaml {
      ...ContextualMenuFragment
    }
  }
`;

export default Form;
