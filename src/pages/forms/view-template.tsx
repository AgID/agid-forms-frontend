import * as React from "react";
import Layout from "../../components/Layout";
import SEO from "../../components/Seo";

import {
  FormConfig,
  FormConfig_allFormYaml_edges_node_form_fields
} from "../../generated/graphql/FormConfig";

import { Query } from "react-apollo";
import {
  GetNode,
  GetNode_node,
  GetNodeVariables
} from "../../generated/graphql/GetNode";
import { GET_NODE } from "../../graphql/hasura_queries";

const getViewfield = (
  cur: FormConfig_allFormYaml_edges_node_form_fields,
  value: string
) => {
  return (
    <p key={cur.name!}>
      {cur.title}:{" "}
      {value !== "" && value !== undefined && value !== null
        ? value.toString()
        : ""}
    </p>
  );
};

const renderViewFields = (
  customPageFields: ReadonlyArray<FormConfig_allFormYaml_edges_node_form_fields | null> | null,
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
  data: FormConfig;
  formId?: string;
  uuid: string;
}) => {
  const menu = data.allConfigYaml ? data.allConfigYaml.edges[0].node.menu : {};
  return (
    <Layout menu={menu}>
      <SEO title="Home" meta={[]} keywords={[]} />
      <h1>View {uuid}</h1>
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
            const forms = data.allFormYaml
              ? data.allFormYaml.edges.filter(
                  node =>
                    node.node.id === getNodeResult.node[0].content.schema.id
                )
              : null;
            if (!forms || !forms[0] || !forms[0].node) {
              return <p>Form non trovato</p>;
            }
            // tslint:disable-next-line: no-console
            console.log("values", getNodeResult.node[0]);
            const form = forms[0].node;
            if (!form.form_fields) {
              return <p>Form vuoto.</p>;
            }
            return renderViewFields(form.form_fields, getNodeResult.node[0]);
          }
          return <></>;
        }}
      </Query>
    </Layout>
  );
};

export default ViewTemplate;
