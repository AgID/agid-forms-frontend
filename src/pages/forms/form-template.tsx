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
import BodyStyles from "../../components/BodyColor";
import { GetNode, GetNodeVariables } from "../../generated/graphql/GetNode";
import {
  getForm,
  getMenu,
  getSiteConfig
} from "../../graphql/gatsby_fragments";
import {
  GET_LATEST_NODE_WITH_PUBLISHED,
  UPSERT_NODE
} from "../../graphql/hasura_queries";

const getInitialValues = (fields: ReadonlyArray<FieldT | null>) =>
  fields.reduce(
    (prev, cur) =>
      cur
        ? {
            ...prev,
            [cur.name!]: cur.default_multiple_selection
              ? (cur.default_multiple_selection as ReadonlyArray<string>)
              : cur.default_checked
              ? cur.name!
              : cur.default !== undefined && cur.default !== null
              ? cur.default
              : ""
          }
        : prev,
    {} as Record<string, string | ReadonlyArray<string>>
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

  const [title, setTitle] = React.useState(formId);

  return (
    <Layout menu={getMenu(data)} siteConfig={getSiteConfig(data)} title={title}>
      <BodyStyles backgroundColor="#e7e6ff" />
      {/* try to get exiting form values from database */}
      <Query<GetNode, GetNodeVariables>
        query={GET_LATEST_NODE_WITH_PUBLISHED}
        skip={!nodeId}
        variables={{
          id: nodeId
        }}
        onCompleted={node => {
          setTitle(node.latest[0].title || formId);
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
          const latestNode =
            existingNode && existingNode.latest && existingNode.latest[0]
              ? existingNode.latest[0]
              : null;
          return (
            <>
              {latestNode ? (
                <div className="mb-4">
                  <small>
                    <Link
                      to={`/revision/${latestNode.id}/${latestNode.version}`}
                    >
                      visualizza
                    </Link>
                  </small>
                </div>
              ) : (
                <></>
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
                    navigate(
                      `/form/${formId}/${upsertNodeResult.insert_node.returning[0].id}`
                    );
                  }
                  return (
                    <Formik
                      initialValues={
                        latestNode ? latestNode.content.values : initialValues
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
                            node: latestNode
                              ? {
                                  ...node.variables.node,
                                  id: latestNode.id,
                                  version: latestNode.version + 1
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
