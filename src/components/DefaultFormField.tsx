import * as React from "react";

import { Field } from "formik";
import { ErrorMessage } from "./ErrorMessage";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

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
    <FormGroup key={field.name!} isHidden={isHidden} fieldName={field.name!}>
      <Label
        fieldName={field.name!}
        title={field.title!}
        isRequired={isRequired}
      />
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
      <ErrorMessage name={field.name!} />
      {field.description && (
        <small className="mb-0 form-text text-muted">{field.description}</small>
      )}
    </FormGroup>
  );
};
