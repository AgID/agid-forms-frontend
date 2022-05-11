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

const DashboardA11ySurveyTemplate = () => {
  const { t } = useTranslation();
  const sessionInfo = getSessionInfo();
  if (!sessionInfo || !sessionInfo.userId) {
    return null;
  }

  const NewA11ySurveyCta = () => (
    <p>
      <GatsbyLink
        to="/form/questionario-accessibilita-pnrr"
        className="btn btn-outline-primary"
      >
        {t("a11y_survey.create_new_filing_cta")}{" "}
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
    query DashboardA11ySurveyConfig {
      allMenuYaml {
        ...ContextualMenuFragment
      }
    }
  `);

  return (
    <StaticLayout
      title={t("a11y_survey.dashboard_title")}
      contextMenu={getContextualMenu(data, "questionario-accessibilita-pnrr")}
      breadcrumbItems={[
        { label: t("a11y_survey.title"), link: "/doc/questionario-accessibilita-pnrr" },
        { label: t("a11y_survey.dashboard_title"), link: "" }
      ]}
    >
      <SEO title={t("a11y_survey.dashboard_title")} />
      <Query<GetGroupNodesOfType, GetGroupNodesOfTypeVariables>
        query={GET_GROUP_NODES_OF_TYPE}
        fetchPolicy="network-only"
        variables={{
          groupId: sessionInfo.organizationCode || "",
          nodeType: "questionario_accessibilita_pnrr"
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
                <h2>{t("a11y_survey.create_new_filing_title")}</h2>
                <div
                  className="w-paragraph mb-5"
                  dangerouslySetInnerHTML={{
                    __html: t("a11y_survey.create_new_filing_desc")
                  }}
                />
                <NewA11ySurveyCta />
              </div>
            );
          }
          return (
            <div>
              <NewA11ySurveyCta />
              <div className="table-responsive">
                <table className="table table-hover mt-4">
                  <thead className="lightgrey-bg-a3">
                    <tr>
                      <th scope="col" className="font-variant-small-caps px-5">
                        {t("a11y_survey.dashboard_sent_date")}
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
                              {format(node.updated_at, "DD/MM/YYYY")}
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

export default DashboardA11ySurveyTemplate;
