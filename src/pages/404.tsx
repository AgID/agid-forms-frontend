import { graphql } from "gatsby";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import SEO from "../components/Seo";
import { NotFoundConfig } from "../generated/graphql/NotFoundConfig";
import { getMenu, getSiteConfig } from "../graphql/gatsby_fragments";

const NotFoundPage = ({ data }: { data: NotFoundConfig }) => {
  const { t } = useTranslation();
  const siteConfig = getSiteConfig(data);
  return (
    <Layout
      menu={getMenu(data)}
      siteConfig={siteConfig}
      title={t("pages.notfound_page_title")}
    >
      <SEO title={t("pages.notfound_page_title")} siteConfig={siteConfig} />
      <p>{t("pages.notfound_page_text")}</p>
    </Layout>
  );
};

export const query = graphql`
  query NotFoundConfig {
    menu: allConfigYaml(
      filter: { menu: { elemMatch: { name: { ne: null } } } }
    ) {
      ...PageConfigFragment
    }
    siteConfig: allConfigYaml(filter: { title: { ne: null } }) {
      ...SiteConfigFragment
    }
  }
`;

export default NotFoundPage;
