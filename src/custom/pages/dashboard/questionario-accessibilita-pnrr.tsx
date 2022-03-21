import { Router } from "@reach/router";
import * as React from "react";
import RouterPage from "../../../components/RouterPage";
import DashboardA11ySurveyTemplate from "../../templates/questionario-accessibilita-pnrr/dashboard/dashboard-template";

const DashboardA11ySurvey = () => (
  <Router>
    <RouterPage
      pageComponent={() => <DashboardA11ySurveyTemplate />}
      path="/dashboard/questionario-accessibilita-pnrr"
    />
  </Router>
);

export default DashboardA11ySurvey;
