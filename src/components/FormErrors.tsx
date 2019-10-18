import * as React from "react";

import { Field, FormikProps, getIn } from "formik";
import { Trans } from "react-i18next";
import { FieldT, flattenFormErrors, FormValuesT } from "../utils/forms";

const ErrorMessage = ({ name, label }: { name: string; label: string }) => (
  <Field
    name={name}
    render={({ form }: { form: FormikProps<FormValuesT> }) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      return touch && error ? `${label}: ${error}` : null;
    }}
  />
);

export const FormErrors = ({
  formik,
  fields
}: {
  formik: FormikProps<FormValuesT>;
  fields: Record<string, FieldT>;
}) => {
  const hasErrors =
    Object.keys(formik.errors).length > 0 &&
    Object.keys(formik.touched).length > 0;
  return hasErrors ? (
    <div className="mt-3 alert alert-warning">
      <small className="text-warning text-sans-serif">
        <Trans i18nKey="form_errors_warning" />
      </small>
      <div className="mt-3">
        {Object.keys(flattenFormErrors(formik.errors)).map(fieldName => {
          return (
            <div key={fieldName}>
              <small className="text-warning">
                <ErrorMessage
                  name={fieldName}
                  label={fields[fieldName].title || ""}
                />
              </small>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
};
