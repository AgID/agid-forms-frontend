import * as Yup from "yup";

import { ItLocale } from "../utils/yup_locale_it";

import { FormikProps } from "formik";

import { format } from "date-fns";
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

/*
 *  Used to get field templates for repeatable fields groups.
 */
export const toFirstGroupFieldName = (name: typeof GROUP_FIELD_PATTERN) => {
  const [groupName, , fieldName] = getFieldNameParts(name);
  return [groupName, "0", fieldName].join(".");
};

export const isEmptyFieldValue = (value: any) =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

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
  isDisabled: boolean;
  isRequired: boolean;
  validationExpression: any;
  valueExpression: any;
  hasError: boolean;
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
            if (isRequired && isEmptyFieldValue(value)) {
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
export function flattenFormFields(form: FormT) {
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
 * Flatten form fields into a plain object
 */
export function flattenFormFieldsWithKeys(form: FormT): Record<string, FieldT> {
  const fields = flattenFormFields(form);
  return fields.reduce(
    (prev, cur) => (cur && cur.name ? { ...prev, [cur.name]: cur } : prev),
    {} as Record<string, FieldT>
  );
}

/**
 * Flatten form errors into an array considering field groups
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
                  [`${fieldName}.${index}.${groupFieldKey}`]: errors[fieldName][
                    index
                  ][groupFieldKey]
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

/**
 * Flatten form values into array considering field groups
 */
export function flattenFormValues(
  values: Record<string, any>
): Record<string, string> {
  return Object.keys(values).reduce(
    (prevValues: Record<string, string>, fieldName: string) => {
      if (
        !fieldName ||
        values[fieldName] === null ||
        values[fieldName] === undefined
      ) {
        return prevValues;
      }
      if (
        // TODO: replace this heuristic check:
        // a group is a multidimensional array while a plain array
        // could be the value of a multiple checkbox / select field.
        Array.isArray(values[fieldName]) &&
        Array.isArray(values[fieldName][0])
      ) {
        const group: ReadonlyArray<any> = values[fieldName];
        return {
          ...prevValues,
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
                  [`${fieldName}.${index}.${groupFieldKey}`]: values[fieldName][
                    index
                  ][groupFieldKey].toString()
                }),
                {} as Record<string, string>
              )
            }),
            {} as Record<string, string>
          )
        };
      }
      if (
        typeof values[fieldName] === "string" ||
        typeof values[fieldName] === "number"
      ) {
        return {
          ...prevValues,
          [fieldName]: values[fieldName].toString()
        };
      }
      // multiple select / checkboxes
      if (Array.isArray(values[fieldName])) {
        return {
          ...prevValues,
          [fieldName]: values[fieldName].map((v: any) => v.toString())
        };
      }
      return prevValues;
    },
    {} as Record<string, string>
  );
}

export function getEmptyValue(field: FieldT) {
  if (field.widget === "checkbox" && field.options) {
    return [];
  }
  return "";
}

export function getDefaultValue(field: FieldT) {
  if (field.default_multiple_selection) {
    return field.default_multiple_selection as ReadonlyArray<string>;
  }
  if (field.name && field.default_checked) {
    return field.name;
  }
  if (field.default !== undefined && field.default !== null) {
    return field.default;
  }
  return getEmptyValue(field);
}

export function getFieldValueForView({
  field,
  value
}: {
  field: FieldT;
  value: string;
}): string | null {
  switch (field.widget) {
    case "date":
      return format(new Date(value), "DD.MM.YYYY");
    case "checkbox":
      if (!Array.isArray(value)) {
        // TODO: localize
        return value ? "si" : "no";
      } else {
        return value.join(", ");
      }
      break;
    case "select":
      if (Array.isArray(field.options)) {
        const selectedItem = field.options.find(o => o.value === value);
        if (selectedItem) {
          return selectedItem.label;
        }
      }
      break;
    case "html":
      return field.default;
  }
  return value;
}

/*
 *  Works for radio buttons.
 */
export function getSelectedLabel(field: FieldT, value: string) {
  const selectedItem = field.options
    ? field.options.find(o => o && o.value === value)
    : null;
  return selectedItem ? selectedItem.label : null;
}
