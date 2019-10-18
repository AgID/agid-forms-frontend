import * as React from "react";

import SEO from "../../components/Seo";

import { Link } from "gatsby";

import { Query } from "react-apollo";
import { useTranslation } from "react-i18next";
import StaticLayout from "../../components/StaticLayout";
import {
  GetUserNodes,
  GetUserNodesVariables
} from "../../generated/graphql/GetUserNodes";
import { GET_USER_NODES } from "../../graphql/hasura";
import { getSessionInfo } from "../../utils/auth";

const DashboardTemplate = () => {
  const { t } = useTranslation();
  const sessionInfo = getSessionInfo();
  if (!sessionInfo || !sessionInfo.userId) {
    return null;
  }
  return (
    <StaticLayout title={t("pages.dashboard_title")}>
      <SEO title={t("pages.dashboard_title")} />
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
            return <p>{t("no_node_found")}</p>;
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
                          to={`/form/${node.type.replace(/_/g, "-")}/${
                            node.id
                          }`}
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
    </StaticLayout>
  );
};

export default DashboardTemplate;
