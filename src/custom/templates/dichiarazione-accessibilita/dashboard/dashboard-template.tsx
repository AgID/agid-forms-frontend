import * as React from "react";

import SEO from "../../../../components/Seo";

import { Link } from "@reach/router";
import { Link as GatsbyLink } from "gatsby";

import { format } from "date-fns";
import { Query } from "react-apollo";
import { useTranslation } from "react-i18next";
import StaticLayout from "../../../../components/StaticLayout";
import {
  GetUserAccessibilityDecl,
  GetUserAccessibilityDeclVariables
} from "../../../../generated/graphql/GetUserAccessibilityDecl";
import { getSessionInfo } from "../../../../utils/auth";
import { GET_USER_ACCESSIBILITY_DECLS } from "../../../graphql/hasura";

const DashboardDeclTemplate = () => {
  const { t } = useTranslation();
  const sessionInfo = getSessionInfo();
  if (!sessionInfo || !sessionInfo.userId) {
    return null;
  }

  const NewDeclCta = () => (
    <p>
      <GatsbyLink
        to="/form/dichiarazione-accessibilita"
        className="btn btn-primary"
      >
        {t("acc_decl.create_new_decl_cta")}
      </GatsbyLink>
    </p>
  );

  return (
    <StaticLayout title={t("acc_decl.dashboard_title")}>
      <SEO title={t("acc_decl.dashboard_title")} />
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
                <div
                  className="w-paragraph mb-5"
                  dangerouslySetInnerHTML={{
                    __html: t("acc_decl.create_new_decl_desc")
                  }}
                />
                <NewDeclCta />
              </div>
            );
          }
          return (
            <div>
              <NewDeclCta />
              <h2>{t("acc_decl.decl_statuses")}</h2>
              <table className="table table-hover table-responsive">
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
                            {node.content.metadata &&
                              node.content.metadata.verified && (
                                <p className="font-weight-normal">
                                  [{t(`verified`)}]
                                </p>
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
    </StaticLayout>
  );
};

export default DashboardDeclTemplate;
