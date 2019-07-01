import * as React from "react";
import Layout from "../../components/Layout";
import SEO from "../../components/Seo";

import { Link } from "gatsby";

import {
  ViewConfig,
  ViewConfig_allFormYaml_edges_node_form_fields
} from "../../generated/graphql/ViewConfig";

import { Query } from "react-apollo";
import {
  GetNode,
  GetNode_node,
  GetNodeVariables
} from "../../generated/graphql/GetNode";
import {
  getForm,
  getMenu,
  getSiteConfig
} from "../../graphql/gatsby_fragments";
import { GET_NODE } from "../../graphql/hasura_queries";
import BodyStyles from "../../components/BodyColor";

const getViewfield = (
  cur: ViewConfig_allFormYaml_edges_node_form_fields,
  value: string
) => {
  return (
    <tr key={cur.name!} className="mb-4">
      <th scope="row">{cur.title}</th>
      <td>{value.toString()}</td>
    </tr>
  );
};

const renderViewFields = (
  customPageFields: ReadonlyArray<ViewConfig_allFormYaml_edges_node_form_fields | null> | null,
  node: GetNode_node
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
        query={GET_NODE}
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
          if (getNodeResult && getNodeResult.node[0]) {
            const formId = getNodeResult.node[0].content.schema.id;
            const form = getForm(data, formId);
            if (!form || !form.form_fields) {
              return <p>Form vuoto.</p>;
            }
            setTitle(getNodeResult.node[0].title);
            return (
              <>
                <div className="mb-4">
                  <small>
                    <Link
                      to={`/form/${getNodeResult.node[0].content.schema.id}/${getNodeResult.node[0].id}`}
                    >
                      modifica
                    </Link>
                  </small>
                </div>
                <table className="table table-hover table-bordered table-striped">
                  <tbody>
                    {renderViewFields(form.form_fields, getNodeResult.node[0])}
                  </tbody>
                </table>
              </>
            );
          }
          return <></>;
        }}
      </Query>
    </Layout>
  );
};

export default ViewTemplate;
