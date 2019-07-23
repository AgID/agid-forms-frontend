import * as React from "react";
import { FieldT } from "../utils/forms";

// tslint:disable-next-line: no-empty-destructuring
const Template = ({
  fields,
  values
}: {
  fields: Record<string, FieldT>;
  values: Record<string, string>;
}) => {
  return (
    <p>
      {JSON.stringify(fields)}:{JSON.stringify(values)}
    </p>
  );
};

export default Template;
