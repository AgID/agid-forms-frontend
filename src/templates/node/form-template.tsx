import * as parser from "expression-eval";
import * as React from "react";

import { Link, navigate } from "gatsby";
import { FormConfig } from "../../generated/graphql/FormConfig";

import { FormErrors } from "../../components/FormErrors";
import { Formfield, getExpressionMemoized } from "../../components/FormField";
import StaticLayout from "../../components/StaticLayout";

import { format } from "date-fns";

import {
  UpsertNode,
  UpsertNodeVariables,
  UpsertNode_insert_node_returning
} from "../../generated/graphql/UpsertNode";

import { getSessionInfo, userHasAnyRole, userHasAuthenticatedRole, logout } from "../../utils/auth";
import { GraphqlClient } from "../../graphql/client";

import { Button } from "reactstrap";

import {
  FieldT,
  flattenFormFieldsWithKeys,
  FormGroupT,
  FormT,
  FormValuesT,
  getDefaultValue
} from "../../utils/forms";

import {
  FieldArray,
  Form,
  Formik,
  FormikActions,
  FormikProps,
  FormikValues
} from "formik";
import { Mutation, Query } from "react-apollo";
import { GetNode, GetNodeVariables } from "../../generated/graphql/GetNode";
import { getContextualMenu, getForm } from "../../graphql/gatsby";
import {
  GET_LATEST_NODE_WITH_PUBLISHED,
  UPSERT_NODE
} from "../../graphql/hasura";

import { Trans, useTranslation } from "react-i18next";
import ApolloErrors from "../../components/ApolloErrors";
import FormGroupTitle from "../../components/FormGroupTitle";
import SEO from "../../components/Seo";
import {
  flattenFormFields,
  getFieldNameParts,
  isGroupField
} from "../../utils/forms";
import { get } from "../../utils/safe_access";

type InitialValuesT = Record<
  string,
  string | ReadonlyArray<string> | ReadonlyArray<object>
>;

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
    {} as InitialValuesT
  );

/**
 *  Convert form values to node structure.
 */
const toNode = (
  values: FormValuesT,
  form: FormT,
  status: string,
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
      status,
      title: titleExpression
        ? titleExpression({ values, formatDate: format, Date, id: form.id })
        : form.id,
      type: form.id.replace(/-/g, "_")
    }
  }
});

const onCompleted = (
  node: UpsertNode_insert_node_returning,
  form: FormT,
) => {
  if (node.status === "published") {
    navigate(`/view/${node.id}?cta`);
  }

  form.bound_to
    ? navigate(`/thanks`)
    : navigate(`/revision/${node.id}/${node.version}`);
}

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

const FormComponent = ({
  form,
  initialValues,
  onSubmit,
  links,
  boundNodeValues
}: {
  form: FormT;
  initialValues: InitialValuesT;
  onSubmit: (
    values: FormikValues,
    formikActions: FormikActions<FormikValues>
  ) => void;
  links: ReadonlyArray<{ to: string; title: string }>;
  boundNodeValues: object | null;
}) => {
  const fields = flattenFormFieldsWithKeys(form);
  return (
    <Formik
      initialValues={initialValues}
      validateOnChange={true}
      onSubmit={onSubmit}
      render={(formik: FormikProps<FormValuesT>) => (
        <Form className="py-lg-2">
          {form.sections!.map(section => {
            if (!section) {
              return null;
            }
            return (
              <div key={`${section.title}`}>
                {section.title && (
                  <h2 className="h3 mb-2 mb-lg-4">{section.title}</h2>
                )}
                {section.description && (
                  <p className="w-paragraph neutral-2-color-b5">
                    {section.description}
                  </p>
                )}
                {section.groups!.map(group => {
                  return (
                    group && (
                      <div className="fieldset mb-3 mb-lg-5" key={group.name!}>
                        {group.title && <FormGroupTitle title={group.title} />}
                        {group.description && (
                          <p className="w-paragraph neutral-2-color-b5">
                            {group.description}
                          </p>
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
                                  boundNodeValues={boundNodeValues}
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
          <div className="text-center">
            {links.map(link => (
              <div className="btn btn-outline-primary mt-4 mx-4" key={link.to}>
                <Link to={link.to} className="text-decoration-none">
                  {link.title}
                </Link>
              </div>
            ))}
            <Button
              color="primary"
              type="submit"
              disabled={
                formik.isSubmitting || Object.keys(formik.errors).length > 0
              }
              className="mt-4 mx-auto"
            >
              {form.initial_status && form.initial_status !== "draft" ? (
                <Trans i18nKey="submit" />
              ) : (
                <Trans i18nKey="save_draft" />
              )}
            </Button>
          </div>
          <FormErrors formik={formik} fields={fields} />
        </Form>
      )}
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

  if (form.roles && form.roles.length > 0) {
    const user = getSessionInfo();
    if (!userHasAnyRole(user, form.visible_to as ReadonlyArray<string>)) {
      navigate("/unauthorized");
      return null;
    }
  }

  const formFields = flattenFormFields(form);

  // get the expression to generate title
  const titleExpression = form.title_pattern
    ? parser.compile(form.title_pattern)
    : null;

  // extract default values form form schema
  const initialValues = getInitialValues(formFields);

  const [title, setTitle] = React.useState(form.name || formId);

  const breadcrumbItems = [
    { label: title!, link: "" }
  ].concat(form.bound_to ? [] : [
    { label: form.action!, link: `/doc/${formId}` }
  ]).reverse();

  return (
    <StaticLayout
      title={title}
      contextMenu={getContextualMenu(data, formId, nodeId)}
      breadcrumbItems={breadcrumbItems}
    >
      <SEO title={title} />
      {/* try to get exiting form values from database */}
      <Query<GetNode, GetNodeVariables>
        query={GET_LATEST_NODE_WITH_PUBLISHED}
        skip={!nodeId}
        variables={{
          id: nodeId
        }}
        onCompleted={node => {
          !form.bound_to && node.latest[0] && setTitle(node.latest[0].title || formId);
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

          if (existingNode && existingNode.latest.length === 0) {
            navigate("/404");
            return null;
          }

          if (!existingNode && form.bound_to) {
            navigate("/404");
            return null;
          }

          const latestNode =
            existingNode && existingNode.latest && existingNode.latest[0]
              ? existingNode.latest[0]
              : null;

          const links = !form.bound_to && latestNode
            ? [
                {
                  to: `/revision/${latestNode.id}/${latestNode.version}`,
                  title: t("view")
                }
              ]
            : [];

          return (
            <>
              <Mutation<UpsertNode, UpsertNodeVariables>
                mutation={UPSERT_NODE}
                refetchQueries={
                  !form.bound_to && nodeId
                    ? [
                        {
                          query: GET_LATEST_NODE_WITH_PUBLISHED,
                          variables: { id: nodeId }
                        }
                      ]
                    : []
                }
                onCompleted={upsertNodeResult => {
                  if (upsertNodeResult.insert_node) {
                    const node = upsertNodeResult.insert_node.returning[0];
                    const user = getSessionInfo();

                    userHasAuthenticatedRole(user)
                    ? logout(GraphqlClient).then(() => onCompleted(node, form))
                    : onCompleted(node, form);
                  }
                }}
              >
                {(
                  upsertNode,
                  { loading: upsertLoading, error: upsertError }
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
                  return (
                    <FormComponent
                      links={links}
                      form={form}
                      initialValues={
                        !form.bound_to && latestNode ? latestNode.content.values : initialValues
                      }
                      boundNodeValues={
                        form.bound_to && latestNode ? {
                          ...latestNode.content.values,
                          'reporting-pa': get(
                            latestNode,
                            n => n.node_group.group_ipa_pa.des_amm,
                            ""
                          )
                        } : null
                      }
                      onSubmit={async (
                        values: FormValuesT,
                        actions: FormikActions<FormValuesT>
                      ) => {
                        actions.setSubmitting(true);
                        const node = toNode(
                          values,
                          form,
                          form.initial_status || "draft",
                          titleExpression
                        );
                        // store form values into database
                        await upsertNode({
                          ...node,
                          variables: {
                            node: !form.bound_to && latestNode
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
                    />
                  );
                }}
              </Mutation>
            </>
          );
        }}
      </Query>
    </StaticLayout>
  );
};

export default FormTemplate;
