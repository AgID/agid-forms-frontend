import { Router } from "@reach/router";
import * as React from "react";
import RouterPage from "../../../components/RouterPage";
import DashboardDeclTemplate from "../../templates/comunicazione-esiti-test-usabilita/dashboard/dashboard-template";

const DashboardDecl = () => (
  <Router>
    <RouterPage
      pageComponent={() => <DashboardDeclTemplate />}
      path="/dashboard/comunicazione-esiti-test-usabilita"
    />
  </Router>
);

export default DashboardDecl;
