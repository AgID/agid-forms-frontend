/**
 * Template for node of type "dichiarazione-accessibilità".
 *
 * TODO: multilang
 */
import { format } from "date-fns";
import * as React from "react";

import { GetNode_latest_published } from "../../generated/graphql/GetNode";
import { FieldT, FormGroupT, FormT, getGroupFields } from "../../utils/forms";

import { get } from "../../utils/safe_access";

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

const RenderGroup = ({
  group,
  values
}: {
  group: FormGroupT;
  values: Record<string, string>;
}) => (
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
        <ViewField key={field.name} field={field} value={values[field.name]} />
      ) : (
        <></>
      )
    )}
  </div>
);

const getComplianceString = (complianceStatus: string, isWebSite: boolean) => {
  switch (complianceStatus) {
    case "compliant":
      return `${
        isWebSite ? "Questo sito web" : "Questa applicazione"
      } è conforme.`;
    case "partially-compliant":
      return `${
        isWebSite ? "Questo sito web" : "Questa applicazione"
      } è parzialmente conforme, in ragione dei casi di non conformità [e/o] delle deroghe elencate di seguito.`;
    case "non-compliant":
      return `${
        isWebSite ? "Questo sito web" : "Questa applicazione"
      } non è conforme.`;
    default:
      return "";
  }
};

const GroupTitle = ({ title }: { title: string | null }) => (
  <h3 className="display-3 font-variant-small-caps primary-color-a9 my-2 mt-lg-5 mb-lg-4 text-spaced-xs">
    {title || ""}
  </h3>
);

const Groups: Record<
  string,
  ({
    group,
    values,
    fields
  }: {
    group: FormGroupT;
    values: Record<string, string>;
    fields: Record<string, FieldT>;
  }) => JSX.Element
> = {
  "content-compliance": ({ group, values }) => {
    return (
      <div className="mb-lg-5" key="content-compliance">
        <GroupTitle title={group.title} />
        <p className="w-paragraph">
          {getComplianceString(
            values["compliance-status"],
            values["device-type"] === "website"
          )}
        </p>
      </div>
    );
  },
  "content-not-accessible": ({ group, values, fields }) => {
    const hasInaccessibleContent =
      values["reason-42004"] ||
      values["reason-disproportionate-burden"] ||
      values["reason-no-law"];
    return (
      <div className="mb-lg-5" key="content-not-accessible">
        <GroupTitle title={group.title} />
        {hasInaccessibleContent && (
          <p className="w-paragraph" key="reason">
            I contenuti di seguito elencati non sono accessibili per i seguenti
            motivi:
          </p>
        )}
        {values["reason-42004"] && (
          <div>
            <p className="w-paragraph font-weight-bold">
              {fields["reason-42004"].title}
            </p>
            <p className="w-paragraph pl-lg-4">{values["reason-42004-text"]}</p>
          </div>
        )}
        {values["reason-disproportionate-burden"] && (
          <div>
            <p className="w-paragraph font-weight-bold">
              {fields["reason-disproportionate-burden"].title}
            </p>
            <p className="w-paragraph pl-lg-4">
              {values["reason-disproportionate-burden-text"]}
            </p>
          </div>
        )}
        {values["reason-no-law"] && (
          <div>
            <p className="w-paragraph font-weight-bold">
              {fields["reason-no-law"].title}
            </p>
            <p className="w-paragraph pl-lg-4">
              {values["reason-no-law-text"]}
            </p>
          </div>
        )}
      </div>
    );
  }
};

const Template = ({
  fields,
  form,
  node,
  values
}: {
  fields: Record<string, FieldT>;
  form: FormT;
  node: GetNode_latest_published;
  values: Record<string, string>;
}) => {
  return (
    <div>
      <p className="w-paragraph neutral-1-color-b6">
        redatta il {format(node.updated_at, "DD.MM.YYYY")}
      </p>
      {form.sections!.map(section => {
        if (!section) {
          return null;
        }
        return (
          <div key={`${section.title}`}>
            {section.title && (
              <h2 className="h3 mb-2 mb-lg-4">{section.title}</h2>
            )}

            {section.name === "section-0" && (
              <p className="w-paragraph neutral-1-color-b6">
                <strong>
                  {get(
                    node,
                    n => n.node_revision_group.group_ipa_pa.des_amm,
                    ""
                  )}
                </strong>{" "}
                si impegna a rendere{" "}
                <strong>
                  {values["device-type"] === "website"
                    ? "il sito web"
                    : "l'applicazione mobile"}{" "}
                </strong>
                “
                <a
                  href={
                    values["device-type"] === "website"
                      ? values["website-url"]
                      : values["app-url"]
                  }
                  className="font-weight-bold"
                >
                  {values["device-type"] === "website"
                    ? values["website-name"]
                    : values["app-name"]}
                </a>
                ” accessibile, conformemente alla normativa nazionale che ha
                recepito la direttiva (UE) 2016/2102 del Parlamento europeo e
                del Consiglio. La presente dichiarazione di accessibilità si
                applica a siti web e applicazioni mobile omnis voluptas
                assumenda est, omnis dolor repellendus.
              </p>
            )}

            {section.name !== "section-0" && section.description && (
              <p className="w-paragraph neutral-1-color-b6">
                {section.description}
              </p>
            )}

            {section.groups!.map(group =>
              group && group.name && Groups[group.name]
                ? Groups[group.name]({ group, values, fields })
                : null
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Template;
