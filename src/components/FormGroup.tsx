import * as React from "react";
import {
  FormGroup as RSFormGroup,
  FormGroupProps as RSFormGroupProps
} from "reactstrap";

interface FormGroupProps extends RSFormGroupProps {
  fieldName: string;
  isHidden: boolean;
  hasError: boolean;
  children: React.ReactNode;
}

export const FormGroup = ({
  fieldName,
  isHidden,
  hasError,
  children
}: FormGroupProps) => (
  <RSFormGroup
    check={true}
    key={fieldName}
    className={`mb-4 ${hasError ? " has-error " : ""}`}
    hidden={isHidden}
  >
    {children}
  </RSFormGroup>
);
