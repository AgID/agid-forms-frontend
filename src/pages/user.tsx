import { RouteComponentProps, Router } from "@reach/router";

import { graphql } from "gatsby";
import * as React from "react";

import RouterPage from "../components/RouterPage";
import { FormConfig } from "../generated/graphql/FormConfig";

// @ts-ignore
import { PageConfigFragment } from "../graphql/gatsby_fragments";

import UserProfileTemplate from "./user/user-profile-template";

const UserProfile = ({ data }: { data: FormConfig }) => (
  <Router>
    <RouterPage
      pageComponent={(props: RouteComponentProps<{ userId: string }>) => (
        <UserProfileTemplate data={data} userId={props.userId} />
      )}
      path="/user/:userId"
    />
  </Router>
);

export const query = graphql`
  query UserProfileConfig {
    allConfigYaml(filter: { menu: { elemMatch: { name: { ne: null } } } }) {
      ...PageConfigFragment
    }
  }
`;

export default UserProfile;
