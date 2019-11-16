import * as React from "react";

import { FormFieldPropsT, getEmptyValue } from "../utils/forms";
import { parseQuery } from "../utils/strings";
import { Label } from "./Label";

export const HtmlField = ({
  field,
  form,
  isHidden,
  valueExpression
}: FormFieldPropsT) => {
  const fieldValue = field.default;
  const computedValue =
    valueExpression && !isHidden
      ? valueExpression({
          Math,
          values: form.values,
          query: parseQuery(window.location.search)
        })
      : undefined;
  React.useEffect(() => {
    if (computedValue && computedValue !== fieldValue) {
      form.setFieldValue(field.name!, computedValue);
    }
  });
  return !isHidden ? (
    <div className="mb-4">
      {field.name && field.title && (
        <Label fieldName={field.name} title={field.title} isRequired={false} />
      )}
      <div
        className="w-paragraph"
        key={field.name!}
        dangerouslySetInnerHTML={{ __html: fieldValue || "" }}
      />
    </div>
  ) : (
    <></>
  );
};
