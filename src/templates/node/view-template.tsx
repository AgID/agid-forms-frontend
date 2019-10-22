import * as React from "react";

import SEO from "../../components/Seo";
import StaticLayout from "../../components/StaticLayout";

import { Link } from "gatsby";

import { ViewConfig } from "../../generated/graphql/ViewConfig";

import { navigate } from "@reach/router";
import { Query } from "react-apollo";
import { useTranslation } from "react-i18next";
import LoadableView from "../../components/LoadableView";
import { GetNode, GetNodeVariables } from "../../generated/graphql/GetNode";
import { getContextualMenu, getForm } from "../../graphql/gatsby";
import { GET_LATEST_NODE_WITH_PUBLISHED } from "../../graphql/hasura";
import { isLoggedIn } from "../../utils/auth";
import { get } from "../../utils/safe_access";

const ViewTemplate = ({ data, uuid }: { data: ViewConfig; uuid: string }) => {
  const { t } = useTranslation();
  const [title, setTitle] = React.useState(t("pages.view_title"));
  const [ctaClicked, setCtaClicked] = React.useState(false);
  const [formId, setFormId] = React.useState<string>();
  return (
    <StaticLayout title={title} contextMenu={getContextualMenu(data, formId)}>
      <SEO title={t("pages.view_title")} />
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
            navigate("/404");
            return null;
            // return (
            //   <p className="alert alert-warning">
            //     {t("errors.error_getting_data")}: {JSON.stringify(error)}
            //   </p>
            // );
          }

          // latestNode may be null in case the user is anonymous
          // and the latest revision is not published
          const latestNode =
            getNodeResult && getNodeResult.latest && getNodeResult.latest[0]
              ? getNodeResult.latest[0]
              : null;

          const publishedNode = get(
            getNodeResult,
            gnr => gnr.published[0],
            null as any
          );

          if (!publishedNode) {
            return (
              <p className="alert alert-warning">
                {t("errors.content_not_found")}
              </p>
            );
          }

          const isLatestPublishedVersion =
            latestNode !== null &&
            publishedNode &&
            publishedNode.version === latestNode.version;
          {
            /*
             * only if the user is logged in:
             * shows the latest published page with
             * an eventual link to the latest version
             */
          }
          setFormId(publishedNode.content.schema.id);
          const form = getForm(data, formId);
          if (!form) {
            return (
              <p className="alert alert-warning">
                {t("errors.content_not_found")}
              </p>
            );
          }
          setTitle(publishedNode.title);

          const links: ReadonlyArray<any> =
            isLoggedIn() && latestNode
              ? [
                  {
                    to: `/form/${latestNode.content.schema.id}/${latestNode.id}`,
                    title: t("edit")
                  }
                ]
              : [];

          return (
            <>
              {isLoggedIn() && latestNode && (
                <div>
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
              <LoadableView
                links={links}
                node={publishedNode}
                publishedVersion={publishedNode.version}
                form={form}
                values={publishedNode.content.values}
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

export default ViewTemplate;
