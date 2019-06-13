import * as React from "react";

import { RouterProps } from "@reach/router";
import { navigate } from "gatsby";
import { isLoggedIn } from "../utils/auth";

type Props<T> = Omit<RouterProps, "component"> &
  T & {
    component: React.SFC<T>;
  };

// tslint:disable-next-line: only-arrow-functions
const PrivateRoute = function<T>({
  component: Component,
  location,
  ...rest
}: Props<T>) {
  if (!isLoggedIn() && location && location.pathname !== `/`) {
    // If we’re not logged in, redirect to the home page.
    navigate(`/`);
    return <></>;
  }
  return (Component as any)(rest);
};

export default PrivateRoute;
