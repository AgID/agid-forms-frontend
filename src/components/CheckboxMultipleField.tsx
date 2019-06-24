import * as React from "react";

import { Field, FieldAttributes, FormikProps } from "formik";
import { ErrorMessage } from "./ErrorMessage";
import { FieldDescription } from "./FieldDescription";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

import { Input } from "reactstrap";
import { FieldT, FormValuesT, validateField } from "./FormField";

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
    const isChecked =
      (form.values[field.name] || []).indexOf(option.value) !== -1;
    return (
      <div key={option.value}>
        <Input {...field} {...props} value={option.value} checked={isChecked} />
        <Label
          fieldName={field.name}
          title={option.label}
          isRequired={isRequired}
          onClick={() => {
            isChecked
              ? form.setFieldValue(
                  field.name,
                  (form.values[field.name] || []).filter(
                    (v: any) => v !== option.value
                  )
                )
              : form.setFieldValue(
                  field.name,
                  (form.values[field.name] || []).concat(option.value)
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
  return (
    <FormGroup key={field.name!} isHidden={isHidden} fieldName={field.name!}>
      <Label
        fieldName={field.name!}
        title={field.title!}
        isRequired={isRequired}
      />
      <Field
        name={field.name}
        type="checkbox"
        checked={form.values[field.name!]}
        component={CustomCheckboxComponent}
        className="pl-0"
        validate={validateField(isRequired, validationExpression, field, form)} // always required
        value={
          isHidden
            ? ""
            : valueExpression
            ? // compute field value then cast to string
              valueExpression({ Math, ...form.values }).toString()
            : form.values[field.name!]
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
