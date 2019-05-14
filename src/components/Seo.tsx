import { graphql, StaticQuery } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";

type SeoProps = {
  description?: string;
  lang?: string;
  meta: ReadonlyArray<{
    name: string;
    content: string;
  }>;
  keywords: ReadonlyArray<string>;
  title: string;
};

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;

function SEO({
  description,
  lang = "en",
  meta = [],
  title,
  keywords = []
}: SeoProps) {
  return (
    <StaticQuery
      query={detailsQuery}
      render={data => {
        const metaDescription =
          description || data.site.siteMetadata.description;
        return (
          <Helmet
            htmlAttributes={{
              lang
            }}
            title={title || "Guida dinamica Piano Triennale 2019-2021"}
            titleTemplate={`%s | ${data.site.siteMetadata.title}`}
            meta={[
              {
                name: `description`,
                content: metaDescription
              },
              {
                property: `og:title`,
                content: title
              },
              {
                property: `og:description`,
                content: metaDescription
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
                content: data.site.siteMetadata.author
              },
              {
                name: `twitter:title`,
                content: title
              },
              {
                name: `twitter:description`,
                content: metaDescription
              },
              {
                name: `keywords`,
                content: keywords || data.site.siteMetadata.keywords.join(`, `)
              }
            ].concat(meta)}
          >
            <html lang={lang} />
          </Helmet>
        );
      }}
    />
  );
}

export default SEO;
