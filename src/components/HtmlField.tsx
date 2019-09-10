import * as React from "react";

import { FormFieldPropsT, getEmptyValue } from "../utils/forms";
import { Label } from "./Label";

export const HtmlField = ({
  field,
  form,
  isHidden,
  valueExpression
}: FormFieldPropsT) => {
  const content = isHidden
    ? getEmptyValue(field)
    : valueExpression
    ? // compute field value then cast to string
      valueExpression({ Math, ...form.values }).toString()
    : field.default;
  return !isHidden ? (
    <div className="mb-4">
      {field.name && field.title && (
        <Label fieldName={field.name} title={field.title} isRequired={false} />
      )}
      <div
        className="w-paragraph"
        key={field.name!}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  ) : (
    <></>
  );
};
