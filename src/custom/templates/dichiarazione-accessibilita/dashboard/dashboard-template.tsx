import * as React from "react";

import Layout from "../../../../components/Layout";
import SEO from "../../../../components/Seo";

import { Link } from "@reach/router";

import { format } from "date-fns";
import { Query } from "react-apollo";
import { useTranslation } from "react-i18next";
import { DashboardConfig } from "../../../../generated/graphql/DashboardConfig";
import {
  GetUserAccessibilityDecl,
  GetUserAccessibilityDeclVariables
} from "../../../../generated/graphql/GetUserAccessibilityDecl";
import { getMenu, getSiteConfig } from "../../../../graphql/gatsby";
import { getSessionInfo } from "../../../../utils/auth";
import { GET_USER_ACCESSIBILITY_DECLS } from "../../../graphql/hasura";

const DashboardDeclTemplate = ({ data }: { data: DashboardConfig }) => {
  const { t } = useTranslation();
  const siteConfig = getSiteConfig(data);
  const sessionInfo = getSessionInfo();
  if (!sessionInfo || !sessionInfo.userId) {
    return null;
  }

  const NewDeclCta = () => (
    <p>
      <Link to="/form/dichiarazione-accessibilita" className="btn btn-primary">
        {t("acc_decl.create_new_decl_cta")}
      </Link>
    </p>
  );

  return (
    <Layout
      menu={getMenu(data)}
      siteConfig={siteConfig}
      title={t("pages.dashboard_title")}
    >
      <SEO title={t("pages.dashboard_title")} siteConfig={siteConfig} />
      <Query<GetUserAccessibilityDecl, GetUserAccessibilityDeclVariables>
        query={GET_USER_ACCESSIBILITY_DECLS}
        fetchPolicy="network-only"
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
          if (userNodes && !userNodes.node[0]) {
            return (
              <div className="p-lg-4">
                <h2>{t("acc_decl.create_new_decl_title")}</h2>
                <p className="w-paragraph mb-5">
                  {t("acc_decl.create_new_decl_desc")}
                </p>
                <NewDeclCta />
              </div>
            );
          }
          return (
            <div>
              <NewDeclCta />
              <table className="table table-hover">
                <thead className="lightgrey-bg-a3">
                  <tr>
                    <th className="font-variant-small-caps">
                      {t("acc_decl.device_type")}
                    </th>
                    <th className="font-variant-small-caps">{t("name")}</th>
                    <th className="font-variant-small-caps">{t("outcome")}</th>
                    <th className="font-variant-small-caps">
                      {t("updated_at")}
                    </th>
                    <th className="font-variant-small-caps">{t("edit")}</th>
                    <th className="font-variant-small-caps">{t("status")}</th>
                  </tr>
                </thead>
                <tbody className="font-size-xs color-black font-weight-600">
                  {userNodes &&
                    userNodes.node.map(node => {
                      return (
                        <tr key={node.id}>
                          <td>
                            {node.content.values["device-type"] === "website"
                              ? "sito"
                              : "app"}
                          </td>
                          <td>
                            {node.content.values["device-type"] === "website"
                              ? node.content.values["website-name"]
                              : node.content.values["app-name"]}
                            <br />
                            <small className="font-size-xxs">
                              {node.content.values["device-type"] === "website"
                                ? node.content.values["website-url"]
                                : node.content.values["app-url"]}
                            </small>
                          </td>
                          <td>
                            {t(
                              `acc_decl.${node.content.values["compliance-status"]}`
                            )}
                          </td>
                          <td>{format(node.updated_at, "DD/MM/YYYY")}</td>
                          <td>
                            <Link
                              to={`/form/${node.type!.replace("_", "-")}/${
                                node.id
                              }`}
                            >
                              {t("edit")}
                            </Link>
                          </td>
                          <td>
                            {node.status === "published" ? (
                              <Link to={`/view/${node.id}`}>
                                {t(`status_name.${node.status}`)}
                              </Link>
                            ) : (
                              t(`status_name.${node.status}`)
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          );
        }}
      </Query>
    </Layout>
  );
};

export default DashboardDeclTemplate;
