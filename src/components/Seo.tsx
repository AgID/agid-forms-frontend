import * as React from "react";
import Helmet from "react-helmet";

type SeoProps = {
  siteConfig: any;
  description?: string;
  lang?: string;
  meta?: ReadonlyArray<{
    name: string;
    content: string;
  }>;
  keywords?: ReadonlyArray<string>;
  title: string;
};

function SEO({
  siteConfig,
  description,
  lang = "en",
  meta = [],
  title,
  keywords
}: SeoProps) {
  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={title || siteConfig.title}
      meta={[
        {
          name: `description`,
          content: description || siteConfig.description
        },
        {
          property: `og:title`,
          content: title
        },
        {
          property: `og:description`,
          content: description || siteConfig.description
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
          content: siteConfig.author
        },
        {
          name: `twitter:title`,
          content: title
        },
        {
          name: `twitter:description`,
          content: description || siteConfig.description
        },
        {
          name: `keywords`,
          content: keywords || siteConfig.keywords
        }
      ].concat(meta)}
    >
      <html lang={lang} />
    </Helmet>
  );
}

export default SEO;
