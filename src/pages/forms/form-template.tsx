import * as parser from "expression-eval";
import * as React from "react";

import { Link } from "gatsby";
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

import {
  FieldT,
  FormGroupT,
  FormT,
  FormValuesT,
  getDefaultValue
} from "../../utils/forms";

import { FieldArray, Form, Formik, FormikActions, FormikProps } from "formik";
import { Mutation, Query } from "react-apollo";
import BodyStyles from "../../components/BodyStyles";
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

import { Trans, useTranslation } from "react-i18next";
import ApolloErrors from "../../components/ApolloErrors";
import {
  flattenFormFields,
  getFieldNameParts,
  isGroupField
} from "../../utils/forms";

const getInitialValues = (fields: ReadonlyArray<FieldT | null>) =>
  fields.reduce(
    (prevValues, field) => {
      if (!field || !field.name) {
        return prevValues;
      }
      if (isGroupField(field.name)) {
        // set up nested object structure for default values of FieldArrays
        // (alias: repeatable fields)
        const [groupName, indexStr, fieldName] = getFieldNameParts(field.name);
        const index = parseInt(indexStr, 10);
        return {
          ...prevValues,
          [groupName]: [
            {
              ...(prevValues[groupName] &&
              typeof prevValues[groupName][index] === "object"
                ? (prevValues[groupName][index] as object)
                : {}),
              [fieldName]: getDefaultValue(field)
            }
          ]
        };
      }
      return { ...prevValues, [field.name]: getDefaultValue(field) };
    },
    {} as Record<string, string | ReadonlyArray<string> | ReadonlyArray<object>>
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
        ? titleExpression({ ...values, formatDate: format, Date, id: form.id })
        : form.id,
      type: form.id.replace("-", "_")
    }
  }
});

const FormFieldArray = ({
  group,
  formik
}: {
  group: FormGroupT;
  formik: FormikProps<FormValuesT>;
}) => {
  if (!group.name || !group.fields) {
    return null;
  }
  const groupFields = group.fields;
  return (
    <FieldArray
      key={group.name}
      name={group.name}
      render={arrayHelpers => {
        const existingValues = formik.values[group.name!];
        if (!existingValues) {
          return null;
        }
        const defaultValues = groupFields.reduce(
          (prev, groupField) => ({
            ...prev,
            ...(groupField && groupField.name
              ? { [groupField.name]: getDefaultValue(groupField) }
              : {})
          }),
          {} as Record<string, string | ReadonlyArray<string>>
        );
        const fieldTemplates = groupFields.reduce(
          (prev, curField) =>
            curField ? { ...prev, [curField.name!]: curField } : prev,
          {} as Record<string, FieldT>
        );
        const existingFields = existingValues.map(
          (o: Record<string, string>, index: number) =>
            Object.keys(o).map(fieldName => {
              return (
                <Formfield
                  key={`${group.name}.${index}.${fieldName}`}
                  field={{
                    ...fieldTemplates[fieldName],
                    name: `${group.name}.${index}.${fieldName}`
                  }}
                  form={formik}
                />
              );
            })
        );
        const button = (
          <Button
            type="button"
            onClick={() => {
              arrayHelpers.push(defaultValues);
            }}
          >
            <Trans i18nKey="add_more" />
          </Button>
        );
        return (
          <>
            {existingFields}
            {button}
          </>
        );
      }}
    />
  );
};

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
  const { t } = useTranslation();

  // clear memoization cache on unmount
  React.useEffect(() => getExpressionMemoized.clear);

  // get form schema
  const form = getForm(data, formId);
  if (!form) {
    return (
      <p className="alert alert-warning">{t("errors.content_not_found")}</p>
    );
  }

  const formFields = flattenFormFields(form);

  // get the expression to generate title
  const titleExpression = form.title_pattern
    ? parser.compile(form.title_pattern)
    : null;

  // extract default values form form schema
  const initialValues = getInitialValues(formFields);

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
            return <p>{t("loading_data")}</p>;
          }

          if (getNodeError) {
            return (
              <p className="alert alert-warning">
                {t("errors.error_getting_data")}: {JSON.stringify(getNodeError)}
              </p>
            );
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
                      {t("view")}
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
                    return (
                      <p>
                        <Trans i18nKey="sending_data" />
                      </p>
                    );
                  }
                  if (upsertError) {
                    return (
                      <p className="text-danger">
                        <Trans i18nKey="errors.error_sending_data" />
                        <br />
                        <ApolloErrors errors={upsertError} />
                      </p>
                    );
                  }
                  if (upsertNodeResult && upsertNodeResult.insert_node) {
                    // force page reload to avoid redirect loop
                    // tslint:disable-next-line: no-object-mutation
                    window.location.href = `/form/${formId}/${upsertNodeResult.insert_node.returning[0].id}`;
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
                          {form.sections!.map(section => {
                            if (!section) {
                              return null;
                            }
                            return (
                              <div key={`${section.title}`}>
                                {section.title && <h2>{section.title}</h2>}
                                {section.description && (
                                  <p>{section.description}</p>
                                )}
                                {section.groups!.map(group => {
                                  return (
                                    group && (
                                      <div
                                        className="fieldset"
                                        key={group.name!}
                                      >
                                        {group.title && <h3>{group.title}</h3>}
                                        {group.description && (
                                          <p>{group.description}</p>
                                        )}
                                        {group.repeatable
                                          ? FormFieldArray({
                                              group,
                                              formik
                                            })
                                          : group.fields!.map(field =>
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
                                      </div>
                                    )
                                  );
                                })}
                              </div>
                            );
                          })}
                          <Button
                            type="submit"
                            disabled={
                              formik.isSubmitting ||
                              Object.keys(formik.errors).length > 0
                            }
                            className="mt-4"
                          >
                            <Trans i18nKey="save_draft" />
                          </Button>
                          <FormErrors formik={formik} />
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
