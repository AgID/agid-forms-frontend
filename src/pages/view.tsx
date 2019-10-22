import { RouteComponentProps, Router } from "@reach/router";

import { graphql } from "gatsby";
import * as React from "react";

import RouterPage from "../components/RouterPage";

import { ViewConfig } from "../generated/graphql/ViewConfig";
import ViewTemplate from "../templates/node/view-template";

const View = ({ data }: { data: ViewConfig }) => (
  <Router>
    <RouterPage
      pageComponent={(props: RouteComponentProps<{ uuid: string }>) => (
        <ViewTemplate data={data} uuid={props.uuid!} />
      )}
      path="/view/:uuid/*"
    />
  </Router>
);

export const query = graphql`
  query ViewConfig {
    allFormYaml {
      ...FormSchemaFragment
    }
    allMenuYaml {
      ...ContextualMenuFragment
    }
  }
`;

export default View;
