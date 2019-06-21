import * as React from "react";
import { useState } from "react";
import Layout from "../components/Layout";
import SEO from "../components/Seo";

import { graphql, navigate } from "gatsby";

// @ts-ignore
import {
  getMenu,
  getSiteConfig,
  PageConfigFragment
} from "../graphql/gatsby_fragments";

import { Button, Form, FormGroup, Input, Label } from "reactstrap";

import { SearchIpa, SearchIpaVariables } from "../generated/graphql/SearchIpa";
import { GET_SECRET, GET_TOKENS } from "../graphql/backend_queries";
import { GET_IPA, SEARCH_IPA } from "../graphql/hasura_queries";

import { Mutation, MutationFn, Query } from "react-apollo";

import SelectBase from "react-select";
import { useDebounce } from "use-debounce";

import { GetIpa, GetIpaVariables } from "../generated/graphql/GetIpa";

import { ValueType } from "react-select/lib/types";
import { PageConfig } from "../generated/graphql/PageConfig";
import {
  PostAuthEmailIpaCode,
  PostAuthEmailIpaCodeVariables
} from "../generated/graphql/PostAuthEmailIpaCode";
import {
  PostAuthLoginIpaCode,
  PostAuthLoginIpaCodeVariables
} from "../generated/graphql/PostAuthLoginIpaCode";
import { isLoggedIn, storeTokens, storeUser } from "../utils/auth";

type Dispatcher<T> = React.Dispatch<React.SetStateAction<T>>;

const SecretSelectionComponent = ({
  setHasSecret
}: {
  setHasSecret: Dispatcher<boolean | undefined>;
}) => (
  <>
    <Form className="m-3">
      <FormGroup check={true}>
        <Input
          name="gruppo1"
          type="radio"
          id="radio1"
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
          onChange={() => setHasSecret(false)}
        />
        <Label check={true} for="radio2">
          Devo ancora ottenere la password
        </Label>
      </FormGroup>
    </Form>
  </>
);

const GetSecretComponent = ({ ipaData }: { ipaData?: GetIpa }) => (
  <Mutation<PostAuthEmailIpaCode, PostAuthEmailIpaCodeVariables>
    mutation={GET_SECRET}
  >
    {(
      getSecret,
      { loading: mutationLoading, error: mutationError, data: getSecretData }
    ) => {
      if (mutationLoading) {
        return <p>Invio in corso...</p>;
      } else if (mutationError) {
        return (
          <p>
            Si è verificato un errore durante l'operazione: {mutationError}...
          </p>
        );
      }
      return getSecretData ? (
        <p>
          Un'email contenente la password di accesso è stata inviata
          all'indirizzo{" "}
          {getSecretData.post_auth_email_ipa_code.ipa_ou.mail_resp}
        </p>
      ) : (
        <>
          <Button
            className="mb-3"
            color="primary"
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
              ? "Invia l'email"
              : "Scegli prima un'amministrazione"}
          </Button>
          {ipaData && ipaData.ipa_pa[0] && (
            <p>
              proseguendo verrà inviata un'email all'indirizzo del responsabile
              per la transizione digitale dell'ente {ipaData.ipa_pa[0].des_amm}:{" "}
              {ipaData.ipa_ou[0].mail_resp}
            </p>
          )}
        </>
      );
    }}
  </Mutation>
);

const GetSecretConnectedComponent = ({
  selectedPa
}: {
  selectedPa?: string;
}) => (
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
  setSelectedPa: Dispatcher<string | undefined>;
  setSearch: Dispatcher<string>;
}) => (
  <>
    <label htmlFor="pa">Seleziona un'amministrazione:</label>

    <p className="f-1">
      Puoi cercare l'amministrazione per nome o inserendo direttamente il codice
      ipa
    </p>

    <SelectBase<{ value: string; label: string }>
      name="pa"
      cacheOptions={true}
      defaultOptions={[]}
      isLoading={loading}
      options={loading ? [] : getIpaOptions(ipaData)}
      onChange={(value: ValueType<{ value: string; label: string }>) => {
        if (value) {
          setSelectedPa((value as any).value);
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
  setSelectedPa: Dispatcher<string | undefined>;
  setHasSecret: Dispatcher<boolean | undefined>;
  selectedPa?: string;
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
          return <div>Errore nella query: {error}</div>;
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
  selectedPa: string;
  getTokens: MutationFn<PostAuthLoginIpaCode, PostAuthLoginIpaCodeVariables>;
}) => (
  <div>
    <label htmlFor="secret">
      Inserisci la password che hai ricevuto per email:
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
            ipa_code: selectedPa,
            body: {
              secret: secret || ""
            }
          }
        })
      }
    >
      Accedi come {selectedPa}
    </Button>
  </div>
);

const LoginButtonConnectedComponent = ({
  secret,
  setSecret,
  selectedPa,
  onStoreTokens
}: {
  secret?: string;
  setSecret: Dispatcher<string | undefined>;
  selectedPa: string;
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
        return "loading...";
      } else if (getTokensData) {
        onStoreTokens(getTokensData);
      }
      return (
        <>
          {mutationError && <p className="text-danger">password errata</p>}
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

const IndexPage = (data: PageConfig) => {
  const [selectedPa, setSelectedPa] = useState<string>();
  const [secret, setSecret] = useState<string>();
  const [hasSecret, setHasSecret] = useState<boolean>();

  if (isLoggedIn()) {
    navigate("/actions");
    return <></>;
  }

  return (
    <Layout menu={getMenu(data)} siteConfig={getSiteConfig(data)}>
      <SEO title="Home" meta={[]} keywords={[]} />
      <h1>Modulistica AGID</h1>
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
            storeUser(tokens.post_auth_login_ipa_code.user);
            navigate("/actions");
          }}
        />
      )}
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
