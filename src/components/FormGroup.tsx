import * as React from "react";
import {
  FormGroup as RSFormGroup,
  FormGroupProps as RSFormGroupProps
} from "reactstrap";

interface FormGroupProps extends RSFormGroupProps {
  fieldName: string;
  isHidden: boolean;
  hasError?: boolean;
  role?: string;
  label?: string;
  children: React.ReactNode;
}

export const FormGroup = ({
  fieldName,
  isHidden,
  hasError,
  children,
  role,
  label
}: FormGroupProps) => (
  <RSFormGroup
    check={true}
    key={fieldName}
    className={`mb-4 ${hasError ? " has-error " : ""}`}
    hidden={isHidden}
    role={role}
    aria-label={label}
  >
    {children}
  </RSFormGroup>
);
