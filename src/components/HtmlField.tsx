import * as React from "react";

import { FormFieldPropsT } from "./FormField";

export const HtmlField = ({
  field,
  form,
  isHidden,
  valueExpression
}: Pick<
  FormFieldPropsT,
  // tslint:disable-next-line: max-union-size
  "field" | "form" | "isHidden" | "valueExpression"
>) => {
  const content = isHidden
    ? ""
    : valueExpression
    ? // compute field value then cast to string
      valueExpression({ Math, ...form.values }).toString()
    : field.default;
  return isHidden ? (
    <div key={field.name!} dangerouslySetInnerHTML={{ __html: content }} />
  ) : (
    <></>
  );
};
