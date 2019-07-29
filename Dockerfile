FROM circleci/node:8.11.3 as builder

ARG HASURA_GRAPHQL_ENDPOINT
ARG HASURA_GRAPHQL_ADMIN_SECRET

RUN sudo apt-get -y install --no-install-recommends libunwind8=1.1-3.2

WORKDIR /usr/src/app

COPY /src /usr/src/app/src
COPY /data /usr/src/app/data
COPY /static /usr/src/app/static

# COPY /patches /usr/src/app/patches

COPY /package.json /usr/src/app/package.json
COPY /tsconfig.json /usr/src/app/tsconfig.json
COPY /yarn.lock /usr/src/app/yarn.lock

COPY /apollo.config.js /usr/src/app/apollo.config.js
COPY /api_backend.graphql /usr/src/app/api_backend.graphql

COPY /gatsby-browser.js /usr/src/app/gatsby-browser.js
COPY /gatsby-config.js /usr/src/app/gatsby-config.js
COPY /gatsby-node.js /usr/src/app/gatsby-node.js
COPY /gatsby-ssr.js /usr/src/app/gatsby-ssr.js

# generated running "gatsby develop"
COPY /gatsby-schema.json /usr/src/app/gatsby-schema.json

RUN sudo chmod -R 777 /usr/src/app \
  && yarn install \
  && yarn generate \
  && yarn clean \
  && yarn build

# ## SERVE STATIC CONTENT

FROM bitnami/nginx:1.16
COPY --from=builder /usr/src/app/public /app
EXPOSE 80
