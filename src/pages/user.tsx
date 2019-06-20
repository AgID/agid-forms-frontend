import { RouteComponentProps, Router } from "@reach/router";

import { graphql } from "gatsby";
import * as React from "react";

import RouterPage from "../components/RouterPage";

// @ts-ignore
import { PageConfigFragment } from "../graphql/gatsby_fragments";

import { UserProfileConfig } from "../generated/graphql/UserProfileConfig";
import UserProfileTemplate from "./user/user-profile-template";

const UserProfile = ({ data }: { data: UserProfileConfig }) => (
  <Router>
    <RouterPage
      pageComponent={(props: RouteComponentProps<{ userId: string }>) => (
        <UserProfileTemplate data={data} userId={props.userId!} />
      )}
      path="/user/:userId"
    />
  </Router>
);

export const query = graphql`
  query UserProfileConfig {
    menu: allConfigYaml(
      filter: { menu: { elemMatch: { name: { ne: null } } } }
    ) {
      ...PageConfigFragment
    }
    siteConfig: allConfigYaml(filter: { title: { ne: null } }) {
      ...SiteConfigFragment
    }
  }
`;

export default UserProfile;
