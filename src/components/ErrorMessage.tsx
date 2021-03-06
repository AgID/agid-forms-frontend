import {
  ErrorMessage as FormikErrorMessage,
  ErrorMessageProps as FormikErrorMessageProps
} from "formik";
import * as React from "react";

interface ErrorMessageProps extends FormikErrorMessageProps {}

export const ErrorBox: React.FC = ({ children }) => {
  return (
    <div className="alert alert-warning text-warning mb-0 mt-3">{children}</div>
  );
};

export const ErrorMessage = ({ ...props }: ErrorMessageProps) => (
  <FormikErrorMessage component={ErrorBox} {...props} />
);
