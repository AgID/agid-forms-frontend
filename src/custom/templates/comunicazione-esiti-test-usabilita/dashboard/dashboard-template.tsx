import * as React from "react";

import SEO from "../../../../components/Seo";

import { Link as GatsbyLink } from "gatsby";

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

const DashboardComTemplate = () => {
  const { t } = useTranslation();
  const sessionInfo = getSessionInfo();
  if (!sessionInfo || !sessionInfo.userId) {
    return null;
  }

  const NewComCta = () => (
    <p>
      <GatsbyLink
        to="/form/comunicazione-esiti-test-usabilita"
        className="btn btn-outline-primary"
      >
        {t("ux_com.create_new_com_cta")}{" "}
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
      title={t("ux_com.dashboard_title")}
      breadcrumbItems={[
        { label: t("ux_com.title"), link: "/doc/comunicazione-esiti-test-usabilita" },
        { label: t("ux_com.dashboard_title"), link: "" }
      ]}
    >
      <SEO title={t("ux_com.dashboard_title")} />
      <Query<GetGroupNodesOfType, GetGroupNodesOfTypeVariables>
        query={GET_GROUP_NODES_OF_TYPE}
        fetchPolicy="network-only"
        variables={{
          groupId: sessionInfo.organizationCode || "",
          nodeType: "comunicazione_esiti_test_usabilita"
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
                <h2>{t("ux_com.create_new_com_title")}</h2>
                <div
                  className="w-paragraph mb-5"
                  dangerouslySetInnerHTML={{
                    __html: t("ux_com.create_new_com_desc")
                  }}
                />
                <NewComCta />
              </div>
            );
          }
          return (
            <div>
              <NewComCta />
              <div className="table-responsive">
                <table className="table table-hover mt-4">
                  <thead className="lightgrey-bg-a3">
                    <tr>
                      <th scope="col" className="font-variant-small-caps px-5">
                        {t("name")}
                      </th>
                      <th scope="col" className="font-variant-small-caps px-5">
                        {t("ux_com.dashboard_sent_date")}
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
                              {node.content.values["website-name"]}
                              <br />
                              <small className="font-size-xxs">
                                {node.content.values["website-url"]}
                              </small>
                            </td>
                            <td className="px-5">
                              {format(node.updated_at, "DD/MM/YYYY")}
                            </td>
                            <td className="px-5">
                              <a href={`/revision/${node.id}/${node.version}`}>{t("view")}</a>
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

export default DashboardComTemplate;
