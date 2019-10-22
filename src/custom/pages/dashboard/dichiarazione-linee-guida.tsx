import { Router } from "@reach/router";
import * as React from "react";
import RouterPage from "../../../components/RouterPage";
import DashboardDeclTemplate from "../../templates/dichiarazione-linee-guida/dashboard/dashboard-template";

const DashboardDecl = () => (
  <Router>
    <RouterPage
      pageComponent={() => <DashboardDeclTemplate />}
      path="/dashboard/dichiarazione-linee-guida"
    />
  </Router>
);

export default DashboardDecl;
