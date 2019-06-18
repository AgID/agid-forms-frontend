import * as React from "react";
import {
  FormGroup as RSFormGroup,
  FormGroupProps as RSFormGroupProps
} from "reactstrap";

interface FormGroupProps extends RSFormGroupProps {
  fieldName: string;
  isHidden: boolean;
  children: React.ReactNode;
}

export const FormGroup = ({
  fieldName,
  isHidden,
  children
}: FormGroupProps) => (
  <RSFormGroup check={true} key={fieldName} className="mb-3" hidden={isHidden}>
    {children}
  </RSFormGroup>
);
