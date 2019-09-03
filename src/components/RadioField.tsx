import * as React from "react";

import { Field, FieldAttributes, FormikProps, getIn } from "formik";
import { ErrorMessage } from "./ErrorMessage";
import { FieldDescription } from "./FieldDescription";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

import { Input } from "reactstrap";
import { FormFieldPropsT, FormValuesT, validateField } from "../utils/forms";

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
  return options.map(option => (
    <div key={option.value}>
      <Input
        {...field}
        {...props}
        value={option.value}
        checked={option.value === field.value}
        onClick={() => form.setFieldValue(field.name, option.value)}
      />
      <Label
        fieldName={field.name}
        className="d-block my-2 my-lg-3 font-weight-semibold"
        title={option.label}
        onClick={() => {
          isDisabled
            ? // tslint:disable-next-line: no-unused-expression
              () => void 0
            : form.setFieldValue(
                field.name,
                // uncheck radio when checked
                getIn(form.values, field.name) === option.value
                  ? ""
                  : option.value
              );
        }}
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
    >
      <Label
        tag="h3"
        fieldName={field.name}
        title={field.title!}
        isRequired={isRequired}
        className="d-block font-weight-semibold my-2 my-lg-3 neutral-2-color-a4 font-size-xs"
      />
      <Field
        name={field.name}
        type="radio"
        checked={
          isHidden || isDisabled ? false : getIn(form.values, field.name)
        }
        component={CustomRadioComponent}
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
        isRequired={false}
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
