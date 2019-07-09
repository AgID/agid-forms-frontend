import * as React from "react";

import { Field, FormikProps, getIn } from "formik";
import { flattenFormErrors, FormValuesT } from "../utils/forms";

const ErrorMessage = ({ name }: { name: string }) => (
  <Field
    name={name}
    render={({ form }: { form: FormikProps<FormValuesT> }) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      return touch && error ? `${name}: ${error}` : null;
    }}
  />
);

export const FormErrors = ({
  formik
}: {
  formik: FormikProps<FormValuesT>;
}) => {
  const hasErrors =
    Object.keys(formik.errors).length > 0 &&
    Object.keys(formik.touched).length > 0;
  return hasErrors ? (
    <div className="mt-3 alert alert-warning">
      <small className="text-warning text-sans-serif">
        assicurati di aver corretto tutti gli errori ed aver compilato tutti i
        campi obbligatori prima di salvare il modulo
      </small>
      <div className="mt-3">
        {Object.keys(flattenFormErrors(formik.errors)).map(fieldName => {
          return (
            <div key={fieldName}>
              <small className="text-warning">
                <ErrorMessage name={fieldName} />
              </small>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
};
