import * as React from "react";

import Layout from "../../components/Layout";
import SEO from "../../components/Seo";

import { Link } from "gatsby";

import { ViewConfig } from "../../generated/graphql/ViewConfig";

import { Query } from "react-apollo";
import { useTranslation } from "react-i18next";
import BodyStyles from "../../components/BodyStyles";
import LoadableView from "../../components/LoadableView";
import { GetNode, GetNodeVariables } from "../../generated/graphql/GetNode";
import { getForm, getMenu, getSiteConfig } from "../../graphql/gatsby";
import { GET_LATEST_NODE_WITH_PUBLISHED } from "../../graphql/hasura";
import { isLoggedIn } from "../../utils/auth";

const ViewTemplate = ({
  data,
  uuid
}: {
  data: ViewConfig;
  formId?: string;
  uuid: string;
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = React.useState(t("pages.view_title"));
  const siteConfig = getSiteConfig(data);
  return (
    <Layout menu={getMenu(data)} siteConfig={siteConfig} title={title}>
      <BodyStyles backgroundColor="#e7e6ff" />
      <SEO title={t("pages.view_title")} siteConfig={siteConfig} />
      <Query<GetNode, GetNodeVariables>
        query={GET_LATEST_NODE_WITH_PUBLISHED}
        variables={{
          id: uuid
        }}
      >
        {({ loading, error, data: getNodeResult }) => {
          if (loading) {
            return <p>{t("loading_data")}</p>;
          }
          if (error) {
            return (
              <p className="alert alert-warning">
                {t("errors.error_getting_data")}: {JSON.stringify(error)}
              </p>
            );
          }
          const latestNode =
            getNodeResult && getNodeResult.latest && getNodeResult.latest[0]
              ? getNodeResult.latest[0]
              : null;

          if (!latestNode) {
            return (
              <p className="alert alert-warning">
                {t("errors.content_not_found")}
              </p>
            );
          }

          const publishedNode =
            latestNode && latestNode.published && latestNode.published[0]
              ? latestNode.published[0]
              : null;

          if (!publishedNode) {
            return (
              <p className="alert alert-warning">
                {t("errors.content_not_found")}
              </p>
            );
          }

          const isLatestPublishedVersion =
            publishedNode && publishedNode.version === latestNode.version;
          {
            /* shows the latest published page with an eventual link to latest version (only if the user is logged in) */
          }
          const formId = latestNode.content.schema.id;
          const form = getForm(data, formId);
          if (!form) {
            return (
              <p className="alert alert-warning">
                {t("errors.content_not_found")}
              </p>
            );
          }
          setTitle(publishedNode.title);
          return (
            <>
              {isLoggedIn() && (
                <div className="pl-lg-5">
                  <small>
                    <Link
                      to={`/form/${latestNode.content.schema.id}/${latestNode.id}`}
                    >
                      {t("edit")}
                    </Link>
                  </small>
                  {!isLatestPublishedVersion && (
                    <p className="alert alert-warning mt-3">
                      {t("not_latest_version")}
                      <br />
                      <Link
                        to={`/revision/${latestNode.id}/${latestNode.version}`}
                      >
                        {t("view_latest_version")}
                      </Link>
                    </p>
                  )}
                </div>
              )}
              {publishedNode && (
                <LoadableView
                  node={publishedNode}
                  form={form}
                  values={publishedNode.content.values}
                />
              )}
            </>
          );
        }}
      </Query>
    </Layout>
  );
};

export default ViewTemplate;
