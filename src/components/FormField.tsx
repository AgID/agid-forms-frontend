import * as parser from "expression-eval";
import * as memoize from "memoizee";
import * as React from "react";
import * as Yup from "yup";

import { FormikProps } from "formik";

import { Input } from "reactstrap";

import { CheckboxField } from "./CheckBoxField";
import { DefaultFormField } from "./DefaultFormField";
import { HtmlField } from "./HtmlField";
import { SelectField } from "./SelectField";

import {
  FormConfig_allFormYaml_edges_node,
  FormConfig_allFormYaml_edges_node_form_fields
} from "../generated/graphql/FormConfig";

import { setLocale } from "yup";
import { ItLocale } from "../utils/yup_locale_it";
import { RadioField } from "./RadioField";

setLocale(ItLocale);

export const isEmptyField = (value: any) =>
  value === undefined || value === null || value === "";

export interface FormValuesT {
  [k: string]: any;
}

export type FieldT = FormConfig_allFormYaml_edges_node_form_fields;
export type FormT = FormConfig_allFormYaml_edges_node;

export type FormFieldPropsT = {
  field: FieldT;
  form: FormikProps<FormValuesT>;
  isHidden: boolean;
  isRequired: boolean;
  validationExpression: any;
  valueExpression: any;
};

export const validateField = (
  isRequired: boolean,
  validationExpression: any,
  field: FieldT,
  form: FormikProps<FormValuesT>
) =>
  isRequired || validationExpression
    ? (value: any) =>
        Promise.resolve()
          .then(() => {
            if (isRequired && isEmptyField(value)) {
              // tslint:disable-next-line: no-string-throw
              throw "Campo richiesto";
            }
            return validationExpression
              ? validationExpression({
                  Yup,
                  value,
                  ...form.values
                })
              : true;
          })
          .then(validationResult => {
            // returns custom error message if validation fails
            return validationResult === false
              ? field.error_msg || "validation error"
              : null;
          })
          .catch(e => {
            // prints custom or default error message
            return (
              field.error_msg ||
              (e.errors && e.errors.join ? e.errors.join(", ") : e.toString())
            );
          })
    : () => Promise.resolve(null);

/**
 * Wrap inputs in bootstrap input
 */
export const CustomInputComponent = ({
  field,
  form,
  ...props
}: {
  field: readonly JSX.Element[];
  form: FormikProps<FormValuesT>;
}) => <Input {...field} {...props} />;

/**
 * Parse and cache compiled javascript expressions.
 */
export const getExpression = (name: keyof FieldT, field: FieldT) =>
  field[name] ? parser.compile(field[name] as string) : null;

export const getExpressionMemoized = memoize(getExpression, {
  normalizer: ([name, field]: Parameters<typeof getExpression>) =>
    `${name}_${field.name}`
});

export const Formfield = ({
  field,
  form
}: {
  field: FieldT;
  form: FormikProps<FormValuesT>;
}): JSX.Element => {
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

  const widgetOpts = {
    field,
    form,
    validationExpression,
    valueExpression,
    isHidden,
    isRequired
  };

  switch (field.widget) {
    case "text":
      return DefaultFormField(widgetOpts);
    case "checkbox":
      return CheckboxField(widgetOpts);
    case "radio":
      return RadioField(widgetOpts);
    case "select":
      return SelectField(widgetOpts);
    case "html":
      return HtmlField({ field, form, isHidden, valueExpression });
    default:
      return <></>;
  }
};
