import * as React from "react";
import { useTranslation } from "react-i18next";
import * as Loadable from "react-loadable";
import { GetNode_latest_published } from "../generated/graphql/GetNode";
import {
  FieldT,
  flattenFormFieldsWithKeys,
  flattenFormValues,
  FormT,
  isGroupField,
  toFirstGroupFieldName
} from "../utils/forms";

const getViewfield = (fieldName: string, field: FieldT, value: string) => {
  return fieldName ? (
    <tr key={fieldName} className="mb-4">
      <th scope="row">{field.title || field.name}</th>
      <td>{value.toString()}</td>
    </tr>
  ) : (
    <></>
  );
};

const renderViewFields = (
  fields: Record<string, FieldT>,
  values: Record<string, string>
): readonly JSX.Element[] => {
  return fields && values
    ? Object.keys(values).reduce(
        (prev, valueKey) =>
          valueKey
            ? [
                ...prev,
                getViewfield(
                  valueKey,
                  isGroupField(valueKey)
                    ? fields[toFirstGroupFieldName(valueKey)]
                    : fields[valueKey],
                  values[valueKey]
                )
              ]
            : prev,
        [] as readonly JSX.Element[]
      )
    : [];
};

const LoadableView = ({
  node,
  form,
  values
}: {
  node: GetNode_latest_published;
  form: FormT;
  values: Record<string, string>;
}) => {
  const { t } = useTranslation();

  const flattenedFields = flattenFormFieldsWithKeys(form);
  const flattenedValues = flattenFormValues(values);

  const LoadableTemplate = Loadable({
    loader: () => import(`../custom/templates/${form.id}/node/view-template`),
    render: (loaded, _) => {
      const Template = loaded.default;
      return (
        <Template
          form={form}
          node={node}
          fields={flattenedFields}
          values={flattenedValues}
        />
      );
    },
    loading: ({ error: templateError }) => {
      return templateError ? (
        <table className="table table-hover table-bordered table-striped">
          <tbody>{renderViewFields(flattenedFields, flattenedValues)}</tbody>
        </table>
      ) : (
        <p>{t("loading_data")}</p>
      );
    }
  });

  return <LoadableTemplate />;
};

export default LoadableView;
