FROM circleci/node:10.18.1-buster as builder

ARG HASURA_GRAPHQL_ENDPOINT
ARG HASURA_GRAPHQL_ADMIN_SECRET

ARG GATSBY_BACKEND_ENDPOINT
ARG GATSBY_HASURA_GRAPHQL_ENDPOINT
ARG GATSBY_UPLOAD_ENDPOINT

ARG GOOGLE_ANALYTICS_TRACKING_ID
ARG GATSBY_SENTRY_DSN

# ie. "default-src 'self' 'unsafe-inline' data:; frame-ancestors 'self'; object-src 'none'"
ARG CORS

RUN sudo apt-get -y install --no-install-recommends gettext-base

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

COPY nginx.conf /tmp/nginx.template
RUN envsubst '${CORS}' < /tmp/nginx.template > /usr/src/app/nginx.conf

## SERVE STATIC CONTENT

FROM gatsbyjs/gatsby:latest
COPY --from=builder /usr/src/app/public /pub
COPY --from=builder /usr/src/app/nginx.conf /etc/nginx/server.conf

# may be overridden in .env
ENV HTTP_PORT 80
ENV CACHE_PUBLIC_EXPIRATION 30d
ENV CACHE_IGNORE "none"

EXPOSE ${HTTP_PORT}
