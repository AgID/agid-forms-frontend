import * as React from "react";
import * as Yup from "yup";

import { ErrorMessage, Field, FormikProps } from "formik";
import { FormGroup, Input, Label } from "reactstrap";

import { FormConfig_allFormYaml_edges_node_form_fields } from "../generated/graphql/FormConfig";

export const isEmptyField = (value: any) =>
  value === undefined || value === null || value === "";

export interface FormValuesT {
  [k: string]: any;
}

export type FieldT = FormConfig_allFormYaml_edges_node_form_fields;

/**
 * Wrap inputs in bootstrap input
 */
export const CustomInputComponent = ({
  field,
  form,
  ...props
}: {
  field: any;
  form: any;
}) => <Input {...field} {...props} />;

export const FormField = ({
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
    <FormGroup
      check={true}
      key={field.name!}
      className="mb-3"
      hidden={isHidden}
    >
      <Label
        htmlFor={field.name!}
        check={true}
        className="d-block font-weight-semibold"
      >
        {field.title}{" "}
        {isRequired && (
          <small className="float-right text-warning">(campo richiesto)</small>
        )}
      </Label>
      <Field
        name={field.name}
        type="text"
        required={isRequired}
        component={CustomInputComponent}
        className="pl-0"
        validate={
          isRequired || validationExpression
            ? (value: any) =>
                Promise.resolve()
                  .then(() => {
                    if (isRequired && isEmptyField(value)) {
                      // tslint:disable-next-line: no-string-throw
                      throw "Campo richiesto";
                    }
                    return validationExpression
                      ? validationExpression({
                          Yup,
                          value,
                          ...form.values
                        })
                      : true;
                  })
                  .then(validationResult => {
                    // returns custom error message if validation fails
                    return validationResult === false
                      ? field.error_msg || "validation error"
                      : null;
                  })
                  .catch(e => {
                    // prints custom or default error message
                    return (
                      field.error_msg ||
                      (e.errors && e.errors.join
                        ? e.errors.join(", ")
                        : e.toString())
                    );
                  })
            : () => Promise.resolve(null)
        }
        value={
          isHidden
            ? ""
            : valueExpression
            ? // compute field value then cast to string
              valueExpression({ Math, ...form.values }).toString()
            : form.values[field.name!]
        }
      />
      <ErrorMessage
        name={field.name!}
        component="div"
        className="alert alert-warning text-warning"
      />
      {field.description && (
        <small className="mb-0 form-text text-muted">{field.description}</small>
      )}
    </FormGroup>
  );
};
