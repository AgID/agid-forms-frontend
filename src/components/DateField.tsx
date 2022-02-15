import * as React from "react";

import { Field, FieldAttributes, FormikProps, getIn } from "formik";
import { ErrorMessage } from "./ErrorMessage";
import { FieldDescription } from "./FieldDescription";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";
import { FormFieldPropsT, validateField, FormValuesT } from "../utils/forms";

import DatePicker from "reactstrap-date-picker";

export const DateComponent = ({
  field,
  form,
  options,
  isDisabled,
  ...props
}: {
  field: FieldAttributes<any>;
  form: FormikProps<FormValuesT>;
  options: ReadonlyArray<{ value: string; label: string }>;
  isDisabled: boolean;
}) => {
  return (
    <DatePicker
      {...field}
      {...props}
      weekStartsOn={1}
      dayLabels={['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']}
      monthLabels={['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']}
      dateFormat="DD/MM/YYYY"
      className="form-control"
      disabled={isDisabled}
      onChange={(date: any) => form.setFieldValue(field.name, date)}
    />
  );
};

export const DateField = ({
  field,
  form,
  isHidden,
  isDisabled,
  isRequired,
  validationExpression,
  hasError
}: FormFieldPropsT) => {
  const fieldValue = getIn(form.values, field.name!);
  const fieldPropsBase = {
    id: field.name,
    name: field.name,
    validate: validateField(isRequired, validationExpression, field, form),
    value: fieldValue,
    options: field.options,
  }
  const fieldProps = (field.widget_type && field.widget_type == "browser") ? {
    ...fieldPropsBase,
    type: "date",
    disabled: isDisabled
  } : {
    ...fieldPropsBase,
    type: "text",
    component: DateComponent,
    isDisabled: isDisabled
  };

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
        {...fieldProps}
      />
      <ErrorMessage name={field.name} />
      {field.description && (
        <FieldDescription description={field.description} />
      )}
    </FormGroup>
  ) : null;
};
