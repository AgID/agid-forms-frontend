import * as React from "react";

import Layout from "../../components/Layout";
import SEO from "../../components/Seo";

import { Link } from "gatsby";

import { Query } from "react-apollo";
import { useTranslation } from "react-i18next";
import {
  GetUserNodes,
  GetUserNodesVariables
} from "../../generated/graphql/GetUserNodes";
import { UserProfileConfig } from "../../generated/graphql/UserProfileConfig";
import { getMenu, getSiteConfig } from "../../graphql/gatsby_fragments";
import { GET_USER_NODES } from "../../graphql/hasura_queries";

const UserProfileTemplate = ({
  data,
  userId
}: {
  data: UserProfileConfig;
  userId: string;
}) => {
  const { t } = useTranslation();
  const siteConfig = getSiteConfig(data);
  return (
    <Layout
      menu={getMenu(data)}
      siteConfig={siteConfig}
      title={t("pages.dashboard_title")}
    >
      <SEO title={t("pages.dashboard_title")} siteConfig={siteConfig} />
      <Query<GetUserNodes, GetUserNodesVariables>
        query={GET_USER_NODES}
        variables={{
          userId
        }}
      >
        {({
          loading: userNodesLoading,
          error: userNodesError,
          data: userNodes
        }) => {
          if (userNodesLoading) {
            return <p>{t("loading_data")}</p>;
          }
          if (userNodesError) {
            return (
              <p>
                {t("errors.error_getting_data")}{" "}
                {JSON.stringify(userNodesError)}
              </p>
            );
          }
          if (!userNodes) {
            return (
              <p>
                {data}
                {userId}
              </p>
            );
          }
          return (
            <table className="table table-hover table-bordered table-striped">
              <thead>
                <tr>
                  <th>title</th>
                  <th>type</th>
                  <th>created</th>
                  <th>updated</th>
                  <th>status</th>
                  <th>actions</th>
                </tr>
              </thead>
              <tbody>
                {userNodes.node.map(node => {
                  return (
                    <tr key={node.id}>
                      <td>
                        {node.title}
                        <br />
                        <small>{node.id}</small>
                      </td>
                      <td>{node.type}</td>
                      <td>{new Date(node.created_at).toLocaleDateString()}</td>
                      <td>{new Date(node.updated_at).toLocaleDateString()}</td>
                      <td>{node.status}</td>
                      <td>
                        <Link
                          to={`/form/${node.type.replace("_", "-")}/${node.id}`}
                        >
                          edit
                        </Link>{" "}
                        <Link to={`/revision/${node.id}/${node.version}`}>
                          view
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
        }}
      </Query>
    </Layout>
  );
};

export default UserProfileTemplate;