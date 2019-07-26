import * as React from "react";

import Layout from "../../components/Layout";
import SEO from "../../components/Seo";

import { Link } from "gatsby";

import { Query } from "react-apollo";
import { useTranslation } from "react-i18next";
import { DashboardConfig } from "../../generated/graphql/DashboardConfig";
import {
  GetUserNodes,
  GetUserNodesVariables
} from "../../generated/graphql/GetUserNodes";
import { getMenu, getSiteConfig } from "../../graphql/gatsby";
import { GET_USER_NODES } from "../../graphql/hasura";
import { getSessionInfo } from "../../utils/auth";

const DashboardTemplate = ({ data }: { data: DashboardConfig }) => {
  const { t } = useTranslation();
  const siteConfig = getSiteConfig(data);
  const sessionInfo = getSessionInfo();
  if (!sessionInfo || !sessionInfo.userId) {
    return null;
  }
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
          userId: sessionInfo.userId
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
                {sessionInfo.userId}
              </p>
            );
          }
          return (
            <table className="table table-hover">
              <thead className="lightgrey-bg-a3">
                <tr>
                  <th className="font-variant-small-caps">title</th>
                  <th className="font-variant-small-caps">type</th>
                  <th className="font-variant-small-caps">created</th>
                  <th className="font-variant-small-caps">updated</th>
                  <th className="font-variant-small-caps">status</th>
                  <th className="font-variant-small-caps">actions</th>
                </tr>
              </thead>
              <tbody className="font-size-xs color-black font-weight-600">
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

export default DashboardTemplate;
