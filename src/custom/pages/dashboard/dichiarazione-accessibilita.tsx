import { Router } from "@reach/router";
import * as React from "react";
import RouterPage from "../../../components/RouterPage";
import DashboardDeclTemplate from "../../templates/dichiarazione-accessibilita/dashboard/dashboard-template";

const DashboardDecl = () => (
  <Router>
    <RouterPage
      pageComponent={() => <DashboardDeclTemplate />}
      path="/dashboard/dichiarazione-accessibilita"
    />
  </Router>
);

export default DashboardDecl;
