import { Router } from "@reach/router";

import * as React from "react";

import RouterPage from "../components/RouterPage";

import DashboardTemplate from "../templates/dashboard/dashboard-template";

const Dashboard = () => (
  <Router>
    <RouterPage pageComponent={() => <DashboardTemplate />} path="/dashboard" />
  </Router>
);

export default Dashboard;
