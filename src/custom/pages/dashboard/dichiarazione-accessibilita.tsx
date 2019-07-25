import { Router } from "@reach/router";

import { graphql } from "gatsby";
import * as React from "react";

import RouterPage from "../../../components/RouterPage";

import { DashboardDeclConfig } from "../../../generated/graphql/DashboardDeclConfig";
import DashboardDeclTemplate from "../../templates/dichiarazione-accessibilita/dashboard/dashboard-template";

const DashboardDecl = ({ data }: { data: DashboardDeclConfig }) => (
  <Router>
    <RouterPage
      pageComponent={() => <DashboardDeclTemplate data={data} />}
      path="/dashboard/dichiarazione-accessibilita"
    />
  </Router>
);

export const query = graphql`
  query DashboardDeclConfig {
    menu: allConfigYaml(
      filter: { menu: { elemMatch: { name: { ne: null } } } }
    ) {
      ...PageConfigFragment
    }
    siteConfig: allConfigYaml(filter: { title: { ne: null } }) {
      ...SiteConfigFragment
    }
  }
`;

export default DashboardDecl;
