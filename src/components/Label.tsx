import * as React from "react";
import { Label as RSLabel, LabelProps as RSLabelProps } from "reactstrap";

interface LabelProps extends RSLabelProps {
  fieldName: string;
  title: string;
  isRequired: boolean;
}

export const Label = ({
  fieldName,
  title,
  isRequired,
  ...props
}: LabelProps) => (
  <RSLabel
    htmlFor={fieldName}
    check={true}
    className="d-block font-weight-semibold"
    {...props}
  >
    {title}{" "}
    {isRequired && (
      <small className="float-right text-warning">(campo richiesto)</small>
    )}
  </RSLabel>
);
