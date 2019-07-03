import * as t from "io-ts";

const NetworkError = t.interface({
  response: t.unknown,
  statusCode: t.Int,
  result: t.string
});

const GraphqlError = t.interface({});

export const ApolloErrorsT = t.interface({
  graphQLErrors: t.readonlyArray(GraphqlError),
  networkError: NetworkError
});
export type ApolloErrorsT = t.TypeOf<typeof ApolloErrorsT>;

export function isTooManyRequestError(err: any) {
  return (
    ApolloErrorsT.is(err) &&
    err.networkError &&
    err.networkError.statusCode === 429
  );
}
