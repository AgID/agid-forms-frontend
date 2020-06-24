import { navigate } from "@reach/router";
import * as React from "react";

const RedirectToForm = () => {
  React.useEffect(() => {
    navigate("/form/procedura-attuazione");
  }, []);
  return null;
};

export default RedirectToForm;
