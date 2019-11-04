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
      <div className="row">
        {getForms(data).map(({ node }) => {
          return (
            <div className="col-12 col-lg-4" key={node.id}>
              <div className="card-wrapper">
                <div className="card">
                  <div className="card-body">
                    <p className="card-category font-variant-small-caps">
                      {node.category}
                    </p>
                    <h5 className="card-title">
                      <Link to={`/doc/${node.id}/`}>{node.action}</Link>
                    </h5>
                    <p className="card-text">{node.description}</p>
                    <p>
                      <Link to={`/form/${node.id}`} className="card-title">
                        {t("pages.action_goto_form")}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
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
          description
          category
          action
        }
      }
    }
    allMenuYaml {
      ...ContextualMenuFragment
    }
  }
`;

export default ActionsPage;
