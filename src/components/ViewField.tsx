import * as React from "react";
import {
  FieldT,
  getFieldValueForView,
  isEmptyFieldValue
} from "../utils/forms";

export const formatFieldValue = (value: string) =>
  value.split("\n").map(txt => (
    <>
      {txt}
      <br />
    </>
  ));

const ViewField = ({
  field,
  value,
  inline = false
}: {
  field: FieldT;
  value: string;
  inline?: boolean;
}) => {
  const fieldValue = getFieldValueForView({ field, value });
  if (!fieldValue || isEmptyFieldValue(fieldValue)) {
    return null;
  }
  const renderedFieldValue =
    field.widget === "textarea" ? formatFieldValue(fieldValue) : fieldValue;
  return (
    <div className="mb-4">
      <p className="w-paragraph font-weight-bold neutral-2-color-b5 mb-2">
        {field.title}
        {inline ? (
          <span>
            {": "}
            <span className="font-weight-normal">{renderedFieldValue}</span>
          </span>
        ) : null}
      </p>
      {!inline && <p className="w-paragraph">{renderedFieldValue}</p>}
    </div>
  );
};

export default ViewField;
