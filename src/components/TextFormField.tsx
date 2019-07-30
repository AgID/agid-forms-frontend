import * as React from "react";

import { Field, getIn } from "formik";
import { ErrorMessage } from "./ErrorMessage";
import { FieldDescription } from "./FieldDescription";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

import { CustomInputComponent } from "./FormField";

import { FormFieldPropsT, validateField } from "../utils/forms";

export const TextFormField = ({
  field,
  form,
  isHidden,
  isDisabled,
  isRequired,
  validationExpression,
  valueExpression
}: FormFieldPropsT) => {
  return field.name ? (
    <FormGroup key={field.name} isHidden={isHidden} fieldName={field.name}>
      <Label
        fieldName={field.name}
        title={field.title!}
        isRequired={isRequired}
      />
      <Field
        name={field.name}
        type={field.widget}
        required={isRequired}
        disabled={isDisabled}
        component={CustomInputComponent}
        className="pl-0"
        validate={validateField(isRequired, validationExpression, field, form)}
        value={
          isHidden || isDisabled
            ? ""
            : valueExpression
            ? // compute field value then cast to string
              valueExpression({ Math, ...form.values }).toString()
            : getIn(form.values, field.name)
        }
      />
      <ErrorMessage name={field.name} />
      {field.description && (
        <FieldDescription description={field.description} />
      )}
    </FormGroup>
  ) : null;
};
