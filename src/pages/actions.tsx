import { graphql, Link, navigate } from "gatsby";
import * as React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from 'react-markdown';
import SEO from "../components/Seo";
import StaticLayout from "../components/StaticLayout";
import { ActionsPageConfig } from "../generated/graphql/ActionsPageConfig";
import { logout, isLoggedIn, getSessionInfo, userHasAnyRole, userBelongsToAnyGroups } from "../utils/auth";
import { GraphqlClient } from "../graphql/client";

const getForms = (data: ActionsPageConfig) => data.forms!.edges;

const ActionsPage = ({ data }: { data: ActionsPageConfig }) => {
  if (isLoggedIn()) {
    // navigate(homepage);
    logout(GraphqlClient)
      .then(() => navigate("/"))
      .catch(() => navigate("/"));
    return null;
  }

  navigate("/");
  return null;

  const { t } = useTranslation();
  return (
    <StaticLayout title={t("pages.action_page_title")}>
      <SEO title={t("pages.action_page_title")} />
      <div className="row">
        {getForms(data).map(({ node }) => node)
          .sort((firstNode, secondNode) => { return firstNode.home_order! - secondNode.home_order! })
          .map((node) => {
          if (!userHasAnyRole(getSessionInfo(), node.listed_to as ReadonlyArray<string>)) {
            return null;
          }
          if (node.listed_to_groups && !userBelongsToAnyGroups(getSessionInfo(), node.listed_to_groups as ReadonlyArray<string>)) {
            return null;
          }
          return (
            <div className="col-12 col-lg-4" key={node.id}>
              <div className="card-wrapper">
                <div className="card">
                  <div className="card-body">
                    <p className="card-category font-variant-small-caps">
                      {node.category}
                    </p>
                    <h5 className="card-title">
                      <Link to={node.title_link || `/doc/${node.id}/`}>{node.action}</Link>
                    </h5>
                    <p className="card-text">
                      <ReactMarkdown renderers={{paragraph: 'span'}}>
                        {node.description || ''}
                      </ReactMarkdown>
                    </p>
                    { node.hide_action_goto || (<p>
                      <Link to={`/form/${node.id}`}
                        className="card-title"
                        aria-label={t("pages.action_goto_form") + ": " + node.action}>
                        {t("pages.action_goto_form")}
                      </Link>
                    </p>)}
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
    forms: allFormYaml {
      edges {
        node {
          id
          version
          name
          description
          category
          action
          roles
          listed_to
          listed_to_groups
          home_order
          title_link
          hide_action_goto
        }
      }
    }
    allMenuYaml {
      ...ContextualMenuFragment
    }
  }
`;

export default ActionsPage;
