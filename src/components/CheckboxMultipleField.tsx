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

export const CustomCheckboxComponent = ({
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
  return options.map((option, index) => {
    // must depend from value (not from "checked")
    const isChecked = fieldValue.includes(option.value);
    return (
      <div key={option.value}>
        <Input
          {...field}
          {...props}
          value={option.value}
          checked={isChecked}
          id={`${field.name}-${index}`}
          onChange={() => {
            const nextValue = isChecked
              ? fieldValue.filter((value: string) => value !== option.value)
              : fieldValue.concat(option.value);
            form.setFieldValue(field.name, nextValue);
          }}
        />
        <Label
          className="d-block my-2 my-lg-3 font-weight-semibold"
          fieldName={`${field.name}-${index}`}
          title={option.label}
        />
      </div>
    );
  });
};

export const CheckboxMultipleField = ({
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
      role="group"
      label={field.title!}
    >
      <Label
        tag="h3"
        className="d-block font-weight-semibold my-2 my-lg-3 neutral-1-color-a6 font-size-xs"
        fieldName={field.name}
        title={field.title!}
        isRequired={isRequired}
      />
      <Field
        name={field.name}
        type="checkbox"
        checked={
          isHidden || isDisabled ? false : getIn(form.values, field.name)
        }
        component={CustomCheckboxComponent}
        className="pl-0"
        validate={validateField(isRequired, validationExpression, field, form)} // always required
        value={
          isHidden || isDisabled
            ? getEmptyValue(field)
            : valueExpression
            ? valueExpression({ Math, ...form.values })
            : getIn(form.values, field.name)
        }
        isRequired={false}
        disabled={isDisabled}
        options={field.options}
      />
      <ErrorMessage name={field.name} />
      {field.description && (
        <FieldDescription description={field.description} />
      )}
    </FormGroup>
  ) : null;
};
