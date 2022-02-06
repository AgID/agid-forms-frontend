import { Router } from "@reach/router";
import * as React from "react";
import RouterPage from "../../../components/RouterPage";
import DashboardObjTemplate from "../../templates/obiettivi-accessibilita/dashboard/dashboard-template";

const DashboardObj = () => (
  <Router>
    <RouterPage
      pageComponent={() => <DashboardObjTemplate />}
      path="/dashboard/obiettivi-accessibilita"
    />
  </Router>
);

export default DashboardObj;
