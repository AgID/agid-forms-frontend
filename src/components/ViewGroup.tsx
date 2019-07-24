import * as React from "react";
import { FormGroupT } from "../utils/forms";
import FormGroupTitle from "./FormGroupTitle";
import ViewField from "./ViewField";
import ViewFieldArray from "./ViewFieldArray";

const ViewGroup = ({
  group,
  values,
  inline = false
}: {
  group: FormGroupT;
  values: Record<string, string>;
  inline?: boolean;
}) => (
  <div className="fieldset mb-3 mb-lg-5" key={group.name!}>
    {group.title && <FormGroupTitle title={group.title} />}
    {group.description && <p>{group.description}</p>}
    {group.repeatable && <ViewFieldArray group={group} values={values} />}
    {!group.repeatable &&
      group.fields &&
      group.fields.map(field =>
        field && field.name ? (
          <ViewField
            inline={inline}
            key={field.name}
            field={field}
            value={values[field.name]}
          />
        ) : null
      )}
  </div>
);

export default ViewGroup;
