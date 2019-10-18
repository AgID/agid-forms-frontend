import { RouteComponentProps, Router } from "@reach/router";

import { graphql } from "gatsby";
import * as React from "react";

import PrivateRoute from "../components/PrivateRoute";
import { ViewConfig } from "../generated/graphql/ViewConfig";
import RevisionTemplate from "../templates/node/revision-template";

const View = ({ data }: { data: ViewConfig }) => (
  <Router>
    <PrivateRoute
      component={(
        props: RouteComponentProps<{ uuid: string; version: number }>
      ) => (
        <RevisionTemplate
          data={data}
          uuid={props.uuid!}
          version={props.version!}
        />
      )}
      path="/revision/:uuid/:version"
    />
  </Router>
);

export const query = graphql`
  query RevisionConfig {
    allFormYaml {
      ...FormSchemaFragment
    }
    allMenuYaml {
      ...ContextualMenuFragment
    }
  }
`;

export default View;
