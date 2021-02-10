import { Router } from "@reach/router";
import * as React from "react";
import RouterPage from "../../../components/RouterPage";
import DashboardDeclTemplate from "../../templates/comunicazione-modello-sviluppo-web/dashboard/dashboard-template";

const DashboardDecl = () => (
  <Router>
    <RouterPage
      pageComponent={() => <DashboardDeclTemplate />}
      path="/dashboard/comunicazione-modello-sviluppo-web"
    />
  </Router>
);

export default DashboardDecl;
