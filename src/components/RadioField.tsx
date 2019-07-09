import * as React from "react";

import { Field, FieldAttributes, FormikProps, getIn } from "formik";
import { ErrorMessage } from "./ErrorMessage";
import { FieldDescription } from "./FieldDescription";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

import { Input } from "reactstrap";
import { FieldT, FormValuesT, validateField } from "../utils/forms";

export const CustomRadioComponent = ({
  field,
  form,
  options,
  isRequired,
  ...props
}: {
  field: FieldAttributes<any>;
  form: FormikProps<FormValuesT>;
  options: ReadonlyArray<{ value: string; label: string }>;
  isRequired: boolean;
}) => {
  return options.map(option => (
    <div key={option.value}>
      <Input
        {...field}
        {...props}
        value={option.value}
        checked={option.value === field.value}
        onClick={() => form.setFieldValue(field.name, option.value)}
      />
      <Label
        fieldName={field.name}
        title={option.label}
        isRequired={isRequired}
        onClick={() => {
          form.setFieldValue(field.name, option.value);
        }}
      />
    </div>
  ));
};

export const RadioField = ({
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
  return field.name ? (
    <FormGroup key={field.name} isHidden={isHidden} fieldName={field.name}>
      <Label
        fieldName={field.name}
        title={field.title!}
        isRequired={isRequired}
      />
      <Field
        name={field.name}
        type="radio"
        checked={getIn(form.values, field.name)}
        component={CustomRadioComponent}
        className="pl-0"
        validate={validateField(isRequired, validationExpression, field, form)} // always required
        value={
          isHidden
            ? ""
            : valueExpression
            ? // compute field value then cast to string
              valueExpression({ Math, ...form.values }).toString()
            : getIn(form.values, field.name)
        }
        isRequired={false}
        options={field.options}
      />
      <ErrorMessage name={field.name} />
      {field.description && (
        <FieldDescription description={field.description} />
      )}
    </FormGroup>
  ) : null;
};
