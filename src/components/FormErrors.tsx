import * as React from "react";

import { FormikProps } from "formik";
import { getFormFields } from "../graphql/gatsby_fragments";
import { FieldT, FormT, FormValuesT } from "./FormField";

export const FormErrors = ({
  formik,
  form
}: {
  formik: FormikProps<FormValuesT>;
  form: FormT;
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
        {Object.keys(formik.errors).map(k => (
          <div key={k}>
            <small className="text-warning">
              {
                getFormFields(form).filter(
                  (field: FieldT | null) => field && field.name === k
                )[0].title
              }
              : {formik.errors[k]}
            </small>
          </div>
        ))}
      </div>
    </div>
  ) : null;
};
