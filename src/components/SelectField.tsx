import * as React from "react";

import { Field, FieldAttributes, FormikProps } from "formik";
import { ErrorMessage } from "./ErrorMessage";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

import SelectBase from "react-select";
import { FieldT, FormValuesT, validateField } from "./FormField";

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
    : "";
  return (
    <SelectBase
      {...field}
      {...props}
      value={value}
      options={options}
      onChange={(option: any) => form.setFieldValue(field.name, option.value)}
    />
  );
};

export const SelectField = ({
  field,
  form,
  isHidden,
  isRequired,
  validationExpression,
  valueExpression
}: {
  field: FieldT;
  form: FormikProps<FormValuesT>;
  isHidden: boolean;
  isRequired: boolean;
  validationExpression: any;
  valueExpression: any;
}) => {
  return (
    <FormGroup key={field.name!} isHidden={isHidden} fieldName={field.name!}>
      <Label
        fieldName={field.name!}
        title={field.title!}
        isRequired={isRequired}
      />
      <Field
        name={field.name}
        type="select"
        checked={form.values[field.name!]}
        component={CustomSelectComponent}
        className="pl-0"
        validate={validateField(isRequired, validationExpression, field, form)} // always required
        value={
          isHidden
            ? ""
            : valueExpression
            ? // compute field value then cast to string
              valueExpression({ Math, ...form.values }).toString()
            : form.values[field.name!]
        }
        options={field.options}
      />
      <ErrorMessage name={field.name!} />
      {field.description && (
        <small className="mb-0 form-text text-muted">{field.description}</small>
      )}
    </FormGroup>
  );
};
