import * as React from "react";
import Layout from "../../components/Layout";
import SEO from "../../components/Seo";

import { Link } from "gatsby";

import { ViewConfig } from "../../generated/graphql/ViewConfig";

import { Query } from "react-apollo";
import BodyStyles from "../../components/BodyStyles";
import {
  GetNodeRevision,
  GetNodeRevisionVariables
} from "../../generated/graphql/GetNodeRevision";
import {
  getForm,
  getMenu,
  getSiteConfig
} from "../../graphql/gatsby_fragments";
import { GET_NODE_REVISION_WITH_PUBLISHED } from "../../graphql/hasura_queries";
import { isLoggedIn } from "../../utils/auth";

import { useTranslation } from "react-i18next";
import {
  flattenFormFieldsWithKeys,
  flattenFormValues
} from "../../utils/forms";
import { renderViewFields } from "./view-template";

const RevisionTemplate = ({
  data,
  uuid,
  version
}: {
  data: ViewConfig;
  formId?: string;
  uuid: string;
  version: number;
}) => {
  const [t] = useTranslation();
  const [title, setTitle] = React.useState(t("pages.revision_title"));
  return (
    <Layout menu={getMenu(data)} siteConfig={getSiteConfig(data)} title={title}>
      <BodyStyles backgroundColor="#e7e6ff" />
      <SEO title={t("pages.revision_title")} meta={[]} keywords={[]} />
      <Query<GetNodeRevision, GetNodeRevisionVariables>
        query={GET_NODE_REVISION_WITH_PUBLISHED}
        variables={{
          id: uuid,
          version
        }}
      >
        {({ loading, error, data: getNodeResult }) => {
          if (loading) {
            return <p>{t("loading_data")}</p>;
          }
          if (error) {
            return (
              <p>
                {t("errors.error_getting_data")}: {JSON.stringify(error)}
              </p>
            );
          }

          const nodeRevision =
            getNodeResult && getNodeResult.revision && getNodeResult.revision[0]
              ? getNodeResult.revision[0]
              : null;

          if (!nodeRevision) {
            return (
              <p className="alert alert-warning">
                {t("errors.content_not_found")}
              </p>
            );
          }

          const publishedNode =
            getNodeResult &&
            getNodeResult.published &&
            getNodeResult.published[0]
              ? getNodeResult.published[0]
              : null;

          const isLatestPublishedVersion =
            publishedNode && publishedNode.version === nodeRevision.version;
          {
            /* shows the latest published page with an eventual link to latest version (only if the user is logged in) */
          }
          const formId = nodeRevision.content.schema.id;
          const form = getForm(data, formId);
          if (!form) {
            return (
              <p className="alert alert-warning">
                {t("errors.content_not_found")}
              </p>
            );
          }
          setTitle(nodeRevision.title);
          return (
            <>
              {isLoggedIn() && (
                <div className="mb-4">
                  <small>
                    <Link
                      to={`/form/${nodeRevision.content.schema.id}/${nodeRevision.id}`}
                    >
                      {t("edit")}
                    </Link>
                  </small>
                  {publishedNode && !isLatestPublishedVersion && (
                    <p className="alert alert-warning">
                      {t("not_published_version")}
                      <br />
                      <Link to={`/view/${publishedNode.id}`}>
                        {t("view_published_version")}
                      </Link>
                    </p>
                  )}
                </div>
              )}
              <table className="table table-hover table-bordered table-striped">
                <tbody>
                  {nodeRevision &&
                    renderViewFields(
                      flattenFormFieldsWithKeys(form),
                      flattenFormValues(nodeRevision.content.values)
                    )}
                </tbody>
              </table>
            </>
          );
        }}
      </Query>
    </Layout>
  );
};

export default RevisionTemplate;
