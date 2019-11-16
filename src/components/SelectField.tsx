import * as React from "react";

import { Field, FieldAttributes, FormikProps, getIn } from "formik";
import { ErrorMessage } from "./ErrorMessage";
import { FieldDescription } from "./FieldDescription";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

import SelectBase from "react-select";
import {
  FormFieldPropsT,
  FormValuesT,
  getEmptyValue,
  validateField
} from "../utils/forms";

export const CustomSelectComponent = ({
  field,
  form,
  options,
  ...props
}: {
  field: FieldAttributes<any>;
  form: FormikProps<FormValuesT>;
  options: ReadonlyArray<{ value: string; label: string }>;
}) => {
  const value = options
    ? options.find(option => option.value === field.value)
    : getEmptyValue(field);
  return (
    <SelectBase
      {...field}
      {...props}
      className="react-select"
      value={value}
      options={options}
      onChange={(option: any) => form.setFieldValue(field.name, option.value)}
      inputId={`${field.name}-select`}
    />
  );
};

export const SelectField = ({
  field,
  form,
  isHidden,
  isDisabled,
  isRequired,
  validationExpression,
  hasError
}: FormFieldPropsT) => {
  const fieldValue = getIn(form.values, field.name!);
  return field.name ? (
    <FormGroup
      key={field.name}
      isHidden={isHidden}
      fieldName={field.name}
      hasError={hasError}
    >
      <Label
        fieldName={`${field.name}-select`}
        title={field.title!}
        isRequired={isRequired}
      />
      <Field
        id={field.name}
        name={field.name}
        type="select"
        checked={fieldValue}
        component={CustomSelectComponent}
        validate={validateField(isRequired, validationExpression, field, form)} // always required
        value={fieldValue}
        options={field.options}
        isDisabled={isDisabled}
      />
      <ErrorMessage name={field.name} />
      {field.description && (
        <FieldDescription description={field.description} />
      )}
    </FormGroup>
  ) : null;
};
