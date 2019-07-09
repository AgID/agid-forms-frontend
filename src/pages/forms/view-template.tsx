import * as React from "react";
import Layout from "../../components/Layout";
import SEO from "../../components/Seo";

import { Link } from "gatsby";

import {
  ViewConfig,
  ViewConfig_allFormYaml_edges_node_sections_groups_fields
} from "../../generated/graphql/ViewConfig";

import { Query } from "react-apollo";
import BodyStyles from "../../components/BodyColor";
import {
  GetNode,
  GetNode_latest_published,
  GetNodeVariables
} from "../../generated/graphql/GetNode";
import {
  getForm,
  getFormFields,
  getMenu,
  getSiteConfig
} from "../../graphql/gatsby_fragments";
import { GET_LATEST_NODE_WITH_PUBLISHED } from "../../graphql/hasura_queries";
import { isLoggedIn } from "../../utils/auth";

const getViewfield = (
  cur: ViewConfig_allFormYaml_edges_node_sections_groups_fields,
  value: string
) => {
  return (
    <tr key={cur.name!} className="mb-4">
      <th scope="row">{cur.title}</th>
      <td>{value.toString()}</td>
    </tr>
  );
};

export const renderViewFields = (
  customPageFields: ReadonlyArray<ViewConfig_allFormYaml_edges_node_sections_groups_fields | null> | null,
  node: GetNode_latest_published
): readonly JSX.Element[] =>
  customPageFields
    ? customPageFields.reduce(
        (prev, cur) =>
          cur
            ? [...prev, getViewfield(cur, node.content.values[cur.name!])]
            : prev,
        [] as readonly JSX.Element[]
      )
    : [];

const ViewTemplate = ({
  data,
  uuid
}: {
  data: ViewConfig;
  formId?: string;
  uuid: string;
}) => {
  const [title, setTitle] = React.useState("");
  return (
    <Layout menu={getMenu(data)} siteConfig={getSiteConfig(data)} title={title}>
      <BodyStyles backgroundColor="#e7e6ff" />
      <SEO title="Home" meta={[]} keywords={[]} />
      <Query<GetNode, GetNodeVariables>
        query={GET_LATEST_NODE_WITH_PUBLISHED}
        variables={{
          id: uuid
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
          const latestNode =
            getNodeResult && getNodeResult.latest && getNodeResult.latest[0]
              ? getNodeResult.latest[0]
              : null;
          if (!latestNode) {
            return <p>La pagina non esiste.</p>;
          }
          const publishedNode =
            latestNode && latestNode.published && latestNode.published[0]
              ? latestNode.published[0]
              : null;
          if (!publishedNode) {
            return (
              <p>
                Non è stato trovato un contenuto pubblicato corrispondente alla
                url.
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
            return <p>Form vuoto.</p>;
          }
          setTitle(publishedNode.title);
          return (
            <>
              {isLoggedIn() && (
                <div className="mb-4">
                  <small>
                    <Link
                      to={`/form/${latestNode.content.schema.id}/${latestNode.id}`}
                    >
                      modifica
                    </Link>
                  </small>
                  {!isLatestPublishedVersion && (
                    <p className="alert alert-warning">
                      Il nodo pubblicato non corrisponde alla sua ultima
                      revisione.
                      <br />
                      <Link
                        to={`/revision/${latestNode.id}/${latestNode.version}`}
                      >
                        visualizza l'ultima versione
                      </Link>
                    </p>
                  )}
                </div>
              )}
              <table className="table table-hover table-bordered table-striped">
                <tbody>
                  {publishedNode &&
                    renderViewFields(getFormFields(form), publishedNode)}
                </tbody>
              </table>
            </>
          );
        }}
      </Query>
    </Layout>
  );
};

export default ViewTemplate;
