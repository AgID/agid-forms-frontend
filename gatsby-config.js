module.exports = {
  siteMetadata: {
    title: `Drupal Forms`,
    description: ``,
    author: `@gunzip`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png` // This path is relative to the root of the site.
      }
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    `gatsby-plugin-typescript`,
    {
      resolve: "gatsby-plugin-tslint",
      options: {
        project: "."
      }
    },
    `gatsby-transformer-yaml`,
    `gatsby-transformer-json`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: `gatsby-plugin-copy-files`,
      options: {
        source: `${__dirname}/src/images`,
        destination: "/images"
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: `markdown-pages`
      }
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/form/*`, `/view/*`] }
    },
    {
      resolve: "gatsby-plugin-extract-schema",
      options: {
        dest: `${__dirname}/gatsby-schema.json`
      }
    },
    {
      resolve: "gatsby-plugin-webpack-bundle-analyzer",
      options: {
        analyzerPort: 3000,
        production: true
      }
    }
  ]
};
