import * as React from "react";
import Layout from "../../components/Layout";
import SEO from "../../components/Seo";

import * as parser from "expression-eval";
import { Link, navigate } from "gatsby";
import * as Yup from "yup";

import {
  FormConfig,
  FormConfig_allFormYaml_edges_node_form_fields
} from "../../generated/graphql/FormConfig";

import {
  UpsertNode,
  UpsertNodeVariables
} from "../../generated/graphql/UpsertNode";

import { Button, FormGroup, Input, Label } from "reactstrap";

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

const getExpression = (
  name: keyof FormConfig_allFormYaml_edges_node_form_fields,
  field: FormConfig_allFormYaml_edges_node_form_fields
) => (field[name] ? parser.compile(field[name] as string) : null);

const getExpressionMemoized = memoize(getExpression, {
  normalizer: ([name, field]: Parameters<typeof getExpression>) =>
    `${name}_${field.name}`
});

const FIELD_DEFAULTS: Record<string, any> = {
  text: "",
  checkbox: false
};

interface MyFormValues {
  [k: string]: any;
}

const CustomInputComponent = ({
  field,
  form,
  ...props
}: {
  field: any;
  form: any;
}) => <Input {...field} {...props} />;

const getFormfield = (
  cur: FormConfig_allFormYaml_edges_node_form_fields,
  fmk: FormikProps<MyFormValues>
) => {
  const showIfExpression = getExpressionMemoized("show_if", cur);
  const valueExpression = getExpressionMemoized("computed_value", cur);
  const validationExpression = getExpressionMemoized("valid_if", cur);
  const requiredExpression = getExpressionMemoized("required_if", cur);

  const isHidden = showIfExpression ? !showIfExpression(fmk.values) : false;
  const isRequired = requiredExpression
    ? requiredExpression({ Math, ...fmk.values })
    : false;

  switch (cur.widget) {
    case "text":
      return (
        <FormGroup
          check={true}
          key={cur.name!}
          className="mb-3"
          hidden={isHidden}
        >
          <Label
            htmlFor={cur.name!}
            check={true}
            className="font-weight-semibold"
          >
            {cur.title} {isRequired && "(richiesto)"}
          </Label>
          <Field
            name={cur.name}
            type="text"
            required={isRequired}
            component={CustomInputComponent}
            className="pl-0"
            validate={
              isRequired || validationExpression
                ? (value: any) =>
                    Promise.resolve()
                      .then(() => {
                        if (
                          isRequired &&
                          (value === undefined ||
                            value === null ||
                            value === "")
                        ) {
                          // tslint:disable-next-line: no-string-throw
                          throw "Campo richiesto";
                        }
                        return validationExpression
                          ? validationExpression({
                              Yup,
                              RegExp,
                              value,
                              ...fmk.values
                            })
                          : true;
                      })
                      .then(validationResult =>
                        validationResult === false ? cur.error_msg : null
                      )
                      .catch(
                        e =>
                          cur.error_msg ||
                          (e.errors && e.errors.join
                            ? e.errors.join(", ")
                            : e.toString())
                      )
                : () => Promise.resolve(null)
            }
            value={
              valueExpression
                ? // tslint:disable-next-line: restrict-plus-operands
                  valueExpression({ Math, ...fmk.values }) + ""
                : fmk.values[cur.name!]
            }
          />
          <ErrorMessage
            name={cur.name!}
            component="div"
            className="alert alert-warning text-warning"
          />
          {cur.description && (
            <small className="mb-0 form-text text-muted">
              {cur.description}
            </small>
          )}
        </FormGroup>
      );
    case "checkbox":
      return (
        <FormGroup
          check={true}
          key={cur.name!}
          className="mb-3"
          hidden={isHidden}
        >
          <Field
            name={cur.name}
            type="checkbox"
            checked={fmk.values[cur.name!]}
          />
          <Label
            htmlFor={cur.name!}
            check={true}
            onClick={() => {
              fmk.setFieldValue(cur.name!, !fmk.values[cur.name!]);
            }}
            className="font-weight-semibold"
          >
            {cur.title}
          </Label>
          <ErrorMessage
            name={cur.name!}
            component="div"
            className="alert alert-warning text-warning"
          />
          {cur.description && (
            <small className="mb-0 form-text text-muted">
              {cur.description}
            </small>
          )}
        </FormGroup>
      );
    case "select":
      return (
        <FormGroup
          check={true}
          key={cur.name!}
          className="mb-3"
          hidden={isHidden}
        >
          <Label
            htmlFor={cur.name!}
            check={true}
            className="font-weight-semibold mb-2"
          >
            {cur.title}
          </Label>
          <Field
            name={cur.name}
            type="select"
            multiple={cur.multiple}
            component={CustomInputComponent}
            className="pl-0"
          >
            {cur.options!.map(option =>
              option && option.value && option.label ? (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ) : null
            )}
          </Field>
          <ErrorMessage
            name={cur.name!}
            component="div"
            className="alert alert-warning text-warning"
          />
          {cur.description && (
            <small className="mb-0 form-text text-muted">
              {cur.description}
            </small>
          )}
        </FormGroup>
      );
    default:
      return <></>;
  }
};

const renderFormFields = (
  customPageFields: ReadonlyArray<FormConfig_allFormYaml_edges_node_form_fields | null> | null,
  fmk: FormikProps<MyFormValues>
): readonly JSX.Element[] =>
  customPageFields
    ? customPageFields.reduce(
        (prev, cur) => (cur ? [...prev, getFormfield(cur, fmk)] : prev),
        [] as readonly JSX.Element[]
      )
    : [];

const FormTemplate = ({
  data,
  formId,
  nodeId
}: {
  data: FormConfig;
  formId?: string;
  nodeId?: string;
}) => {
  const menu = data.allConfigYaml ? data.allConfigYaml.edges[0].node.menu : {};
  const forms = data.allFormYaml
    ? data.allFormYaml.edges.filter(node => node.node.id === formId)
    : null;
  if (!forms || !forms[0] || !forms[0].node) {
    return <p>No form found.</p>;
  }
  const form = forms[0].node;
  if (!form.form_fields) {
    return <p>No fields found.</p>;
  }
  const initialValues = form.form_fields.reduce(
    (prev, cur) =>
      cur
        ? {
            ...prev,
            [cur.name!]:
              cur.default !== undefined && cur.default !== null
                ? cur.default
                : FIELD_DEFAULTS[cur.widget!]
          }
        : prev,
    {} as Record<string, string>
  );

  const [redirectToId, setRedirectToId] = React.useState();

  if (redirectToId) {
    navigate(`/view/${redirectToId}`);
    return <></>;
  }

  return (
    <Layout menu={menu}>
      <SEO title="Home" meta={[]} keywords={[]} />
      <h1 className="mb-4">Form {formId}</h1>

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
                    return <></>;
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
                        values: MyFormValues,
                        actions: FormikActions<MyFormValues>
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
                      render={(fmk: FormikProps<MyFormValues>) => (
                        <Form>
                          {renderFormFields(form.form_fields, fmk)}
                          <Button
                            type="submit"
                            disabled={fmk.isSubmitting || !fmk.isValid}
                          >
                            Salva bozza
                          </Button>
                          {!fmk.isValid && Object.keys(fmk.touched).length > 0 && (
                            <div className="mt-3 alert alert-warning">
                              <small className="text-warning text-sans-serif">
                                assicurati di aver corretto tutti gli errori ed
                                aver compilato tutti i campi obbligatori prima
                                di salvare il modulo
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
