import * as React from "react";

import { Field, getIn } from "formik";
import {
  SingleUpload,
  SingleUploadVariables
} from "../generated/graphql/SingleUpload";
import { UPLOAD_FILE } from "../graphql/uploads";
import { ErrorMessage } from "./ErrorMessage";
import { FieldDescription } from "./FieldDescription";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

import { CustomInputComponent } from "./FormField";

import { Mutation } from "react-apollo";
import { useTranslation } from "react-i18next";
import {
  FormFieldPropsT,
  getEmptyValue,
  isEmptyFieldValue,
  validateField
} from "../utils/forms";

export const FileField = ({
  field,
  form,
  isHidden,
  isDisabled,
  isRequired,
  validationExpression,
  hasError
}: FormFieldPropsT) => {
  const { t } = useTranslation();

  // reset field values in case it's disabled or hidden
  React.useEffect(() => {
    if (
      (isHidden || isDisabled) &&
      !isEmptyFieldValue(getIn(form.values, `${field.name}[id]`))
    ) {
      form.setFieldValue(`${field.name}[id]`, "");
      form.setFieldValue(`${field.name}[version]`, "");
      form.setFieldValue(`${field.name}[node_type]`, "");
    }
  });

  return field.name ? (
    <Mutation<SingleUpload, SingleUploadVariables>
      mutation={UPLOAD_FILE}
      onCompleted={data => {
        form.setFieldValue(`${field.name}[0][id]`, data.singleUpload.id);
        form.setFieldValue(
          `${field.name}[0][version]`,
          data.singleUpload.version
        );
        form.setFieldValue(
          `${field.name}[0][filename]`,
          data.singleUpload.filename
        );
        form.setFieldValue(
          `${field.name}[0][mime_type]`,
          data.singleUpload.mimetype
        );
        form.setFieldValue(`${field.name}[0][node_type]`, "file");
      }}
    >
      {(singleUpload, { error, loading, data }) => {
        const value = getIn(form.values, field.name || "");

        if (error && !form.errors[field.name!]) {
          form.setFieldError(field.name!, JSON.stringify(error));
        }

        if (loading) {
          return (
            <div>
              <div>
                <Label
                  fieldName={field.name!}
                  title={field.title!}
                  isRequired={isRequired}
                />
              </div>
              <p>{t("loading_data")}</p>
            </div>
          );
        }

        if (data) {
          return (
            <div>
              <Label
                fieldName={field.name!}
                title={field.title!}
                isRequired={isRequired}
              />
              <p>{data.singleUpload.filename}</p>
            </div>
          );
        }

        return field.name ? (
          <FormGroup
            key={field.name}
            isHidden={isHidden}
            fieldName={field.name}
            hasError={hasError}
          >
            <Label
              fieldName={field.name}
              title={field.title!}
              isRequired={isRequired}
            />
            <Field
              id={field.name}
              name={field.name}
              type="file"
              accept={field.accept || "*/*"}
              required={isRequired}
              disabled={isDisabled}
              component={CustomInputComponent}
              className="pl-0 mt-2 font-size-xs"
              validate={validateField(
                isRequired,
                validationExpression,
                field,
                form
              )}
              capture={true}
              multiple={false}
              value={isHidden || isDisabled ? getEmptyValue(field) : value}
              onChange={async (e: any) => {
                const file = e.currentTarget.files[0];
                if (field.max_size && file.size > field.max_size) {
                  form.setFieldError(
                    field.name!,
                    t("errors.file_too_large", {
                      size: Math.round(file.size / 1000),
                      maxSize: Math.round(field.max_size / 1000)
                    })
                  );
                  return;
                }
                await singleUpload({
                  variables: { file },
                  context: {
                    clientName: "upload"
                  }
                });
              }}
            />
            <ErrorMessage name={field.name} />
            {field.description && (
              <FieldDescription description={field.description} />
            )}
          </FormGroup>
        ) : null;
      }}
    </Mutation>
  ) : null;
};
