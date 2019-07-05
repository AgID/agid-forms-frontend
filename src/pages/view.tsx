import { RouteComponentProps, Router } from "@reach/router";

import { graphql } from "gatsby";
import * as React from "react";

import RouterPage from "../components/RouterPage";

import { ViewConfig } from "../generated/graphql/ViewConfig";
import ViewTemplate from "./forms/view-template";

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
          sections {
            fields {
              description
              name
              title
              widget
            }
          }
        }
      }
    }
  }
`;

export default View;
