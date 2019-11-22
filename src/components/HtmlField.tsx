import * as React from "react";

import { FormFieldPropsT } from "../utils/forms";
import { Label } from "./Label";

export const HtmlField = ({ field, isHidden }: FormFieldPropsT) => {
  const fieldValue = field.default;
  return !isHidden ? (
    <div className="mb-4">
      {field.name && field.title && (
        <Label fieldName={field.name} title={field.title} isRequired={true} />
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
