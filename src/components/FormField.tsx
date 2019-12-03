import * as parser from "expression-eval";
import memoize from "memoizee";
import * as React from "react";

import { FormikProps, getIn } from "formik";

import { Input } from "reactstrap";
import { getSessionInfo, isLoggedIn } from "../utils/auth";

import {
  FieldT,
  FormValuesT,
  getEmptyValue,
  isEmptyFieldValue
} from "../utils/forms";
import { parseQuery } from "../utils/strings";
import { CheckboxField } from "./CheckboxField";
import { CheckboxMultipleField } from "./CheckboxMultipleField";
import { FileField } from "./FileField";
import { HtmlField } from "./HtmlField";
import { RadioField } from "./RadioField";
import { SelectField } from "./SelectField";
import { TextFormField } from "./TextFormField";
import { VerifyEmailField } from "./VerifyEmailField";

interface ICustomInputComponentProps {
  field: readonly JSX.Element[];
  form: FormikProps<FormValuesT>;
  innerRef?: React.Ref<any>;
}

/**
 * Wrap inputs in bootstrap input
 */
export const CustomInputComponent = ({
  field,
  form,
  ...props
}: ICustomInputComponentProps) => <Input {...field} {...props} />;

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
}): JSX.Element | null => {
  const showIfExpression = getExpressionMemoized("show_if", field);
  const valueExpression = getExpressionMemoized("computed_value", field);
  const validationExpression = getExpressionMemoized("valid_if", field);
  const requiredExpression = getExpressionMemoized("required_if", field);
  const enabledExpression = getExpressionMemoized("enabled_if", field);
  const defaultExpression = getExpressionMemoized(
    "default_computed_value",
    field
  );

  const expressionParams = {
    Auth: { isLoggedIn },
    Math,
    values: form.values,
    user: getSessionInfo(),
    query: parseQuery(window.location.search)
  };

  const isHidden = showIfExpression
    ? !showIfExpression(expressionParams)
    : false;

  const isDisabled = enabledExpression
    ? !enabledExpression(expressionParams)
    : false;

  const isRequired =
    !isHidden &&
    !isDisabled &&
    (requiredExpression ? requiredExpression(expressionParams) : false);

  const computedValue =
    valueExpression && !isHidden
      ? valueExpression(expressionParams)
      : undefined;

  const defaultValue =
    defaultExpression && !isHidden
      ? defaultExpression(expressionParams)
      : undefined;

  const fieldValue = getIn(form.values, field.name!);

  // run for every render
  // reset field value in case it's disabled or hidden
  React.useEffect(() => {
    if (
      (isHidden || isDisabled) &&
      !isEmptyFieldValue(getIn(form.values, field.name!))
    ) {
      form.setFieldValue(field.name!, getEmptyValue(field));
    } else if (computedValue && computedValue !== fieldValue) {
      form.setFieldValue(field.name!, computedValue);
    } else if (
      !isHidden &&
      !isEmptyFieldValue(defaultValue) &&
      !form.touched[field.name!] &&
      isEmptyFieldValue(getIn(form.values, field.name!))
    ) {
      form.setFieldValue(field.name!, defaultValue);
    }
  });

  const hasError =
    form.touched[field.name!] !== undefined &&
    form.errors[field.name!] !== undefined;

  const widgetOpts = {
    field,
    form,
    validationExpression,
    valueExpression,
    isHidden,
    isDisabled,
    isRequired,
    hasError
  };

  switch (field.widget) {
    case "text":
    case "date":
    case "email":
    case "number":
    case "textarea":
      return TextFormField(widgetOpts);
    case "checkbox":
      return widgetOpts.field.options
        ? CheckboxMultipleField(widgetOpts)
        : CheckboxField(widgetOpts);
    case "radio":
      return RadioField(widgetOpts);
    case "select":
      return SelectField(widgetOpts);
    case "file":
      return FileField(widgetOpts);
    case "verify-email":
      return VerifyEmailField(widgetOpts);
    case "html":
      return HtmlField(widgetOpts);
    default:
      return <></>;
  }
};
