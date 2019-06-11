import { RouteComponentProps } from "@reach/router";

const RouterPage = ({
  pageComponent,
  ...routerProps
}: {
  pageComponent: (routerProps: RouteComponentProps) => JSX.Element;
} & RouteComponentProps) => {
  return pageComponent(routerProps);
};

export default RouterPage;
