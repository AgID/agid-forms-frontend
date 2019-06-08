#!/bin/bash

if [ ! -f .env ]; then
  echo "env configuration needed"
  exit 10
fi

set -o allexport; source .env; set +o allexport

# gq $HASURA_GRAPHQL_ENDPOINT -H "X-Hasura-Admin-Secret: $HASURA_GRAPHQL_ADMIN_SECRET" --introspect > schema.graphql

yarn apollo client:codegen \
  --tag rest-api \
  --target typescript \
  --tagName=gql \
  --clientName GraphqlClient \
  --useReadOnlyTypes \
  --globalTypesFile=./src/generated/graphql/graphql_globals.ts \
  --outputFlat  ./src/generated/graphql

  # --passthroughCustomScalars
  # --customScalarsPrefix Agid  
  # --localSchemaFile=schema.graphql
