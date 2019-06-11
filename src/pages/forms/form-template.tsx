import * as React from "react";
import Layout from "../../components/Layout";
import SEO from "../../components/Seo";

import {
  FormConfig,
  FormConfig_allFormYaml_edges_node_form_fields
} from "../../generated/graphql/FormConfig";

import { Button, FormGroup, Input, Label } from "reactstrap";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikActions,
  FormikProps
} from "formik";

const FIELD_DEFAULTS: Record<string, any> = {
  text: "",
  checkbox: false
};

interface MyFormValues {
  [k: string]: any;
}

const CustomTextInputComponent = ({
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
  switch (cur.type) {
    case "text":
      return (
        <FormGroup check={true} key={cur.name!}>
          <Label htmlFor={cur.name!} check={true}>
            {cur.title}
          </Label>
          {cur.description && <p className="mb-0">{cur.description}</p>}
          <Field
            name={cur.name}
            type="text"
            component={CustomTextInputComponent}
          />
          <ErrorMessage name={cur.name!} component="p" />
        </FormGroup>
      );
    case "checkbox":
      return (
        <FormGroup check={true} key={cur.name!}>
          {cur.description && <p className="mb-0">{cur.description}</p>}
          <Field
            name={cur.name}
            type="checkbox"
            checked={fmk.values[cur.name!]}
          />
          <Label
            htmlFor={cur.name!}
            check={true}
            onClick={() => {
              // tslint:disable-next-line: no-console
              console.log(cur.name, fmk.values);
              fmk.setFieldValue(cur.name!, !fmk.values[cur.name!]);
            }}
          >
            {cur.title}
          </Label>
          <ErrorMessage name={cur.name!} component="p" />
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
  formId
}: {
  data: FormConfig;
  formId?: string;
}) => {
  const menu = data.allConfigYaml ? data.allConfigYaml.edges[0].node.menu : {};
  const forms = data.allFormYaml
    ? data.allFormYaml.edges.filter(node => node.node.id === formId)
    : null;
  if (!forms || !forms[0] || !forms[0].node) {
    return "";
  }
  const form = forms[0].node;
  if (!form.form_fields) {
    return "";
  }
  const initialValues = form.form_fields.reduce(
    (prev, cur) =>
      cur
        ? {
            ...prev,
            [cur.name!]:
              cur.default !== undefined && cur.default !== null
                ? cur.default
                : FIELD_DEFAULTS[cur.type!]
          }
        : prev,
    {} as Record<string, string>
  );
  // tslint:disable-next-line: no-console
  console.log("initial", initialValues);
  return (
    <Layout menu={menu}>
      <SEO title="Home" meta={[]} keywords={[]} />
      <h1>Form {formId}</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={(
          values: MyFormValues,
          actions: FormikActions<MyFormValues>
        ) => {
          // tslint:disable-next-line: no-console
          console.log({ values, actions });
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }}
        render={(fmk: FormikProps<MyFormValues>) => (
          <Form>
            {renderFormFields(form.form_fields, fmk)}
            <Button type="submit" disabled={fmk.isSubmitting}>
              Invia dati
            </Button>
          </Form>
        )}
      />
    </Layout>
  );
};

export default FormTemplate;
