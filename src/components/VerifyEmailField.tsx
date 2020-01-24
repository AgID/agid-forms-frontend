import * as React from "react";

import { useMutation } from "@apollo/react-hooks";
import { Field, getIn } from "formik";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";
import {
  PostAuthEmailCode,
  PostAuthEmailCodeVariables
} from "../generated/graphql/PostAuthEmailCode";
import {
  PostAuthLoginEmailCode,
  PostAuthLoginEmailCodeVariables
} from "../generated/graphql/PostAuthLoginEmailCode";
import { GET_SECRET_EMAIL, GET_TOKENS_EMAIL } from "../graphql/backend";
import { isLoggedIn, storeSessionInfo, storeTokens } from "../utils/auth";
import { isNetworkError } from "../utils/errors";
import { FormFieldPropsT, isEmptyFieldValue } from "../utils/forms";
import ApolloErrors from "./ApolloErrors";
import { ErrorBox, ErrorMessage } from "./ErrorMessage";
import { FieldDescription } from "./FieldDescription";
import { CustomInputComponent } from "./FormField";
import { FormGroup } from "./FormGroup";
import { Label } from "./Label";

const VerifyEmailTextField = ({
  emailAddress,
  field,
  form,
  hasError,
  isHidden
}: FormFieldPropsT & { emailAddress: string }) => {
  const { t } = useTranslation();

  const [postAuthLoginEmailCode, { loading, error, data }] = useMutation<
    PostAuthLoginEmailCode,
    PostAuthLoginEmailCodeVariables
  >(GET_TOKENS_EMAIL);

  const vrfyFieldName = `${field.name}_verify`;
  const vrfyFieldValue = getIn(form.values, vrfyFieldName);

  if (error && !form.errors[field.name!]) {
    if (isNetworkError(error, 403)) {
      form.setFieldError(field.name!, t("auth.wrong_password"));
    }
    form.setFieldError(field.name!, JSON.stringify(error));
  }

  if (loading) {
    return <p>{t("loading_data")}</p>;
  }

  if (data) {
    storeTokens(
      data.post_auth_login_email_code.backend_token,
      data.post_auth_login_email_code.graphql_token
    );
    storeSessionInfo({
      userId: data.post_auth_login_email_code.user.id,
      userEmail: data.post_auth_login_email_code.user.email,
      roles: data.post_auth_login_email_code.user.roles
    });
    form.setFieldValue(field.name!, data.post_auth_login_email_code.user.email);
    return <p className="alert alert-info">{t("auth.email_verified")}</p>;
  }

  const isVrfyCtaDisabled: boolean =
    isEmptyFieldValue(vrfyFieldValue) ||
    hasError ||
    form.errors[vrfyFieldName] !== undefined;

  return !data && field.name ? (
    <FormGroup
      key={vrfyFieldName}
      fieldName={vrfyFieldName}
      hasError={hasError}
      isHidden={isHidden}
    >
      <Label
        fieldName={vrfyFieldName}
        title={t("auth.verify_email_text")}
        isRequired={true}
      />
      <Field
        id={vrfyFieldName}
        name={vrfyFieldName}
        required={true}
        component={CustomInputComponent}
        className="pl-0 mt-2 font-size-xs"
        value={vrfyFieldValue}
      />
      <Button
        className="mt-3"
        required={true}
        disabled={isVrfyCtaDisabled}
        onClick={async (e: React.SyntheticEvent<HTMLInputElement>) => {
          e.preventDefault();
          await postAuthLoginEmailCode({
            variables: {
              body: {
                email: emailAddress,
                secret: vrfyFieldValue
              }
            }
          });
          return false;
        }}
      >
        {t("auth.verify_token_text")}
      </Button>
      {error && (
        <ErrorBox>
          {isNetworkError(error, 403) ? (
            <span>{t("auth.wrong_password")}</span>
          ) : (
            <ApolloErrors errors={error} />
          )}
        </ErrorBox>
      )}
    </FormGroup>
  ) : null;
};

export const VerifyEmailField = ({
  field,
  form,
  isHidden,
  isDisabled,
  isRequired,
  hasError,
  ...rest
}: FormFieldPropsT) => {
  const { t } = useTranslation();

  const [postAuthEmailCode, { loading, error, data }] = useMutation<
    PostAuthEmailCode,
    PostAuthEmailCodeVariables
  >(GET_SECRET_EMAIL);

  // only show for not logged in users
  if (isLoggedIn()) {
    form.unregisterField(field.name!);
    return null;
  }

  if (error && !form.errors[field.name!]) {
    form.setFieldError(field.name!, JSON.stringify(error));
  }

  if (loading) {
    return <p>{t("loading_data")}</p>;
  }

  if (!form.errors[field.name!]) {
    form.errors[field.name!] = t("auth.email_verification_required");
  }

  if (data) {
    return (
      <VerifyEmailTextField
        field={field}
        form={form}
        isHidden={isHidden}
        isDisabled={isDisabled}
        isRequired={isRequired}
        hasError={hasError}
        emailAddress={data.post_auth_email_email_code.email}
        {...rest}
      />
    );
  }

  const hasValidRef =
    form.touched[field.ref!] &&
    !form.errors[field.ref!] &&
    !isEmptyFieldValue(form.values[field.ref!]);

  const isCtaDisabled = isDisabled || !hasValidRef;

  return field.name ? (
    <FormGroup
      key={field.name}
      isHidden={isHidden}
      fieldName={field.name}
      hasError={hasError}
    >
      <Button
        required={isRequired}
        disabled={isCtaDisabled}
        onClick={async (e: React.SyntheticEvent) => {
          e.preventDefault();
          const emailAddress = getIn(form.values, field.ref!);
          await postAuthEmailCode({
            variables: {
              body: {
                email: emailAddress
              }
            }
          });
          return false;
        }}
      >
        {field.title}
      </Button>
      <ErrorMessage name={field.name} />
      {field.description && (
        <FieldDescription description={field.description} />
      )}
    </FormGroup>
  ) : null;
};
