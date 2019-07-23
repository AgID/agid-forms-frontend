/**
 * Template for node of type "dichiarazione-accessibilità".
 *
 * TODO: multilang
 */
import * as React from "react";
import { GetNode_latest_published } from "../../generated/graphql/GetNode";
import { FieldT, FormT } from "../../utils/forms";

const ViewField = ({ field, value }: { field: FieldT; value: string }) => {
  return (
    <p>
      {field.title}: {value}
    </p>
  );
};

// const ViewFieldArray = ({
//   group,
//   values
// }: {
//   group: FormGroupT;
//   values: any;
// }) => {
//   if (!group.name || !group.fields) {
//     return null;
//   }
//   const existingValues = values[group.name];
//   if (!existingValues) {
//     return null;
//   }
//   const existingFields = existingValues.map(
//     (o: Record<string, string>, index: number) =>
//       Object.keys(o).map(fieldName => {
//         return `${group.name}.${index}.${fieldName}`;
//       })
//   );
//   return <>{existingFields}</>;
// };

const Template = ({
  form,
  node,
  values
}: {
  form: FormT;
  node: GetNode_latest_published;
  values: Record<string, string>;
}) => {
  return form.sections!.map(section => {
    if (!section) {
      return null;
    }
    return (
      <div key={`${section.title}`}>
        <p>redatta il {node.updated_at}</p>
        {section.title && <h2 className="h3 mb-2 mb-lg-4">{section.title}</h2>}

        {section.name === "section-0" && (
          <p>
            TODO: si impegna a rendere il sito web “{values["website-name"]}”
            accessibile, conformemente alla normativa nazionale che ha recepito
            la direttiva (UE) 2016/2102 del Parlamento europeo e del Consiglio.
            La presente dichiarazione di accessibilità si applica a siti web e
            applicazioni mobile omnis voluptas assumenda est, omnis dolor
            repellendus.
          </p>
        )}

        {section.description && (
          <p className="w-paragraph neutral-1-color-b6">
            {section.description}
          </p>
        )}
        {section.groups!.map(group => {
          return (
            group && (
              <div className="fieldset mb-3 mb-lg-5" key={group.name!}>
                {group.title && (
                  <h3 className="display-3 font-variant-small-caps primary-color-a9 my-2 mt-lg-5 mb-lg-4 text-spaced-xs">
                    {group.title}
                  </h3>
                )}
                {group.description && <p>{group.description}</p>}
                {/* {group.repeatable ? (
                  <ViewFieldArray group={group} values={values} />
                ) : ( */}
                {group.fields!.map(field =>
                  field && field.name ? (
                    <ViewField
                      key={field.name}
                      field={field}
                      value={values[field.name]}
                    />
                  ) : (
                    <></>
                  )
                )}
              </div>
            )
          );
        })}
      </div>
    );
  });
};

export default Template;
