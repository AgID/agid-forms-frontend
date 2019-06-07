require("dotenv").config();

module.exports = {
  client: {
    service: {
      name: "hasura-graphql",
      url: process.env.HASURA_GRAPHQL_ENDPOINT,
      headers: {
        "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET
      }
    },
    includes: ["./src/**/*.{ts,tsx}"]
  }
};
