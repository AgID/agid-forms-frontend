import * as React from "react";

import { Field, FieldAttributes, FormikProps, getIn } from "formik";
import { ErrorMessage } from "./ErrorMessage";
import { FieldDescription } from "./FieldDescription";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

import { Input } from "reactstrap";
import { FieldT, FormValuesT, validateField } from "../utils/forms";

export const CustomCheckboxComponent = ({
  field,
  form,
  options,
  isRequired,
  ...props
}: {
  field: FieldAttributes<any>;
  form: FormikProps<FormValuesT>;
  options: ReadonlyArray<{ value: string; label: string }>;
  isRequired: boolean;
}) => {
  return options.map(option => {
    const fieldValue = getIn(form.values, field.name);
    const isChecked = (fieldValue || []).indexOf(option.value) !== -1;
    return (
      <div key={option.value}>
        <Input {...field} {...props} value={option.value} checked={isChecked} />
        <Label
          className="d-block my-2 my-lg-3 font-weight-semibold"
          fieldName={field.name}
          title={option.label}
          isRequired={isRequired}
          onClick={() => {
            isChecked
              ? form.setFieldValue(
                  field.name,
                  (fieldValue || []).filter((v: any) => v !== option.value)
                )
              : form.setFieldValue(
                  field.name,
                  (fieldValue || []).concat(option.value)
                );
          }}
        />
      </div>
    );
  });
};

export const CheckboxMultipleField = ({
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
  const fieldValue = getIn(form.values, field.name!);
  return (
    <FormGroup key={field.name!} isHidden={isHidden} fieldName={field.name!}>
      <Label
        className="d-block font-weight-semibold my-2 my-lg-3 neutral-1-color-a6 font-size-xs"
        fieldName={field.name!}
        title={field.title!}
        isRequired={isRequired}
      />
      <Field
        name={field.name}
        type="checkbox"
        checked={fieldValue}
        component={CustomCheckboxComponent}
        className="pl-0"
        validate={validateField(isRequired, validationExpression, field, form)} // always required
        value={
          isHidden
            ? ""
            : valueExpression
            ? // compute field value then cast to string
              valueExpression({ Math, ...form.values }).toString()
            : fieldValue
        }
        isRequired={false}
        options={field.options}
      />
      <ErrorMessage name={field.name!} />
      {field.description && (
        <FieldDescription description={field.description} />
      )}
    </FormGroup>
  );
};
