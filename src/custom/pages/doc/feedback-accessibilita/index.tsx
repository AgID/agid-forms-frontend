import { navigate } from "@reach/router";
import * as React from "react";

const RedirectToForm = () => {
  React.useEffect(() => {
    navigate("/form/feedback-accessibilita");
  }, []);
  return null;
};

export default RedirectToForm;
