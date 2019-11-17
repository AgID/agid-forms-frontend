import { Link } from "gatsby";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Loadable from "react-loadable";
import { GetNode_published } from "../generated/graphql/GetNode";
import {
  FieldT,
  flattenFormFieldsWithKeys,
  flattenFormValues,
  FormT,
  isGroupField,
  toFirstGroupFieldName
} from "../utils/forms";

const getViewfield = (fieldName: string, field: FieldT, value: string) => {
  return field && fieldName ? (
    <tr key={fieldName} className="mb-4">
      <th scope="row">
        {field.title || field.name} - {fieldName}
      </th>
      <td>{value.toString()}</td>
    </tr>
  ) : null;
};

const renderViewFields = (
  fields: Record<string, FieldT>,
  values: Record<string, string>
): ReadonlyArray<JSX.Element | null> => {
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
        [] as ReadonlyArray<JSX.Element | null>
      )
    : [];
};

type LoadableViewProps = {
  node: GetNode_published;
  form: FormT;
  values: Record<string, string>;
  publishedVersion?: number;
  ctaClicked: boolean;
  setCtaClicked: React.Dispatch<React.SetStateAction<boolean>>;
  links: ReadonlyArray<{ to: string; title: string }>;
};

export type LoadableViewTemplateProps = LoadableViewProps & {
  fields: Record<string, FieldT>;
};

const LoadableView = ({
  node,
  form,
  values,
  publishedVersion,
  ctaClicked,
  setCtaClicked,
  links
}: LoadableViewProps) => {
  const { t } = useTranslation();

  const flattenedFields = flattenFormFieldsWithKeys(form);
  const flattenedValues = flattenFormValues(values);

  const LoadableTemplate = Loadable({
    loader: () => import(`../custom/templates/${form.id}/node/view-template`),
    render: (loaded, _) => {
      const Template = loaded.default;
      return (
        <Template
          links={links}
          form={form}
          node={node}
          fields={flattenedFields}
          values={flattenedValues}
          publishedVersion={publishedVersion}
          ctaClicked={ctaClicked}
          setCtaClicked={setCtaClicked}
        />
      );
    },
    loading: ({ error: templateError }) => {
      return templateError ? (
        <>
          <table className="table table-hover table-bordered table-striped">
            <tbody>{renderViewFields(flattenedFields, flattenedValues)}</tbody>
          </table>
          <div className="text-center">
            {links.map(link => (
              <div className="btn btn-outline-primary mt-4 mx-4" key={link.to}>
                <Link to={link.to} className="text-decoration-none">
                  {link.title}
                </Link>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>{t("loading_data")}</p>
      );
    }
  });

  return <LoadableTemplate />;
};

export default LoadableView;
