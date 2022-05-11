/**
 * Template for node of type "questionario-accessibilita-pnrr".
 */
import { format } from "date-fns";
import * as React from "react";

import { LoadableViewTemplateProps } from "../../../../components/LoadableView";
import FormGroupTitle from "../../../../components/FormGroupTitle";
import ViewField from "../../../../components/ViewField";

const isFilledValue = (field: any, values: Record<string, string>) => {
  if (Array.isArray(values[field.name])) {
    return values[field.name].length !== 0;
  }

  return !!values[field.name];
}

const ViewTemplate = ({
  form,
  node,
  values
}: LoadableViewTemplateProps) => {
  return (
    <div className="py-lg-4">
      <p className="w-paragraph neutral-2-color-b5">
        compilato il {format(node.updated_at, "DD.MM.YYYY")}
      </p>
      {form.sections!.map(section => {
        if (!section) {
          return null;
        }
        return (
          <div key={section.name || ""} className="view-section">
            {section.title && (
              <h2 className="h3 mb-2 mb-lg-4">{section.title}</h2>
            )}

            {section.groups!.map(group => {
              const groupEnabled =
                group &&
                group.name &&
                group.fields &&
                group.fields.reduce<boolean>((hasValue, currentField) => {
                  if (currentField) {
                    return hasValue || isFilledValue(currentField, values);
                  }
                  return false;
                }, false);

              return groupEnabled ? (
                <div className="fieldset mb-3 mb-lg-5" key={group.name!}>
                  {group.title && <FormGroupTitle title={group.title} />}
                  {group.description && <p className="w-paragraph">{group.description}</p>}
                  {group.fields && group.fields.map(field => {
                    if (field && field.name && values[field.name]) {
                      return (
                        <ViewField
                          inline={true}
                          key={field.name}
                          field={field}
                          value={values[field.name]}
                        />
                      );
                    }
                    return;
                  })}
                </div>
              ) : null;
            })}

          </div>
        );
      })}
    </div>
  );
};

export default ViewTemplate;
