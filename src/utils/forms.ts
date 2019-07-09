import * as Yup from "yup";

import { ItLocale } from "../utils/yup_locale_it";

import { FormikProps } from "formik";

import { PatternString } from "italia-ts-commons/lib/strings";
import {
  FormConfig_allFormYaml_edges_node,
  FormConfig_allFormYaml_edges_node_sections_groups_fields
} from "../generated/graphql/FormConfig";

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

export type FieldT = FormConfig_allFormYaml_edges_node_sections_groups_fields;
export type FormT = FormConfig_allFormYaml_edges_node;

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
