import * as React from "react";

import { Field, getIn } from "formik";
import { ErrorMessage } from "./ErrorMessage";
import { FieldDescription } from "./FieldDescription";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

import { CustomInputComponent } from "./FormField";

import { FormFieldPropsT, getEmptyValue, validateField } from "../utils/forms";
import { parseQuery } from "../utils/strings";

export const TextFormField = ({
  field,
  form,
  isHidden,
  isDisabled,
  isRequired,
  validationExpression,
  valueExpression,
  hasError
}: FormFieldPropsT) => {
  const fieldValue = getIn(form.values, field.name!);
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
  return field.name ? (
    <FormGroup
      key={field.name}
      isHidden={isHidden}
      fieldName={field.name}
      hasError={hasError}
    >
      <Label
        fieldName={field.name}
        title={field.title!}
        isRequired={isRequired}
      />
      <Field
        id={field.name}
        name={field.name}
        type={field.widget}
        required={isRequired}
        disabled={isDisabled}
        component={CustomInputComponent}
        validate={validateField(isRequired, validationExpression, field, form)}
        value={fieldValue}
      />
      {field.widget === "textarea" && (
        <span className="float-right form-text neutral-2-color-a5 font-size-xxs">
          {fieldValue.length} caratteri
        </span>
      )}
      <ErrorMessage name={field.name} />
      {field.description && (
        <FieldDescription description={field.description} />
      )}
    </FormGroup>
  ) : null;
};
