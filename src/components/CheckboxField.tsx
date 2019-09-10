import * as React from "react";

import { Field, getIn } from "formik";
import { ErrorMessage } from "./ErrorMessage";
import { FieldDescription } from "./FieldDescription";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

import {
  FormFieldPropsT,
  getEmptyValue,
  isEmptyFieldValue,
  validateField
} from "../utils/forms";
import { CustomInputComponent } from "./FormField";

export const CheckboxField = ({
  field,
  form,
  isHidden,
  isDisabled,
  isRequired,
  validationExpression,
  valueExpression,
  hasError
}: FormFieldPropsT) => {
  if (!field.name) {
    return null;
  }

  const fieldValue = getIn(form.values, field.name);

  const [checked, setChecked] = React.useState(!isEmptyFieldValue(fieldValue));

  const emptyValue = getEmptyValue(field);

  return (
    <FormGroup
      key={field.name}
      isHidden={isHidden}
      fieldName={field.name}
      hasError={hasError}
    >
      <Field
        name={field.name}
        id={field.name}
        type="checkbox"
        // must depend from value (not from "checked")
        checked={isHidden || isDisabled ? false : fieldValue === field.name}
        component={CustomInputComponent}
        className="pl-0"
        validate={validateField(isRequired, validationExpression, field, form)} // always required
        onChange={() =>
          form.setFieldValue(field.name!, checked ? field.name : emptyValue)
        }
        value={
          isHidden || isDisabled
            ? emptyValue
            : valueExpression
            ? // compute field value then cast to string
              valueExpression({ Math, ...form.values }).toString()
            : checked
            ? field.name
            : emptyValue
        }
        disabled={isDisabled}
      />
      <Label
        fieldName={field.name}
        title={field.title!}
        onClick={() => {
          if (!isDisabled) {
            setChecked(!checked);
          }
        }}
      />
      <ErrorMessage name={field.name} />
      {field.description && (
        <FieldDescription description={field.description} />
      )}
    </FormGroup>
  );
};
