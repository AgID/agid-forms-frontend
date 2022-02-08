import * as React from "react";

import SEO from "../../../../components/Seo";

import { Link } from "@reach/router";
import { Link as GatsbyLink } from "gatsby";

import { format } from "date-fns";
import { Query } from "react-apollo";
import { useTranslation } from "react-i18next";
import StaticLayout from "../../../../components/StaticLayout";
import {
  GetGroupNodesOfType,
  GetGroupNodesOfTypeVariables
} from "../../../../generated/graphql/GetGroupNodesOfType";
import { GET_GROUP_NODES_OF_TYPE } from "../../../../graphql/hasura";
import { getSessionInfo } from "../../../../utils/auth";

const DashboardObjTemplate = () => {
  const { t } = useTranslation();
  const sessionInfo = getSessionInfo();
  if (!sessionInfo || !sessionInfo.userId) {
    return null;
  }

  const NewObjCta = () => (
    <p>
      <GatsbyLink
        to="/form/obiettivi-accessibilita"
        className="btn btn-outline-primary"
      >
        {t("a11y_objs.create_new_obj_cta")}
        <span
          aria-hidden="true"
          style={{
            fontSize: "24px",
            lineHeight: "1px",
            paddingLeft: "16px",
            fontWeight: "bold"
          }}
        >
          +
        </span>
      </GatsbyLink>
    </p>
  );

  return (
    <StaticLayout
      title={t("a11y_objs.dashboard_title")}
      breadcrumbItems={[
        { label: t("a11y_objs.title"), link: "/doc/obiettivi-accessibilita" },
        { label: t("a11y_objs.dashboard_title"), link: "" }
      ]}
    >
      <SEO title={t("a11y_objs.dashboard_title")} />
      <Query<GetGroupNodesOfType, GetGroupNodesOfTypeVariables>
        query={GET_GROUP_NODES_OF_TYPE}
        fetchPolicy="network-only"
        onCompleted={value => { console.log(value) }}
        variables={{
          groupId: sessionInfo.organizationCode || "",
          nodeType: "obiettivi_accessibilita"
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
                <h2>{t("a11y_objs.create_new_obj_title")}</h2>
                <div
                  className="w-paragraph mb-5"
                  dangerouslySetInnerHTML={{
                    __html: t("a11y_objs.create_new_obj_desc")
                  }}
                />
                <NewObjCta />
              </div>
            );
          }
          return (
            <div>
              <table className="table table-hover mt-4">
                <caption>{t("a11y_objs.obj_statuses")}</caption>
                <thead className="lightgrey-bg-a3">
                  <tr>
                    <th scope="col" className="font-variant-small-caps">
                      {t("year")}
                    </th>
                    <th scope="col" className="font-variant-small-caps">
                      {t("filled_out_at")}
                    </th>
                    <th scope="col" className="font-variant-small-caps">
                      {t("action")}
                    </th>
                    <th scope="col" className="font-variant-small-caps">
                      {t("status")}
                    </th>
                  </tr>
                </thead>
                <tbody className="font-size-xs color-black font-weight-600">
                  {userNodes &&
                    userNodes.node.map(node => {
                      return (
                        <tr key={node.id}>
                          <td>{node.content.values["anno"]}</td>
                          <td>{format(node.updated_at, "DD/MM/YYYY")}</td>
                          <td>
                            <Link
                              to={`/form/${node.type!.replace(/_/g, "-")}/${
                                node.id
                              }`}
                            >
                              {node.status === "published" ? t("update") : t("edit")}
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
              <NewObjCta />
            </div>
          );
        }}
      </Query>
    </StaticLayout>
  );
};

export default DashboardObjTemplate;
