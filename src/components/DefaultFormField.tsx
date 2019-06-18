import * as React from "react";

import { ErrorMessage, Field } from "formik";
import { FormGroup, Label } from "reactstrap";
import {
  CustomInputComponent,
  FormFieldPropsT,
  validateField
} from "./FormField";

export const DefaultFormField = ({
  field,
  form,
  isHidden,
  isRequired,
  validationExpression,
  valueExpression
}: FormFieldPropsT) => {
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
        type="text"
        required={isRequired}
        component={CustomInputComponent}
        className="pl-0"
        validate={validateField(isRequired, validationExpression, field, form)}
        value={
          isHidden
            ? ""
            : valueExpression
            ? // compute field value then cast to string
              valueExpression({ Math, ...form.values }).toString()
            : form.values[field.name!]
        }
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
