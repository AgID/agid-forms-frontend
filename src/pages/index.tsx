import * as React from "react";
import { useState } from "react";
import Layout from "../components/Layout";
import SEO from "../components/Seo";

import { graphql } from "gatsby";

import { Form, FormGroup, Input, Label } from "reactstrap";

import { SearchIpa, SearchIpaVariables } from "../generated/graphql/SearchIpa";
import { GET_SECRET, GET_TOKENS } from "../graphql/backend_queries";
import { GET_IPA, SEARCH_IPA } from "../graphql/hasura_queries";

import { Mutation, Query } from "react-apollo";

import SelectBase from "react-select";
import { useThrottle } from "use-throttle";

type MenuConfigQueryT = {
  data: any;
};

import { GetIpa, GetIpaVariables } from "../generated/graphql/GetIpa";

import { ValueType } from "react-select/lib/types";
import {
  PostAuthEmailIpaCode,
  PostAuthEmailIpaCodeVariables
} from "../generated/graphql/PostAuthEmailIpaCode";
import {
  PostAuthLoginIpaCode,
  PostAuthLoginIpaCodeVariables
} from "../generated/graphql/PostAuthLoginIpaCode";

const IndexPage = ({ data }: MenuConfigQueryT) => {
  const [search, setSearch] = useState<string>("");
  const throttledSearch = useThrottle(search, 1000);
  const [selectedPa, setSelectedPa] = useState<string>();
  const [secret, setSecret] = useState<string>();
  const [hasSecret, setHasSecret] = useState<boolean>();

  const getIpaOptions = (ipaData: SearchIpa | undefined) =>
    ipaData && ipaData.ipa_pa
      ? ipaData.ipa_pa.concat(ipaData.search_ipa || []).map(pa => ({
          value: pa.cod_amm,
          label: pa.des_amm + " " + pa.Comune
        }))
      : [];

  return (
    <Layout menu={data.allConfigYaml.edges[0].node.menu}>
      <SEO title="Home" meta={[]} keywords={[]} />
      <Query<SearchIpa, SearchIpaVariables>
        query={SEARCH_IPA}
        variables={{ search: throttledSearch }}
      >
        {({ loading, error, data: ipaData }) => {
          if (error) {
            return <div>Error</div>;
          }
          return (
            <>
              <SelectBase<{ value: string; label: string }>
                cacheOptions={true}
                defaultOptions={[]}
                isLoading={loading}
                options={loading ? [] : getIpaOptions(ipaData)}
                onChange={(
                  value: ValueType<{ value: string; label: string }>
                ) => {
                  if (value) {
                    setSelectedPa((value as any).value);
                  }
                }}
                onInputChange={(value: string) => setSearch(value)}
              />

              {selectedPa && (
                <Form className="m-3">
                  <FormGroup check={true}>
                    <Input
                      name="gruppo1"
                      type="radio"
                      id="radio1"
                      // tslint:disable-next-line: no-console
                      onChange={() => setHasSecret(true)}
                    />
                    <Label check={true} for="radio1">
                      Ho già la password
                    </Label>
                  </FormGroup>
                  <FormGroup check={true}>
                    <Input
                      name="gruppo1"
                      type="radio"
                      id="radio2"
                      // tslint:disable-next-line: no-console
                      onChange={() => setHasSecret(false)}
                    />
                    <Label check={true} for="radio2">
                      Devo ancora ottenere la password
                    </Label>
                  </FormGroup>
                </Form>
              )}
            </>
          );
        }}
      </Query>{" "}
      {false === hasSecret && (
        <Query<GetIpa, GetIpaVariables>
          query={GET_IPA}
          variables={{ ipa_code: selectedPa ? selectedPa : "" }}
        >
          {({ loading, error, data: ipaData }) => {
            if (loading) {
              return "loading...";
            } else if (error) {
              return "error...";
            } else {
              return (
                <Mutation<PostAuthEmailIpaCode, PostAuthEmailIpaCodeVariables>
                  mutation={GET_SECRET}
                >
                  {(
                    getSecret,
                    {
                      loading: mutationLoading,
                      error: mutationError,
                      data: getSecretData
                    }
                  ) => {
                    if (mutationLoading) {
                      return "loading...";
                    } else if (mutationError) {
                      return "error...";
                    }
                    return getSecretData ? (
                      <p>
                        EMAIL CORRETTAMENTE INVIATA A{" "}
                        {
                          getSecretData.post_auth_email_ipa_code.ipa_ou
                            .mail_resp
                        }
                      </p>
                    ) : (
                      <button
                        onClick={() =>
                          ipaData && ipaData.ipa_pa[0]
                            ? getSecret({
                                variables: {
                                  ipa_code: ipaData.ipa_pa[0].cod_amm,
                                  body: "{}"
                                }
                              })
                            : () => ({})
                        }
                      >
                        {ipaData && ipaData.ipa_pa[0]
                          ? `CLICCA PER OTTENERE IL SECRET PER ${ipaData.ipa_pa[0].cod_amm}`
                          : "SCEGLI UNA PA"}
                      </button>
                    );
                  }}
                </Mutation>
              );
            }
          }}
        </Query>
      )}{" "}
      {selectedPa && hasSecret && (
        <Mutation<PostAuthLoginIpaCode, PostAuthLoginIpaCodeVariables>
          mutation={GET_TOKENS}
        >
          {(
            getTokens,
            {
              loading: mutationLoading,
              error: mutationError,
              data: getTokensData
            }
          ) => {
            if (mutationLoading) {
              return "loading...";
            } else if (mutationError) {
              return "error...";
            } else if (getTokensData) {
              return <p>{JSON.stringify(getTokensData)}</p>;
            }
            return (
              <div>
                <label>secret</label>
                <Input
                  type="text"
                  name="secret"
                  value={secret || ""}
                  onChange={evt => setSecret(evt.target.value)}
                />
                <button
                  onClick={() =>
                    getTokens({
                      variables: {
                        ipa_code: selectedPa,
                        body: {
                          secret: secret || ""
                        }
                      }
                    })
                  }
                >
                  CLICCA PER OTTENERE I TOKEN PER {selectedPa}
                </button>
              </div>
            );
          }}
        </Mutation>
      )}{" "}
    </Layout>
  );
};

export const query = graphql`
  query PageConfig {
    allConfigYaml(filter: { menu: { elemMatch: { name: { ne: null } } } }) {
      edges {
        node {
          menu {
            name
            slug
            subtree {
              name
              slug
              subtitle
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
