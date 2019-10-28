import { navigate } from "@reach/router";
import React from "react";

const RedirectToForm = () => {
  React.useEffect(() => navigate("/form/diffusione-servizi-digitali"), []);
  return null;
};

export default RedirectToForm;
