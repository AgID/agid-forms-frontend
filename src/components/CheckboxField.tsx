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
import { parseQuery } from "../utils/strings";
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

  const emptyValue = getEmptyValue(field);

  const fieldValue = getIn(form.values, field.name);
  const computedValue =
    valueExpression && !isHidden
      ? valueExpression({
          Math,
          values: form.values,
          query: parseQuery(window.location.search)
        })
      : undefined;
  React.useEffect(() => {
    if (computedValue && computedValue !== fieldValue) {
      form.setFieldValue(field.name!, computedValue);
    }
  });

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
          form.setFieldValue(
            field.name!,
            isEmptyFieldValue(fieldValue) ? field.name : emptyValue
          )
        }
        value={fieldValue}
        disabled={isDisabled}
      />
      <Label
        fieldName={field.name}
        title={field.title!}
        className="d-block my-2 my-lg-3 font-weight-semibold"
      />
      <ErrorMessage name={field.name} />
      {field.description && (
        <FieldDescription description={field.description} />
      )}
    </FormGroup>
  );
};
