import * as React from "react";

import { Field, FieldAttributes, FormikProps, getIn } from "formik";
import { ErrorMessage } from "./ErrorMessage";
import { FieldDescription } from "./FieldDescription";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

import { Input } from "reactstrap";
import {
  FormFieldPropsT,
  FormValuesT,
  getEmptyValue,
  validateField
} from "../utils/forms";

export const CustomRadioComponent = ({
  field,
  form,
  options,
  isHidden,
  isDisabled,
  isRequired,
  ...props
}: {
  field: FieldAttributes<any>;
  form: FormikProps<FormValuesT>;
  options: ReadonlyArray<{ value: string; label: string }>;
  isHidden: boolean;
  isDisabled: boolean;
  isRequired: boolean;
}) => {
  const fieldValue = getIn(form.values, field.name);
  return options.map((option, index) => (
    <div key={option.value}>
      <Input
        {...field}
        {...props}
        value={option.value}
        checked={option.value === fieldValue}
        onChange={() => {
          if (!isRequired && field.value === option.value) {
            // uncheck radio when checked
            form.setFieldValue(field.name, getEmptyValue(field));
          } else {
            form.setFieldValue(field.name, option.value);
          }
        }}
        id={`${field.name}-${index}`}
      />
      <Label
        fieldName={`${field.name}-${index}`}
        className="d-block my-2 my-lg-3 font-weight-semibold"
        title={option.label}
      />
    </div>
  ));
};

export const RadioField = ({
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
      role="radiogroup"
      label={field.title!}
    >
      <Label
        tag="h3"
        fieldName={field.name}
        title={field.title!}
        isRequired={isRequired}
        className="d-block font-weight-semibold my-2 my-lg-3 neutral-2-color-a5 font-size-xs"
      />
      <Field
        name={field.name}
        type="radio"
        component={CustomRadioComponent}
        className="pl-0"
        validate={validateField(isRequired, validationExpression, field, form)}
        value={
          isHidden || isDisabled
            ? getEmptyValue(field)
            : valueExpression
            ? // compute field value then cast to string
              valueExpression({ Math, ...form.values }).toString()
            : getIn(form.values, field.name)
        }
        isRequired={isRequired}
        isDisabled={isDisabled}
        options={field.options}
      />
      <ErrorMessage name={field.name} />
      {field.description && (
        <FieldDescription description={field.description} />
      )}
    </FormGroup>
  ) : null;
};
