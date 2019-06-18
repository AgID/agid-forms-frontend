import * as parser from "expression-eval";
import * as memoize from "memoizee";
import * as React from "react";

import { FormikProps } from "formik";

import { CheckboxField } from "./CheckBoxField";
import { DefaultFormField, FieldT, FormValuesT } from "./DefaultFormField";
import { SelectField } from "./SelectField";

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
}) => {
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
    case "select":
      return SelectField(widgetOpts);
    default:
      return <></>;
  }
};
