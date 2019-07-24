import { Router } from "@reach/router";

import { graphql } from "gatsby";
import * as React from "react";

import RouterPage from "../components/RouterPage";

import { DashboardConfig } from "../generated/graphql/DashboardConfig";
import DashboardTemplate from "../templates/dashboard/dashboard-template";

const Dashboard = ({ data }: { data: DashboardConfig }) => (
  <Router>
    <RouterPage
      pageComponent={() => <DashboardTemplate data={data} />}
      path="/dashboard"
    />
  </Router>
);

export const query = graphql`
  query DashboardConfig {
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

export default Dashboard;
