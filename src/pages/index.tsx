import * as React from "react";
import { useState } from "react";
import SEO from "../components/Seo";
import StaticLayout from "../components/StaticLayout";

import { graphql, Link, navigate, useStaticQuery } from "gatsby";

import { Button, Input, Label } from "reactstrap";
import { FormGroup } from "../components/FormGroup";
import { SearchIpa, SearchIpaVariables } from "../generated/graphql/SearchIpa";
import { GET_SECRET_IPA, GET_TOKENS_IPA } from "../graphql/backend";
import { GET_IPA, SEARCH_IPA } from "../graphql/hasura";
import { capitalizeFirst } from "../utils/strings";

import { Mutation, MutationFn, Query } from "react-apollo";

import SelectBase from "react-select";
import { useDebounce } from "use-debounce";

import { GetIpa, GetIpaVariables } from "../generated/graphql/GetIpa";

import { Trans, useTranslation } from "react-i18next";
import { ValueType } from "react-select/lib/types";
import ApolloErrors from "../components/ApolloErrors";
import { FieldDescription } from "../components/FieldDescription";
import { DUMB_IPA_VALUE_FOR_NULL } from "../config";
import {
  PostAuthEmailIpaCode,
  PostAuthEmailIpaCodeVariables
} from "../generated/graphql/PostAuthEmailIpaCode";
import {
  PostAuthLoginIpaCode,
  PostAuthLoginIpaCodeVariables
} from "../generated/graphql/PostAuthLoginIpaCode";
import { isLoggedIn, storeSessionInfo, storeTokens } from "../utils/auth";
import { isNetworkError } from "../utils/errors";
import { get } from "../utils/safe_access";

type Dispatcher<T> = React.Dispatch<React.SetStateAction<T>>;

type SelectedValueT = { value: string; label: string };

const getIpaCodeFromUrl = () =>
  typeof URLSearchParams !== "undefined"
    ? new URLSearchParams(window.location.search).get("ipa")
    : undefined;

const SecretSelectionComponent = ({
  setHasSecret,
  hasSecret
}: {
  setHasSecret: Dispatcher<boolean | undefined>;
  hasSecret?: boolean;
}) => (
  <FormGroup
    className="my-4"
    fieldName="secret-selection"
    isHidden={false}
    role="radiogroup"
    label="has secret"
  >
    <div className="mb-4 focusable">
      <Input
        name="secret-selection"
        type="radio"
        id="secret-selection-1"
        onChange={() => setHasSecret(true)}
        checked={hasSecret === true}
        value={hasSecret ? "true" : "false"}
      />
      <Label check={true} for="secret-selection-1">
        <Trans i18nKey="auth.has_password" />
      </Label>
    </div>
    <div className="focusable">
      <Input
        name="secret-selection"
        type="radio"
        id="secret-selection-2"
        onChange={() => setHasSecret(false)}
        checked={hasSecret === false}
        value={!hasSecret ? "true" : "false"}
      />
      <Label check={true} for="secret-selection-2">
        <Trans i18nKey="auth.not_has_password" />
      </Label>
    </div>
  </FormGroup>
);

const GetSecretComponent = ({ ipaData }: { ipaData?: GetIpa }) => {
  const { t } = useTranslation();
  const [agree, setAgree] = useState(false);

  return (
    <Mutation<PostAuthEmailIpaCode, PostAuthEmailIpaCodeVariables>
      mutation={GET_SECRET_IPA}
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
              <>
                <FormGroup isHidden={false} fieldName="agree">
                  <Input
                    type="checkbox"
                    name="agree"
                    checked={agree}
                    onChange={() => setAgree(!agree)}
                    id="agree"
                  />
                  <Label
                    htmlFor="agree"
                    className="font-size-xs"
                    style={{ maxWidth: "34em" }}
                  >
                    {t("auth.email_to_be_sent", {
                      paName: ipaData!.ipa_pa[0].des_amm,
                      email: ipaData!.ipa_ou[0].mail_resp
                    })}
                  </Label>
                </FormGroup>

                <div className="text-center mt-4">
                  <div className="btn btn-outline-primary mx-4">
                    <Link
                      to="/"
                      className="text-decoration-none"
                      // tslint:disable-next-line: no-object-mutation
                      onClick={() => (window.location.href = "/")}
                    >
                      {t("cancel")}
                    </Link>
                  </div>
                  <Button
                    disabled={!agree}
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
                    {t("auth.send_me_email")}
                  </Button>
                </div>
              </>
            )}
            {!hasRtd && (
              <p className="text-warning">
                <Trans i18nKey="auth.rtd_not_found" />
                <br />
                <a
                  className="external"
                  aria-label={`${ipaData!.ipa_pa[0].des_amm} - ${t(
                    "external_link"
                  )}`}
                  title={t("external_link")}
                  href={`https://indicepa.gov.it/ricerca/n-dettaglioamministrazione.php?cod_amm=${
                    ipaData!.ipa_pa[0].cod_amm
                  }`}
                >
                  {ipaData!.ipa_pa[0].des_amm}
                </a>
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
  ipaData && Array.isArray(ipaData.ipa_pa)
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
}) => {
  const { t } = useTranslation();
  const options = getIpaOptions(ipaData);
  return (
    <FormGroup isHidden={false} fieldName="pa">
      <Label
        for="pa-select"
        htmlFor="pa-select"
        check={true}
        className="d-block font-weight-semibold neutral-2-color-a5 font-size-xs"
      >
        <Trans i18nKey="auth.select_pa" />
      </Label>

      <SelectBase<SelectedValueT>
        name="pa"
        inputId="pa-select"
        className="react-select"
        placeholder={options[0] ? options[0].label : t("auth.pa_placeholder")}
        defaultInputValue={options[0] ? options[0].label : undefined}
        noOptionsMessage={inpt =>
          inpt.inputValue ? t("no_result_found") : t("auth.pa_placeholder")
        }
        isClearable={true}
        cacheOptions={true}
        isLoading={loading}
        options={options}
        onChange={(value: ValueType<SelectedValueT>) => {
          if (value) {
            // this cast is needed because a wrong array type is inferred
            setSelectedPa({
              label: (value as SelectedValueT).label.split(",")[0],
              value: (value as SelectedValueT).value
            });
          }
        }}
        onInputChange={(value: string) => {
          setSearch(value);
        }}
      />
      <FieldDescription description={t("auth.select_pa_hint")} />
    </FormGroup>
  );
};

const SelectOrganizationConnectedComponent = ({
  setSelectedPa,
  setHasSecret,
  hasSecret,
  selectedPa
}: {
  setSelectedPa: Dispatcher<SelectedValueT | undefined>;
  setHasSecret: Dispatcher<boolean | undefined>;
  selectedPa?: SelectedValueT;
  hasSecret?: boolean;
}) => {
  const [search, setSearch] = useState<string>("");
  const [searchDebounced] = useDebounce(search, 400);

  const ipaCode = getIpaCodeFromUrl();

  React.useEffect(() => {
    if (ipaCode) {
      setSearch(ipaCode);
    }
  }, [ipaCode]);

  return (
    <Query<SearchIpa, SearchIpaVariables>
      query={SEARCH_IPA}
      variables={{ search: searchDebounced }}
      onCompleted={value => {
        if (ipaCode && value.ipa_pa && value.ipa_pa[0]) {
          setSelectedPa({
            label: value.ipa_pa[0].des_amm,
            value: value.ipa_pa[0].cod_amm
          });
        }
      }}
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
              <SecretSelectionComponent
                setHasSecret={setHasSecret}
                hasSecret={hasSecret}
              />
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
    <>
      <div className="form-check">
        <label
          htmlFor="secret"
          className="d-block font-weight-semibold neutral-2-color-a5 font-size-xs form-check-label"
        >
          <Trans i18nKey="auth.insert_secret" />
        </label>
        <Input
          type="password"
          name="secret"
          id="secret"
          value={secret || ""}
          onChange={evt => setSecret(evt.target.value)}
        />
      </div>
      <div className="text-center mt-4">
        <div className="btn btn-outline-primary mx-4">
          <Link
            to="/"
            className="text-decoration-none"
            // tslint:disable-next-line: no-object-mutation
            onClick={() => (window.location.href = "/")}
          >
            {t("cancel")}
          </Link>
        </div>
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
          {t("auth.login")}
        </Button>
      </div>
    </>
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
    mutation={GET_TOKENS_IPA}
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
              {isNetworkError(mutationError, 403) ? (
                <span>
                  <Trans i18nKey="auth.wrong_password" />
                </span>
              ) : (
                <ApolloErrors errors={mutationError} />
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

const IndexPage = () => {
  const { t } = useTranslation();
  const ipaCode = getIpaCodeFromUrl();

  const [selectedPa, setSelectedPa] = useState<SelectedValueT>();
  const [secret, setSecret] = useState<string>();
  const [hasSecret, setHasSecret] = useState<boolean | undefined>(
    ipaCode ? true : undefined
  );

  const { homepageData } = useStaticQuery(
    graphql`
      query HomePage {
        homepageData: allConfigYaml(filter: { title: { ne: null } }) {
          edges {
            node {
              homepage
            }
          }
        }
      }
    `
  );

  const homepage = get(
    homepageData,
    hd => (hd.edges[0].node.homepage as unknown) as string,
    "/"
  );

  if (isLoggedIn()) {
    navigate(homepage);
    return null;
  }

  const isSessionExpired =
    typeof window !== "undefined" &&
    window.location.search.indexOf("session-expired") !== -1;

  return (
    <StaticLayout title="">
      <SEO title={t("pages.index_page_title")} />
      {isSessionExpired && (
        <p className="alert alert-warning w-100">
          <Trans i18nKey="auth.expired_session" />
        </p>
      )}
      <div className="">
        <h2>{capitalizeFirst(t("login"))}</h2>

        <p className="w-paragraph-sans mb-5">
          <Trans i18nKey="auth.description">
            <a className="external" href="https://indicepa.gov.it">
              indicepa <span>{t("external_link")}</span>
            </a>
          </Trans>
        </p>

        <SelectOrganizationConnectedComponent
          selectedPa={selectedPa}
          setHasSecret={setHasSecret}
          hasSecret={hasSecret}
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
                organizationCode: selectedPa.value,
                roles: tokens.post_auth_login_ipa_code.user.roles
              });
              navigate(homepage);
            }}
          />
        )}
      </div>
    </StaticLayout>
  );
};

export default IndexPage;
