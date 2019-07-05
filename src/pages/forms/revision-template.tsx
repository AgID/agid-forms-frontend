import * as React from "react";
import Layout from "../../components/Layout";
import SEO from "../../components/Seo";

import { Link } from "gatsby";

import { ViewConfig } from "../../generated/graphql/ViewConfig";

import { Query } from "react-apollo";
import BodyStyles from "../../components/BodyColor";
import {
  GetNodeRevision,
  GetNodeRevisionVariables
} from "../../generated/graphql/GetNodeRevision";
import {
  getForm,
  getFormFields,
  getMenu,
  getSiteConfig
} from "../../graphql/gatsby_fragments";
import { GET_NODE_REVISION_WITH_PUBLISHED } from "../../graphql/hasura_queries";
import { isLoggedIn } from "../../utils/auth";

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
  const [title, setTitle] = React.useState("");
  return (
    <Layout menu={getMenu(data)} siteConfig={getSiteConfig(data)} title={title}>
      <BodyStyles backgroundColor="#e7e6ff" />
      <SEO title="Home" meta={[]} keywords={[]} />
      <Query<GetNodeRevision, GetNodeRevisionVariables>
        query={GET_NODE_REVISION_WITH_PUBLISHED}
        variables={{
          id: uuid,
          version
        }}
      >
        {({ loading, error, data: getNodeResult }) => {
          if (loading) {
            return <p>Ottengo i dati...</p>;
          }
          if (error) {
            return (
              <p>Errore nel ricevere i dati: {JSON.stringify(error)}...</p>
            );
          }
          const nodeRevision =
            getNodeResult && getNodeResult.revision && getNodeResult.revision[0]
              ? getNodeResult.revision[0]
              : null;
          if (!nodeRevision) {
            return <p>La pagina non esiste.</p>;
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
            return <p>Form vuoto.</p>;
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
                      modifica
                    </Link>
                  </small>
                  {publishedNode && !isLatestPublishedVersion && (
                    <p className="alert alert-warning">
                      Il nodo pubblicato non corrisponde alla sua ultima
                      revisione.
                      <br />
                      <Link to={`/view/${publishedNode.id}`}>
                        visualizza il nodo pubblicato
                      </Link>
                    </p>
                  )}
                </div>
              )}
              <table className="table table-hover table-bordered table-striped">
                <tbody>
                  {nodeRevision &&
                    renderViewFields(getFormFields(form), nodeRevision)}
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
