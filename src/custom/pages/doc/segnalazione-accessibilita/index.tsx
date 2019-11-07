import { navigate } from "@reach/router";
import * as React from "react";

const RedirectToForm = () => {
  React.useEffect(() => {
    navigate("/form/segnalazione-accessibilita");
  }, []);
  return null;
};

export default RedirectToForm;
