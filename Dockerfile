FROM circleci/node:8.11.3 as builder

ARG HASURA_GRAPHQL_ENDPOINT
ARG HASURA_GRAPHQL_ADMIN_SECRET

ARG GATSBY_BACKEND_ENDPOINT
ARG GATSBY_HASURA_GRAPHQL_ENDPOINT
ARG GATSBY_UPLOAD_ENDPOINT

ARG GOOGLE_ANALYTICS_TRACKING_ID
ARG GATSBY_SENTRY_DSN

RUN sudo apt-get -y install --no-install-recommends libunwind8=1.1-3.2

WORKDIR /usr/src/app

RUN sudo chown circleci -R /usr/src/app

COPY yarn.lock package.json /usr/src/app/
RUN yarn install

COPY /src /usr/src/app/src
COPY /data /usr/src/app/data
COPY /static /usr/src/app/static

# COPY /patches /usr/src/app/patches

COPY tsconfig.json \
  apollo.config.js \
  api_backend.graphql \
  upload_server.graphql \
  gatsby-browser.js \
  gatsby-config.js \
  gatsby-node.js \
  gatsby-ssr.js \
  /usr/src/app/

RUN sudo chmod 777 -R /usr/src/app/src

RUN  yarn generate \
  && yarn build

## SERVE STATIC CONTENT

FROM gatsbyjs/gatsby:latest
COPY --from=builder /usr/src/app/public /pub
COPY nginx.conf /etc/nginx/server.conf

# may be overridden in .env
ENV HTTP_PORT 80
ENV CACHE_PUBLIC_EXPIRATION 30d
ENV CACHE_IGNORE "none"

EXPOSE ${HTTP_PORT}
