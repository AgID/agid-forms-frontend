import i18next from "i18next";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { ApolloErrorsT, isTooManyRequestError } from "../utils/errors";

const getErrorString = (
  translate: i18next.TFunction,
  errors: ApolloErrorsT
) => {
  if (isTooManyRequestError(errors)) {
    return translate("errors.too_many_requests");
  }
  return JSON.stringify(errors);
};

export default function ApolloErrors({ errors }: { errors: any }) {
  const { t: translate } = useTranslation();
  const errorString = getErrorString(translate, errors);
  return errorString ? (
    <span className="apollo-errors">{errorString}</span>
  ) : null;
}
