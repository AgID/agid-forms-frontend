import {
  ErrorMessage as FormikErrorMessage,
  ErrorMessageProps as FormikErrorMessageProps
} from "formik";
import * as React from "react";

interface ErrorMessageProps extends FormikErrorMessageProps {}

export const ErrorMessage = ({ ...props }: ErrorMessageProps) => (
  <FormikErrorMessage
    component="div"
    className="alert alert-warning text-warning"
    {...props}
  />
);
