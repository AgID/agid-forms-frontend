import { StrMap } from "fp-ts/lib/StrMap";
import { graphql } from "gatsby";
import * as React from "react";
import Layout from "../components/Layout";
import SEO from "../components/Seo";

import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikActions,
  FormikProps
} from "formik";

type MenuConfigQueryT = {
  data: any;
};

interface MyFormValues {
  [k: string]: any;
}

import * as jsonapi from "../schemas/jsonapi.json";

const pageFields =
  jsonapi.definitions["node--page"].properties.data.properties.attributes
    .properties;

const customPageFields = new StrMap(pageFields).filterWithKey(
  (k, _) => k.indexOf("field_") === 0
);

const formFields = customPageFields.reduceWithKey(
  [] as readonly JSX.Element[],
  (k, prev, cur) =>
    prev.concat([
      // tslint:disable-next-line: jsx-wrap-multiline
      <Field
        name={k}
        key={k}
        render={({ field, form }: FieldProps<MyFormValues>) => {
          switch (cur.type) {
            case "string":
              return (
                <div>
                  <label>{(cur as any).title}</label>
                  <input type="text" {...field} placeholder="" />
                  {form.touched[k] && form.errors[k] && form.errors[k]}
                </div>
              );
            case "boolean":
              return (
                <div>
                  <label>{(cur as any).title}</label>
                  <input type="checkbox" {...field} placeholder="" />
                  {form.touched[k] && form.errors[k] && form.errors[k]}
                </div>
              );
            default:
              return "";
          }
        }}
      />
    ])
);

const initialValues = customPageFields.map(v => (v as any).default || "").value;

const IndexPage = ({ data }: MenuConfigQueryT) => {
  return (
    <Layout menu={data.allConfigYaml.edges[0].node.menu}>
      <SEO title="Home" meta={[]} keywords={[]} />
      <h1>Form</h1>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }} />
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
            {formFields}
            <button type="submit" disabled={fmk.isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      />
    </Layout>
  );
};

export const query = graphql`
  query FormConfigQuery {
    allConfigYaml {
      edges {
        node {
          menu {
            name
            slug
            subtree {
              name
              slug
              subtitle
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
