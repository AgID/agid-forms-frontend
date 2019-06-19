import * as parser from "expression-eval";
import * as React from "react";

import { Link, navigate } from "gatsby";
import { FormConfig } from "../../generated/graphql/FormConfig";

import { FormErrors } from "../../components/FormErrors";
import { Formfield, getExpressionMemoized } from "../../components/FormField";
import Layout from "../../components/Layout";

import { format } from "date-fns";

import {
  UpsertNode,
  UpsertNodeVariables
} from "../../generated/graphql/UpsertNode";

import { Button } from "reactstrap";

import { FieldT, FormT, FormValuesT } from "../../components/FormField";

import { Form, Formik, FormikActions, FormikProps } from "formik";
import { Mutation, Query } from "react-apollo";
import { GetNode, GetNodeVariables } from "../../generated/graphql/GetNode";
import { GET_NODE, UPSERT_NODE } from "../../graphql/hasura_queries";

import { useTranslation } from "react-i18next";

const getMenuTree = (data: FormConfig) =>
  data.allConfigYaml ? data.allConfigYaml.edges[0].node.menu : {};

const getForm = (data: FormConfig, formId?: string) => {
  if (!formId) {
    return null;
  }
  const forms = data.allFormYaml
    ? data.allFormYaml.edges.filter(node => node.node.id === formId)
    : null;
  if (!forms || !forms[0] || !forms[0].node) {
    return null;
  }
  const form = forms[0].node;
  if (!form.form_fields) {
    return null;
  }
  return form;
};

const getInitialValues = (fields: ReadonlyArray<FieldT | null>) =>
  fields.reduce(
    (prev, cur) =>
      cur
        ? {
            ...prev,
            [cur.name!]: cur.default_checked
              ? cur.name!
              : cur.default !== undefined && cur.default !== null
              ? cur.default
              : ""
          }
        : prev,
    {} as Record<string, string>
  );

/**
 *  Convert form values to node structure.
 */
const toNode = (
  values: FormValuesT,
  form: FormT,
  titleExpression?: ReturnType<typeof parser.compile> | null
) => ({
  variables: {
    node: {
      content: {
        values,
        schema: {
          id: form.id,
          version: form.version
        }
      },
      language: form.language,
      title: titleExpression
        ? titleExpression({ ...values, formatDate: format, Date })
        : form.id,
      type: form.id.replace("-", "_")
    }
  }
});

/**
 * Form page component
 */
const FormTemplate = ({
  data,
  formId,
  nodeId
}: {
  data: FormConfig;
  formId?: string;
  nodeId?: string;
}) => {
  // clear memoization cache on unmount
  React.useEffect(() => getExpressionMemoized.clear);

  const { t } = useTranslation();

  const menu = getMenuTree(data);

  // get form schema
  const form = getForm(data, formId);
  if (!form || !form.form_fields) {
    return <p>Form not found or empty.</p>;
  }

  // get the expression to generate title
  const titleExpression = form.title_pattern
    ? parser.compile(form.title_pattern)
    : null;

  // extract default values form form schema
  const initialValues = getInitialValues(form.form_fields);

  // redirect user to results page on submit
  const [redirectToId, setRedirectToId] = React.useState();
  if (redirectToId) {
    navigate(`/view/${redirectToId}`);
    return <p>redirecting to results...</p>;
  }

  return (
    <Layout menu={menu}>
      {/* try to get exiting form values from database */}
      <Query<GetNode, GetNodeVariables>
        query={GET_NODE}
        skip={!nodeId}
        variables={{
          id: nodeId
        }}
      >
        {({
          loading: getNodeLoading,
          error: getNodeError,
          data: existingNode
        }) => {
          if (getNodeLoading) {
            return <p>Ottengo i dati...</p>;
          }
          if (getNodeError) {
            return <p>Errore nella query: {JSON.stringify(getNodeError)}</p>;
          }
          return (
            <>
              {existingNode ? (
                <div className="mb-4">
                  <h1>{existingNode.node[0].title}</h1>
                  <small>
                    <Link to={`/view/${existingNode.node[0].id}`}>
                      visualizza
                    </Link>
                  </small>
                </div>
              ) : (
                <h1>{formId}</h1>
              )}
              <Mutation<UpsertNode, UpsertNodeVariables> mutation={UPSERT_NODE}>
                {(
                  upsertNode,
                  {
                    loading: upsertLoading,
                    error: upsertError,
                    data: upsertNodeResult
                  }
                ) => {
                  if (upsertLoading) {
                    return <p>Invio i dati...</p>;
                  }
                  if (upsertError) {
                    return (
                      <p>
                        Errore nell'invio dei dati:{" "}
                        {JSON.stringify(upsertError)}
                        ...
                      </p>
                    );
                  }
                  if (upsertNodeResult && upsertNodeResult.insert_node) {
                    setRedirectToId(
                      upsertNodeResult.insert_node.returning[0].id
                    );
                    return <p>stored data...</p>;
                  }
                  return (
                    <Formik
                      initialValues={
                        existingNode
                          ? existingNode.node[0].content.values
                          : initialValues
                      }
                      validateOnChange={true}
                      onSubmit={async (
                        values: FormValuesT,
                        actions: FormikActions<FormValuesT>
                      ) => {
                        const node = toNode(values, form, titleExpression);
                        // store form values into database
                        await upsertNode({
                          ...node,
                          variables: {
                            node: existingNode
                              ? {
                                  ...node.variables.node,
                                  id: existingNode.node[0].id
                                }
                              : node.variables.node
                          }
                        });
                        return actions.setSubmitting(false);
                      }}
                      render={(formik: FormikProps<FormValuesT>) => (
                        <Form>
                          {(form.form_fields || []).map(field =>
                            field && field.name ? (
                              <Formfield
                                key={field.name}
                                field={field}
                                form={formik}
                              />
                            ) : (
                              <></>
                            )
                          )}
                          <Button
                            type="submit"
                            disabled={
                              formik.isSubmitting ||
                              Object.keys(formik.errors).length > 0
                            }
                          >
                            Salva bozza
                          </Button>
                          <FormErrors formik={formik} form={form} />
                        </Form>
                      )}
                    />
                  );
                }}
              </Mutation>
            </>
          );
        }}
      </Query>
    </Layout>
  );
};

export default FormTemplate;
