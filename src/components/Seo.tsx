import { graphql, StaticQuery } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";
import { useTranslation } from "react-i18next";
import { getSiteConfig } from "../graphql/gatsby";

type SeoProps = {
  description?: string;
  lang?: string;
  meta?: ReadonlyArray<{
    name: string;
    content: string;
  }>;
  keywords?: string;
  title?: string;
};

function SEO({ description, meta = [], title, keywords }: SeoProps) {
  const { i18n } = useTranslation();

  return (
    <StaticQuery
      query={graphql`
        query SeoQuery {
          siteConfig: allConfigYaml(filter: { title: { ne: null } }) {
            ...SiteConfigFragment
          }
        }
      `}
      render={data => {
        const siteConfig = getSiteConfig(data);
        if (!siteConfig) {
          return "no site config found";
        }
        return (
          <Helmet
            title={title || siteConfig.title!}
            meta={[
              {
                name: `description`,
                content: description || (siteConfig.description || "")
              },
              {
                property: `og:title`,
                content: title
              },
              {
                property: `og:description`,
                content: description || (siteConfig.description || "")
              },
              {
                property: `og:type`,
                content: `website`
              },
              {
                name: `twitter:card`,
                content: `summary`
              },
              {
                name: `twitter:creator`,
                content: siteConfig.author || ""
              },
              {
                name: `twitter:title`,
                content: title
              },
              {
                name: `twitter:description`,
                content: description || (siteConfig.description || "")
              },
              {
                name: `keywords`,
                content: keywords || (siteConfig.keywords || "")
              }
            ].concat(meta)}
          >
            <html lang={i18n.language.split("-")[0]} />
          </Helmet>
        );
      }}
    />
  );
}

export default SEO;
