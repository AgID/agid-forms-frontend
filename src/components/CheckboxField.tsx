import * as React from "react";

import { Field, getIn } from "formik";
import { ErrorMessage } from "./ErrorMessage";
import { FieldDescription } from "./FieldDescription";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

import { FormFieldPropsT, isEmptyField, validateField } from "../utils/forms";
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
  return field.name ? (
    <FormGroup
      key={field.name}
      isHidden={isHidden}
      fieldName={field.name}
      hasError={hasError}
    >
      <Field
        name={field.name}
        type="checkbox"
        checked={
          isHidden || isDisabled ? false : getIn(form.values, field.name)
        }
        component={CustomInputComponent}
        className="pl-0"
        validate={validateField(isRequired, validationExpression, field, form)} // always required
        value={
          isHidden || isDisabled
            ? ""
            : valueExpression
            ? // compute field value then cast to string
              valueExpression({ Math, ...form.values }).toString()
            : getIn(form.values, field.name)
        }
        disabled={isDisabled}
      />
      <Label
        fieldName={field.name}
        title={field.title!}
        isRequired={isRequired}
        onClick={() => {
          !isDisabled
            ? form.setFieldValue(
                field.name!,
                isEmptyField(getIn(form.values, field.name!)) ? field.name : ""
              )
            : // tslint:disable-next-line: no-unused-expression
              () => void 0;
        }}
      />
      <ErrorMessage name={field.name} />
      {field.description && (
        <FieldDescription description={field.description} />
      )}
    </FormGroup>
  ) : null;
};
