import * as Yup from "yup";

import { ItLocale } from "../utils/yup_locale_it";

import { FormikErrors, FormikProps } from "formik";

import { PatternString } from "italia-ts-commons/lib/strings";
import {
  FormSchemaFragment_edges_node,
  FormSchemaFragment_edges_node_sections,
  FormSchemaFragment_edges_node_sections_groups,
  FormSchemaFragment_edges_node_sections_groups_fields
} from "../generated/graphql/FormSchemaFragment";

Yup.setLocale(ItLocale);

const GROUP_FIELD_PATTERN_STR = "^(.+)\\.([0-9]+)\\.(.+)$";
const GROUP_FIELD_PATTERN = PatternString(GROUP_FIELD_PATTERN_STR);

export const isGroupField = (name: any): name is typeof GROUP_FIELD_PATTERN =>
  typeof name === "string" && GROUP_FIELD_PATTERN.is(name);

/**
 * @return array [ groupName, index, fieldName ]
 */
export const getFieldNameParts = (name: typeof GROUP_FIELD_PATTERN) => {
  const groupName = GROUP_FIELD_PATTERN.decode(name).getOrElseL(() => {
    // cannot happen
    throw new Error("invalid group name");
  });
  const matches = groupName.match(GROUP_FIELD_PATTERN_STR);
  if (!matches) {
    // cannot happen
    throw new Error("invalid group name");
  }
  return matches.slice(1);
};

export const isEmptyField = (value: any) =>
  value === undefined || value === null || value === "";

export interface FormValuesT {
  [k: string]: any;
}

export type FormT = FormSchemaFragment_edges_node;
export type FormsectionT = FormSchemaFragment_edges_node_sections;
export type FormGroupT = FormSchemaFragment_edges_node_sections_groups;
export type FieldT = FormSchemaFragment_edges_node_sections_groups_fields;

export type FormFieldPropsT = {
  field: FieldT;
  form: FormikProps<FormValuesT>;
  isHidden: boolean;
  isRequired: boolean;
  validationExpression: any;
  valueExpression: any;
};

export const validateField = (
  isRequired: boolean,
  validationExpression: any,
  field: FieldT,
  form: FormikProps<FormValuesT>
) =>
  isRequired || validationExpression
    ? (value: any) =>
        Promise.resolve()
          .then(() => {
            if (isRequired && isEmptyField(value)) {
              // tslint:disable-next-line: no-string-throw
              throw "Campo richiesto";
            }
            return validationExpression
              ? validationExpression({
                  Yup,
                  value,
                  ...form.values
                })
              : true;
          })
          .then(validationResult => {
            // returns custom error message if validation fails
            return validationResult === false
              ? field.error_msg || "validation error"
              : null;
          })
          .catch(e => {
            // prints custom or default error message
            return (
              field.error_msg ||
              (e.errors && e.errors.join ? e.errors.join(", ") : e.toString())
            );
          })
    : () => Promise.resolve(null);

/**
 * Flatten and rename fields that belog to a group
 *
 * ie. group[0][fielName] => { fieldName: group.0.fieldname }
 */
export function getGroupFields(group: FormGroupT) {
  return group.fields && group.repeatable
    ? (group.fields as ReadonlyArray<FieldT>).map(field =>
        field ? { ...field, name: `${group.name}.0.${field.name}` } : ""
      )
    : group.fields || [];
}

/**
 * Flatten form fields into a plain array
 */
export function getFormFields(form: FormT) {
  if (!form.sections || !form.sections[0]) {
    return [];
  }
  return (form.sections as ReadonlyArray<FormsectionT>).reduce(
    (prevSection: ReadonlyArray<FieldT>, curSection: FormsectionT) => {
      return curSection && curSection.groups
        ? [
            ...prevSection,
            ...curSection.groups.reduce(
              (prevGroup, curGroup) =>
                curGroup && curGroup.fields
                  ? ([
                      ...prevGroup,
                      ...getGroupFields(curGroup)
                    ] as ReadonlyArray<FieldT>)
                  : prevGroup,
              [] as ReadonlyArray<FieldT>
            )
          ]
        : prevSection;
    },
    [] as ReadonlyArray<FieldT>
  );
}

/**
 * Flatten form fields into array considering field groups
 */
export function flattenFormErrors(
  errors: Record<string, any>
): Record<string, string> {
  return Object.keys(errors).reduce(
    (prevErrors: Record<string, string>, fieldName: string) => {
      if (!fieldName || !errors[fieldName]) {
        return prevErrors;
      }
      if (Array.isArray(errors[fieldName])) {
        const group: ReadonlyArray<any> = errors[fieldName];
        return {
          ...prevErrors,
          ...group.reduce(
            (
              prevGroupField: Record<string, string>,
              groupField: any,
              index: number
            ) => ({
              ...prevGroupField,
              ...Object.keys(groupField).reduce(
                (prevObjField, groupFieldKey) => ({
                  ...prevObjField,
                  [`${fieldName}.${index}.${groupFieldKey}`]: errors[fieldName]
                }),
                {} as Record<string, string>
              )
            }),
            {} as Record<string, string>
          )
        };
      }
      if (typeof errors[fieldName] === "string") {
        return {
          ...prevErrors,
          [fieldName]: errors[fieldName]
        };
      }
      return prevErrors;
    },
    {} as Record<string, string>
  );
}
