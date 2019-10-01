import { graphql, Link } from "gatsby";
import * as React from "react";
import { useTranslation } from "react-i18next";
import SEO from "../components/Seo";
import StaticLayout from "../components/StaticLayout";
import { ActionsPageConfig } from "../generated/graphql/ActionsPageConfig";

const getForms = (data: ActionsPageConfig) => data.forms!.edges;

const ActionsPage = ({ data }: { data: ActionsPageConfig }) => {
  const { t } = useTranslation();
  return (
    <StaticLayout title={t("pages.action_page_title")}>
      <SEO title={t("pages.action_page_title")} />
      <ul>
        {getForms(data).map(({ node }) => {
          return (
            <li key={node.id}>
              <Link to={`/form/${node.id}`}>{node.name}</Link>
            </li>
          );
        })}
      </ul>
    </StaticLayout>
  );
};

export const query = graphql`
  query ActionsPageConfig {
    forms: allFormYaml(filter: { enabled: { eq: true } }) {
      edges {
        node {
          id
          version
          name
        }
      }
    }
  }
`;

export default ActionsPage;
