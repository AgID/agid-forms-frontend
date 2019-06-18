import * as React from "react";

import { ErrorMessage, Field, FormikProps } from "formik";
import { FormGroup, Label } from "reactstrap";

import {
  CustomInputComponent,
  FieldT,
  FormValuesT,
  isEmptyField,
  validateField
} from "./FormField";

export const CheckboxField = ({
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
      <Field
        name={field.name}
        type="checkbox"
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
      />
      <Label
        htmlFor={field.name!}
        check={true}
        onClick={() => {
          form.setFieldValue(
            field.name!,
            isEmptyField(form.values[field.name!]) ? field.name : ""
          );
        }}
        className="font-weight-semibold"
      >
        {field.title}{" "}
      </Label>
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
