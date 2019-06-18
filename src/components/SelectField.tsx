import * as React from "react";

import { ErrorMessage, Field, FormikProps } from "formik";
import { FormGroup, Label } from "reactstrap";

import {
  CustomInputComponent,
  FieldT,
  FormValuesT,
  validateField
} from "./DefaultFormField";

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
        component={CustomInputComponent}
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
      >
        {field.options!.map(option =>
          option && option.value && option.label ? (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ) : null
        )}
      </Field>
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
