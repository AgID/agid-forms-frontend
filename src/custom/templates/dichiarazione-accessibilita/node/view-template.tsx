/**
 * Template for node of type "dichiarazione-accessibilità".
 *
 * TODO: multilang
 */
import { format } from "date-fns";
import * as React from "react";

import FormGroupTitle from "../../../../components/FormGroupTitle";
import ViewGroup from "../../../../components/ViewGroup";
import { GetNode_latest_published } from "../../../../generated/graphql/GetNode";
import {
  FieldT,
  FormGroupT,
  FormT,
  getSelectedLabel
} from "../../../../utils/forms";
import { get } from "../../../../utils/safe_access";

const InlineViewGroup = ({
  group,
  values
}: {
  group: FormGroupT;
  values: Record<string, string>;
  inline?: boolean;
}) => ViewGroup({ group, values, inline: true });

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

const Groups: Record<
  string,
  ({
    group,
    values,
    fields,
    node
  }: {
    group: FormGroupT;
    values: Record<string, string>;
    fields: Record<string, FieldT>;
    node: GetNode_latest_published;
  }) => JSX.Element
> = {
  "content-compliance": ({ group, values }) => {
    return (
      <div className="mb-lg-5">
        <FormGroupTitle title={group.title} />
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
    const accessibilityFields: ReadonlyArray<any> = [
      "reason-42004",
      "reason-disproportionate-burden",
      "reason-no-law"
    ];
    const hasInaccessibleContent = accessibilityFields
      .map(fieldName => values[fieldName])
      .some(_ => _);
    return (
      <div className="mb-lg-5">
        <FormGroupTitle title={group.title} />
        {hasInaccessibleContent && (
          <p className="w-paragraph">
            I contenuti di seguito elencati non sono accessibili per i seguenti
            motivi:
          </p>
        )}
        {accessibilityFields.map(
          fieldName =>
            values[fieldName] && (
              <div key={fieldName} className="mb-4">
                <p className="w-paragraph font-weight-bold neutral-2-color-b5 mb-2">
                  {fields[fieldName].title}
                </p>
                <p className="w-paragraph pl-lg-4">
                  {values[`${fieldName}-text`]}
                </p>
              </div>
            )
        )}
      </div>
    );
  },
  "content-alt": ({ group, values }) =>
    values["accessible-alternatives"] ? (
      <div className="mb-lg-5">
        <FormGroupTitle title={group.title} />
        <p className="w-paragraph">{values["accessible-alternatives"]}</p>
      </div>
    ) : (
      <></>
    ),
  "content-methodology": ({ group, values, fields, node }) => {
    return (
      <div className="mb-lg-5">
        <FormGroupTitle title={group.title} />
        <p className="w-paragraph">
          La dichiarazione è stata effettuata utilizzando{" "}
          <strong>
            {getSelectedLabel(fields.methodology, values.methodology)}
          </strong>{" "}
          {values["methodology-details"] && "mediante"}{" "}
          <strong>
            {getSelectedLabel(
              fields["methodology-details"],
              values["methodology-details"]
            )}
          </strong>{" "}
          e aggiornata il {format(node.updated_at, "DD.MM.YYYY")} a seguito di
          una revisione sostanziale{" "}
          {values["device-type"] === "website"
            ? "del sito web"
            : "dell'applicazione mobile"}
          .
        </p>
      </div>
    );
  },
  "feedback-and-contacts": ViewGroup,
  "implementation-procedure": ViewGroup,
  "application-information": InlineViewGroup,
  "application-org": InlineViewGroup,
  "application-manager": ({ group, values, fields }) => {
    return (
      <div className="mb-lg-5">
        <FormGroupTitle title={group.title} />
        <p className="w-paragraph">
          {group.title}{" "}
          <strong>
            {values["manager-present"] ? "" : "non"}{" "}
            {fields["manager-present"].title}
          </strong>{" "}
          e{values["manager-appointed"] ? "d" : ""}
          <strong>
            {values["manager-appointed"] ? "" : " non"}{" "}
            {fields["manager-appointed"].title}
          </strong>
        </p>
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
    <div className="px-lg-5 py-lg-4">
      <p className="w-paragraph neutral-2-color-b5">
        redatta il {format(node.updated_at, "DD.MM.YYYY")}
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

            {section.name === "section-0" && (
              <p className="w-paragraph neutral-2-color-b5 pb-5">
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

            {section.groups!.map(group => {
              const GroupEl =
                group && group.name ? Groups[group.name] : undefined;
              return group && group.name && GroupEl ? (
                <GroupEl
                  group={group}
                  values={values}
                  fields={fields}
                  node={node}
                  key={group.name}
                />
              ) : null;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Template;
