import * as t from "io-ts";

const NetworkError = t.partial({
  response: t.unknown,
  statusCode: t.Int,
  result: t.string
});

const GraphqlError = t.partial({
  extensions: t.partial({
    path: t.string,
    code: t.string
  }),
  message: t.string
});

export const ApolloErrorsT = t.partial({
  graphQLErrors: t.readonlyArray(GraphqlError),
  networkError: NetworkError,
  message: t.string
});
export type ApolloErrorsT = t.TypeOf<typeof ApolloErrorsT>;

export function isNetworkError(err: any, status: number) {
  return (
    ApolloErrorsT.is(err) &&
    err.networkError &&
    err.networkError.statusCode === status
  );
}

export function isJwtExpiredError(err: any) {
  return (
    ApolloErrorsT.is(err) &&
    err.graphQLErrors &&
    err.graphQLErrors[0] &&
    err.graphQLErrors[0].extensions &&
    err.graphQLErrors[0].extensions.code === "invalid-jwt"
  );
}
