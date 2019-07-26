import * as React from "react";
import { useState } from "react";
import Layout from "../components/Layout";
import SEO from "../components/Seo";

import { graphql, navigate } from "gatsby";

import {
  getMenu,
  getSiteConfig,
  // @ts-ignore
  PageConfigFragment
} from "../graphql/gatsby";

import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { SearchIpa, SearchIpaVariables } from "../generated/graphql/SearchIpa";
import { GET_SECRET, GET_TOKENS } from "../graphql/backend";
import { GET_IPA, SEARCH_IPA } from "../graphql/hasura";
import { capitalizeFirst } from "../utils/strings";

import { Mutation, MutationFn, Query } from "react-apollo";

import SelectBase from "react-select";
import { useDebounce } from "use-debounce";

import { GetIpa, GetIpaVariables } from "../generated/graphql/GetIpa";

import { Trans, useTranslation } from "react-i18next";
import { ValueType } from "react-select/lib/types";
import ApolloErrors from "../components/ApolloErrors";
import { DUMB_IPA_VALUE_FOR_NULL } from "../config";
import { PageConfig } from "../generated/graphql/PageConfig";
import {
  PostAuthEmailIpaCode,
  PostAuthEmailIpaCodeVariables
} from "../generated/graphql/PostAuthEmailIpaCode";
import {
  PostAuthLoginIpaCode,
  PostAuthLoginIpaCodeVariables
} from "../generated/graphql/PostAuthLoginIpaCode";
import { isLoggedIn, storeSessionInfo, storeTokens } from "../utils/auth";
import { isTooManyRequestError } from "../utils/errors";
import { get } from "../utils/safe_access";

type Dispatcher<T> = React.Dispatch<React.SetStateAction<T>>;

type SelectedValueT = { value: string; label: string };

const SecretSelectionComponent = ({
  setHasSecret
}: {
  setHasSecret: Dispatcher<boolean | undefined>;
}) => (
  <Form className="m-3">
    <FormGroup check={true}>
      <Input
        name="secret-selection"
        type="radio"
        id="secret-selection-1"
        onChange={() => setHasSecret(true)}
      />
      <Label check={true} for="secret-selection-1">
        <Trans i18nKey="auth.has_password" />
      </Label>
    </FormGroup>
    <FormGroup check={true}>
      <Input
        name="secret-selection"
        type="radio"
        id="secret-selection-2"
        onChange={() => setHasSecret(false)}
      />
      <Label check={true} for="secret-selection-2">
        <Trans i18nKey="auth.not_has_password" />
      </Label>
    </FormGroup>
  </Form>
);

const GetSecretComponent = ({ ipaData }: { ipaData?: GetIpa }) => {
  const { t } = useTranslation();

  return (
    <Mutation<PostAuthEmailIpaCode, PostAuthEmailIpaCodeVariables>
      mutation={GET_SECRET}
    >
      {(
        getSecret,
        { loading: mutationLoading, error: mutationError, data: getSecretData }
      ) => {
        if (mutationLoading) {
          return (
            <p>
              <Trans i18nKey="sending_data" />
            </p>
          );
        } else if (mutationError) {
          return (
            <p className="text-danger">
              <Trans i18nKey="errors.error_sending_data" />
              <br />
              <ApolloErrors errors={mutationError} />
            </p>
          );
        }

        const hasRtd =
          ipaData &&
          ipaData.ipa_ou &&
          ipaData.ipa_ou[0] &&
          ipaData.ipa_ou[0].mail_resp &&
          ipaData.ipa_ou[0].mail_resp !== "null" &&
          ipaData.ipa_ou[0].mail_resp !== DUMB_IPA_VALUE_FOR_NULL;

        return getSecretData ? (
          <p>
            <Trans i18nKey="auth.email_sent" />{" "}
            {getSecretData.post_auth_email_ipa_code.ipa_ou.mail_resp}
          </p>
        ) : (
          <>
            {hasRtd && (
              <Button
                className="mb-3"
                color="primary"
                onClick={async () =>
                  ipaData && ipaData.ipa_pa[0]
                    ? await getSecret({
                        variables: {
                          ipa_code: ipaData.ipa_pa[0].cod_amm,
                          body: "{}"
                        }
                      })
                    : () => ({})
                }
              >
                Invia l'email
              </Button>
            )}
            {!hasRtd && (
              <p className="text-warning">
                <Trans i18nKey="auth.rtd_not_found" />
                <br />
                <a
                  href={`https://indicepa.gov.it/ricerca/n-dettaglioamministrazione.php?cod_amm=${
                    ipaData!.ipa_pa[0].cod_amm
                  }`}
                >
                  {ipaData!.ipa_pa[0].des_amm}
                </a>
              </p>
            )}
            {hasRtd && (
              <p>
                {t("auth.email_to_be_sent", {
                  paName: ipaData!.ipa_pa[0].des_amm,
                  email: ipaData!.ipa_ou[0].mail_resp
                })}
              </p>
            )}
          </>
        );
      }}
    </Mutation>
  );
};

const GetSecretConnectedComponent = ({
  selectedPa
}: {
  selectedPa?: SelectedValueT;
}) => (
  <Query<GetIpa, GetIpaVariables>
    query={GET_IPA}
    variables={{ ipa_code: selectedPa ? selectedPa.value : "" }}
  >
    {({ loading, error, data: ipaData }) => {
      if (loading) {
        return (
          <p>
            <Trans i18nKey="loading_data" />
          </p>
        );
      } else if (error) {
        return (
          <p>
            <Trans i18nKey="errors.error_getting_data" />:{" "}
            {JSON.stringify(error)}
          </p>
        );
      } else {
        return <GetSecretComponent ipaData={ipaData} />;
      }
    }}
  </Query>
);

const getIpaOptions = (ipaData: SearchIpa | undefined) =>
  ipaData && ipaData.ipa_pa
    ? ipaData.ipa_pa.concat(ipaData.search_ipa || []).map(pa => ({
        value: pa.cod_amm,
        label: [pa.des_amm, pa.Comune, pa.cod_amm].join(", ")
      }))
    : [];

const PaSelectionComponent = ({
  loading,
  ipaData,
  setSelectedPa,
  setSearch
}: {
  loading: boolean;
  ipaData?: SearchIpa;
  setSelectedPa: Dispatcher<SelectedValueT | undefined>;
  setSearch: Dispatcher<string>;
}) => (
  <>
    <label htmlFor="pa">
      <Trans i18nKey="auth.select_pa" />
    </label>

    <p className="f-1">
      <Trans i18nKey="auth.select_pa_hint" />
    </p>

    <SelectBase<SelectedValueT>
      name="pa"
      className="react-select"
      cacheOptions={true}
      defaultOptions={[]}
      isLoading={loading}
      options={loading ? [] : getIpaOptions(ipaData)}
      onChange={(value: ValueType<SelectedValueT>) => {
        if (value) {
          // this cast is needed because a wrong array type is inferred
          setSelectedPa({
            label: (value as SelectedValueT).label.split(",")[0],
            value: (value as SelectedValueT).value
          });
        }
      }}
      onInputChange={(value: string) => setSearch(value)}
    />
  </>
);

const SelectOrganizationConnectedComponent = ({
  setSelectedPa,
  setHasSecret,
  selectedPa
}: {
  setSelectedPa: Dispatcher<SelectedValueT | undefined>;
  setHasSecret: Dispatcher<boolean | undefined>;
  selectedPa?: SelectedValueT;
}) => {
  const [search, setSearch] = useState<string>("");
  const [searchDebounced] = useDebounce(search, 400);

  return (
    <Query<SearchIpa, SearchIpaVariables>
      query={SEARCH_IPA}
      variables={{ search: searchDebounced }}
    >
      {({ loading, error, data: ipaData }) => {
        if (error) {
          return (
            <p className="text-warning">
              <Trans i18nKey="errors.error_getting_data" />:{" "}
              {JSON.stringify(error)}
            </p>
          );
        }
        return (
          <>
            <PaSelectionComponent
              ipaData={ipaData}
              loading={loading}
              setSearch={setSearch}
              setSelectedPa={setSelectedPa}
            />
            {selectedPa && (
              <SecretSelectionComponent setHasSecret={setHasSecret} />
            )}
          </>
        );
      }}
    </Query>
  );
};

const LoginButtonComponent = ({
  secret,
  setSecret,
  selectedPa,
  getTokens
}: {
  secret?: string;
  setSecret: Dispatcher<string | undefined>;
  selectedPa: SelectedValueT;
  getTokens: MutationFn<PostAuthLoginIpaCode, PostAuthLoginIpaCodeVariables>;
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <label htmlFor="secret">
        <Trans i18nKey="auth.insert_secret" />
      </label>
      <Input
        type="text"
        name="secret"
        value={secret || ""}
        onChange={evt => setSecret(evt.target.value)}
      />
      <br />
      <Button
        color="primary"
        onClick={() =>
          getTokens({
            variables: {
              ipa_code: selectedPa.value,
              body: {
                secret: secret || ""
              }
            }
          })
        }
      >
        {t("auth.login_as", { selectedPa: selectedPa.label })}
      </Button>
    </div>
  );
};

const LoginButtonConnectedComponent = ({
  secret,
  setSecret,
  selectedPa,
  onStoreTokens
}: {
  secret?: string;
  setSecret: Dispatcher<string | undefined>;
  selectedPa: SelectedValueT;
  onStoreTokens: (data: PostAuthLoginIpaCode) => void;
}) => (
  <Mutation<PostAuthLoginIpaCode, PostAuthLoginIpaCodeVariables>
    mutation={GET_TOKENS}
  >
    {(
      getTokens,
      { loading: mutationLoading, error: mutationError, data: getTokensData }
    ) => {
      if (mutationLoading) {
        return (
          <p>
            <Trans i18nKey="sending_data" />
          </p>
        );
      } else if (getTokensData) {
        onStoreTokens(getTokensData);
      }
      return (
        <>
          {mutationError && (
            <p className="text-danger">
              {isTooManyRequestError(mutationError) ? (
                <ApolloErrors errors={mutationError} />
              ) : (
                <span>
                  <Trans i18nKey="auth.wrong_password" />
                </span>
              )}
            </p>
          )}
          <LoginButtonComponent
            getTokens={getTokens}
            secret={secret}
            selectedPa={selectedPa}
            setSecret={setSecret}
          />
        </>
      );
    }}
  </Mutation>
);

const IndexPage = ({ data }: { data: PageConfig }) => {
  const { t } = useTranslation();
  const [selectedPa, setSelectedPa] = useState<SelectedValueT>();
  const [secret, setSecret] = useState<string>();
  const [hasSecret, setHasSecret] = useState<boolean>();

  const siteConfig = getSiteConfig(data);

  if (isLoggedIn()) {
    navigate(siteConfig && siteConfig.homepage ? siteConfig.homepage : "/");
    return null;
  }

  const isSessionExpired =
    window.location.search.indexOf("session-expired") !== -1;

  return (
    <Layout
      menu={getMenu(data)}
      siteConfig={siteConfig}
      title={t("pages.index_page_title")}
    >
      <SEO title={t("pages.index_page_title")} siteConfig={siteConfig} />
      {isSessionExpired && (
        <p className="alert alert-warning w-100">
          <Trans i18nKey="auth.expired_session" />
        </p>
      )}
      <div>
        <h2>{capitalizeFirst(t("login"))}</h2>
        <SelectOrganizationConnectedComponent
          selectedPa={selectedPa}
          setHasSecret={setHasSecret}
          setSelectedPa={setSelectedPa}
        />
        {false === hasSecret && (
          <GetSecretConnectedComponent selectedPa={selectedPa} />
        )}
        {selectedPa && hasSecret && (
          <LoginButtonConnectedComponent
            secret={secret}
            selectedPa={selectedPa}
            setSecret={setSecret}
            onStoreTokens={tokens => {
              storeTokens(
                tokens.post_auth_login_ipa_code.backend_token,
                tokens.post_auth_login_ipa_code.graphql_token
              );
              storeSessionInfo({
                userId: tokens.post_auth_login_ipa_code.user.id,
                userEmail: tokens.post_auth_login_ipa_code.user.email,
                organizationName: selectedPa.label,
                organizationCode: selectedPa.value
              });
              navigate(get(siteConfig, s => s.homepage, ""));
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query PageConfig {
    menu: allConfigYaml(
      filter: { menu: { elemMatch: { name: { ne: null } } } }
    ) {
      ...PageConfigFragment
    }
    siteConfig: allConfigYaml(filter: { title: { ne: null } }) {
      ...SiteConfigFragment
    }
  }
`;

export default IndexPage;
