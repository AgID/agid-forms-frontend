import * as React from "react";

import { Field, FormikProps, getIn } from "formik";
import { ErrorMessage } from "./ErrorMessage";
import { FieldDescription } from "./FieldDescription";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

import {
  FieldT,
  FormValuesT,
  isEmptyField,
  validateField
} from "../utils/forms";
import { CustomInputComponent } from "./FormField";

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
  return field.name ? (
    <FormGroup key={field.name} isHidden={isHidden} fieldName={field.name}>
      <Field
        name={field.name}
        type="checkbox"
        checked={getIn(form.values, field.name)}
        component={CustomInputComponent}
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
      />
      <Label
        fieldName={field.name}
        title={field.title!}
        isRequired={isRequired}
        onClick={() => {
          form.setFieldValue(
            field.name!,
            isEmptyField(getIn(form.values, field.name!)) ? field.name : ""
          );
        }}
      />
      <ErrorMessage name={field.name} />
      {field.description && (
        <FieldDescription description={field.description} />
      )}
    </FormGroup>
  ) : null;
};
