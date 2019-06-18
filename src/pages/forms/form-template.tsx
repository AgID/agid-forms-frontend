import * as React from "react";
import Layout from "../../components/Layout";

import * as parser from "expression-eval";
import { Link, navigate } from "gatsby";

import { FormConfig } from "../../generated/graphql/FormConfig";

import {
  UpsertNode,
  UpsertNodeVariables
} from "../../generated/graphql/UpsertNode";

import { Button, FormGroup, Label } from "reactstrap";

import {
  CustomInputComponent,
  FieldT,
  FormField,
  FormValuesT,
  isEmptyField
} from "../../components/FormField";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikActions,
  FormikProps
} from "formik";
import { Mutation, Query } from "react-apollo";
import { GetNode, GetNodeVariables } from "../../generated/graphql/GetNode";
import { GET_NODE, UPSERT_NODE } from "../../graphql/hasura_queries";

import * as memoize from "memoizee";

/**
 * Parse and cache compiled javascript expressions.
 */
const getExpression = (name: keyof FieldT, field: FieldT) =>
  field[name] ? parser.compile(field[name] as string) : null;

const getExpressionMemoized = memoize(getExpression, {
  normalizer: ([name, field]: Parameters<typeof getExpression>) =>
    `${name}_${field.name}`
});

const getFormfield = (field: FieldT, form: FormikProps<FormValuesT>) => {
  const showIfExpression = getExpressionMemoized("show_if", field);
  const valueExpression = getExpressionMemoized("computed_value", field);
  const validationExpression = getExpressionMemoized("valid_if", field);
  const requiredExpression = getExpressionMemoized("required_if", field);

  const isHidden = showIfExpression ? !showIfExpression(form.values) : false;

  // clear field value if is hidden but not empty
  if (isHidden && form.values[field.name!] !== "") {
    form.setFieldValue(field.name!, "");
  }

  const isRequired =
    !isHidden &&
    (requiredExpression ? requiredExpression({ Math, ...form.values }) : false);

  switch (field.widget) {
    case "text":
      return FormField({
        field,
        form,
        validationExpression,
        valueExpression,
        isHidden,
        isRequired
      });
    case "checkbox":
      return (
        <FormGroup
          check={true}
          key={field.name!}
          className="mb-3"
          hidden={isHidden}
        >
          <Field
            name={field.name}
            type="checkbox"
            checked={form.values[field.name!]}
            value={field.name}
          />
          <Label
            htmlFor={field.name!}
            check={true}
            onClick={() => {
              form.setFieldValue(
                field.name!,
                isEmptyField(form.values[field.name!]) ? field.name : ""
              );
            }}
            className="font-weight-semibold"
          >
            {field.title}
          </Label>
          <ErrorMessage
            name={field.name!}
            component="div"
            className="alert alert-warning text-warning"
          />
          {field.description && (
            <small className="mb-0 form-text text-muted">
              {field.description}
            </small>
          )}
        </FormGroup>
      );
    case "select":
      return (
        <FormGroup
          check={true}
          key={field.name!}
          className="mb-3"
          hidden={isHidden}
        >
          <Label
            htmlFor={field.name!}
            check={true}
            className="font-weight-semibold mb-2"
          >
            {field.title}
          </Label>
          <Field
            name={field.name}
            type="select"
            multiple={field.multiple}
            component={CustomInputComponent}
            className="pl-0"
          >
            {field.options!.map(option =>
              option && option.value && option.label ? (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ) : null
            )}
          </Field>
          <ErrorMessage
            name={field.name!}
            component="div"
            className="alert alert-warning text-warning"
          />
          {field.description && (
            <small className="mb-0 form-text text-muted">
              {field.description}
            </small>
          )}
        </FormGroup>
      );
    default:
      return <></>;
  }
};

const renderFormFields = (
  customPageFields: ReadonlyArray<FieldT | null> | null,
  fmk: FormikProps<FormValuesT>
): readonly JSX.Element[] =>
  customPageFields
    ? customPageFields.reduce(
        (prev, cur) => (cur ? [...prev, getFormfield(cur, fmk)] : prev),
        [] as readonly JSX.Element[]
      )
    : [];

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

  const menu = getMenuTree(data);

  // get form schema
  const form = getForm(data, formId);
  if (!form || !form.form_fields) {
    return <p>Form not found or empty.</p>;
  }

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
      <h1 className="mb-4">Form {formId}</h1>

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
              {existingNode && (
                <div className="mb-4">
                  <small>
                    <Link to={`/view/${existingNode.node[0].id}`}>
                      {existingNode.node[0].id}
                    </Link>
                  </small>
                </div>
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
                        const node = {
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
                              title: form.id,
                              type: form.id.replace("-", "_")
                            }
                          }
                        };
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
                      render={(fmk: FormikProps<FormValuesT>) => (
                        <Form>
                          {renderFormFields(form.form_fields, fmk)}
                          <Button
                            type="submit"
                            disabled={
                              fmk.isSubmitting ||
                              Object.keys(fmk.errors).length > 0
                            }
                          >
                            Salva bozza
                          </Button>
                          {Object.keys(fmk.errors).length > 0 &&
                            Object.keys(fmk.touched).length > 0 && (
                              <div className="mt-3 alert alert-warning">
                                <small className="text-warning text-sans-serif">
                                  assicurati di aver corretto tutti gli errori
                                  ed aver compilato tutti i campi obbligatori
                                  prima di salvare il modulo
                                </small>
                                <div className="mt-3">
                                  {Object.keys(fmk.errors).map(k => (
                                    <div key={k}>
                                      <small className="text-warning">
                                        {
                                          form.form_fields!.filter(
                                            field => field!.name === k
                                          )[0]!.title
                                        }
                                        : {fmk.errors[k]}
                                      </small>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
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
