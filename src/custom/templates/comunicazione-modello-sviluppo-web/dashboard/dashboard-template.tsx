import * as React from "react";

import SEO from "../../../../components/Seo";

import { graphql, Link as GatsbyLink, useStaticQuery } from "gatsby";

import { format } from "date-fns";
import { Query } from "react-apollo";
import { useTranslation } from "react-i18next";
import StaticLayout from "../../../../components/StaticLayout";
import { getSessionInfo } from "../../../../utils/auth";

import {
  GetGroupNodesOfType,
  GetGroupNodesOfTypeVariables
} from "../../../../generated/graphql/GetGroupNodesOfType";
import { GET_GROUP_NODES_OF_TYPE } from "../../../../graphql/hasura";

import { getContextualMenu } from "../../../../graphql/gatsby";

const DashboardDeclTemplate = () => {
  const { t } = useTranslation();
  const sessionInfo = getSessionInfo();
  if (!sessionInfo || !sessionInfo.userId) {
    return null;
  }

  const NewDeclCta = () => (
    <p>
      <GatsbyLink
        to="/form/comunicazione-modello-sviluppo-web"
        className="btn btn-outline-primary"
      >
        {t("lg_decl.create_new_decl_cta")}{" "}
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

  const data = useStaticQuery(graphql`
    query DashboardDeclConfig {
      allMenuYaml {
        ...ContextualMenuFragment
      }
    }
  `);

  return (
    <StaticLayout
      title={t("lg_decl.dashboard_title")}
      contextMenu={getContextualMenu(data, "comunicazione-modello-sviluppo-web")}
      breadcrumbItems={[
        { label: t("lg_decl.title"), link: "/doc/comunicazione-modello-sviluppo-web" },
        { label: t("lg_decl.dashboard_title"), link: "" }
      ]}
    >
      <SEO title={t("lg_decl.dashboard_title")} />
      <Query<GetGroupNodesOfType, GetGroupNodesOfTypeVariables>
        query={GET_GROUP_NODES_OF_TYPE}
        fetchPolicy="network-only"
        variables={{
          groupId: sessionInfo.organizationCode || "",
          nodeType: "comunicazione_modello_sviluppo_web"
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
                <h2>{t("lg_decl.create_new_decl_title")}</h2>
                <div
                  className="w-paragraph mb-5"
                  dangerouslySetInnerHTML={{
                    __html: t("lg_decl.create_new_decl_desc")
                  }}
                />
                <NewDeclCta />
              </div>
            );
          }
          return (
            <div>
              <NewDeclCta />
              <div className="table-responsive">
                <table className="table table-hover mt-4">
                  <thead className="lightgrey-bg-a3">
                    <tr>
                      <th scope="col" className="font-variant-small-caps px-5">
                        {t("name")}
                      </th>
                      <th scope="col" className="font-variant-small-caps px-5">
                        {t("lg_decl.dashboard_sent_date")}
                      </th>
                      <th scope="col" className="font-variant-small-caps px-5">
                        {t("lg_decl.dashboard_adjustment_date")}
                      </th>
                      <th scope="col" className="font-variant-small-caps px-5">
                        {t("view")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-size-xs color-black font-weight-600">
                    {userNodes &&
                      userNodes.node.map(node => {
                        return (
                          <tr key={node.id}>
                            <td className="px-5">
                              {node.content.values["website-url"]}
                            </td>
                            <td className="px-5">
                              {format(node.updated_at, "DD/MM/YYYY")}
                            </td>
                            <td className="px-5">
                              {format(
                                node.content.values["adjustment-date"],
                                "DD/MM/YYYY"
                              )}
                            </td>
                            <td className="px-5">
                              <a href={`/view/${node.id}`}>{t("view")}</a>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }}
      </Query>
    </StaticLayout>
  );
};

export default DashboardDeclTemplate;
