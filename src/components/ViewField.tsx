import * as React from "react";
import {
  FieldT,
  getFieldValueForView,
  isEmptyFieldValue
} from "../utils/forms";

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
  return !isEmptyFieldValue(fieldValue) ? (
    <div className="mb-4">
      <p className="w-paragraph font-weight-bold neutral-2-color-b5 mb-2">
        {field.title}
        {inline ? (
          <span>
            {": "}
            <span className="font-weight-normal">{fieldValue}</span>
          </span>
        ) : null}
      </p>
      {!inline && <p className="w-paragraph">{fieldValue}</p>}
    </div>
  ) : null;
};

export default ViewField;
