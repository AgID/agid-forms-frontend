import * as React from "react";

import { ErrorMessage, Field, FieldAttributes, FormikProps } from "formik";
import { FormGroup, Label } from "reactstrap";

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
  options: Record<string, string>;
}) => {
  return (
    <FormGroup
      check={true}
      key={field.name!}
      className="mb-3"
      hidden={isHidden}
    >
      <Label
        htmlFor={field.name!}
        check={true}
        className="d-block font-weight-semibold"
      >
        {field.title}{" "}
        {isRequired && (
          <small className="float-right text-warning">(campo richiesto)</small>
        )}
      </Label>
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
      <ErrorMessage
        name={field.name!}
        component="div"
        className="alert alert-warning text-warning"
      />
      {field.description && (
        <small className="mb-0 form-text text-muted">{field.description}</small>
      )}
    </FormGroup>
  );
};
