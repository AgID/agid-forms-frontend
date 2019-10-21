import * as React from "react";

import SEO from "../../components/Seo";
import StaticLayout from "../../components/StaticLayout";

import { Link } from "gatsby";

import { ViewConfig } from "../../generated/graphql/ViewConfig";

import { Query } from "react-apollo";
import LoadableView from "../../components/LoadableView";
import {
  GetNodeRevision,
  GetNodeRevisionVariables
} from "../../generated/graphql/GetNodeRevision";
import { getContextualMenu, getForm } from "../../graphql/gatsby";
import { GET_NODE_REVISION_WITH_PUBLISHED } from "../../graphql/hasura";
import { isLoggedIn } from "../../utils/auth";

import { useTranslation } from "react-i18next";
import { get } from "../../utils/safe_access";

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
  const { t } = useTranslation();
  const [title, setTitle] = React.useState(t("pages.revision_title"));
  const [ctaClicked, setCtaClicked] = React.useState(false);
  const [formId, setFormId] = React.useState<string>();
  return (
    <StaticLayout title={title} contextMenu={getContextualMenu(data, formId)}>
      <SEO title={t("pages.revision_title")} />
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
              <p className="alert alert-warning">
                {t("errors.error_getting_data")}: {JSON.stringify(error)}
              </p>
            );
          }

          const nodeRevision = get(getNodeResult, gnr => gnr.revision[0], null);

          if (!nodeRevision) {
            return (
              <p className="alert alert-warning">
                {t("errors.content_not_found")}
              </p>
            );
          }

          const publishedNode = get(
            getNodeResult,
            gnr => gnr.published[0],
            null
          );

          const isLatestPublishedVersion =
            publishedNode !== null &&
            publishedNode.version === nodeRevision.version;
          {
            /* shows the latest published page with an eventual link to latest version (only if the user is logged in) */
          }
          setFormId(String(nodeRevision.content.schema.id));
          const form = getForm(data, formId);
          if (!form) {
            return (
              <p className="alert alert-warning">
                {t("errors.content_not_found")}
              </p>
            );
          }
          setTitle(nodeRevision.title);

          const links: ReadonlyArray<any> = isLoggedIn()
            ? [
                {
                  to: `/form/${nodeRevision.content.schema.id}/${nodeRevision.id}`,
                  title: t("edit")
                }
              ]
            : [];

          return (
            <>
              {isLoggedIn() && (
                <div>
                  {publishedNode && !isLatestPublishedVersion && (
                    <p className="alert alert-warning mt-3">
                      {t("not_published_version")}
                      <br />
                      <Link to={`/view/${publishedNode.id}`}>
                        {t("view_published_version")}
                      </Link>
                    </p>
                  )}
                </div>
              )}
              <LoadableView
                links={links}
                node={nodeRevision}
                publishedVersion={
                  publishedNode ? publishedNode.version : undefined
                }
                form={form}
                values={
                  (nodeRevision.content.values as unknown) as Record<
                    string,
                    string
                  >
                }
                ctaClicked={ctaClicked}
                setCtaClicked={setCtaClicked}
              />
            </>
          );
        }}
      </Query>
    </StaticLayout>
  );
};

export default RevisionTemplate;
