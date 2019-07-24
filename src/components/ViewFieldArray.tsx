import * as React from "react";
import { FormGroupT } from "../utils/forms";

/**
 * Do not use tihs component, it is a placeholder.
 * TODO: implement.
 */
const ViewFieldArray = ({
  group,
  values
}: {
  group: FormGroupT;
  values: any;
}) => {
  if (!group.name || !group.fields) {
    return null;
  }
  const existingValues = values[group.name];
  if (!existingValues) {
    return null;
  }
  const existingFields = existingValues.map(
    (o: Record<string, string>, index: number) =>
      Object.keys(o).map(fieldName => {
        return `${group.name}.${index}.${fieldName}`;
      })
  );
  return <>{existingFields}</>;
};

export default ViewFieldArray;
