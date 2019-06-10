import gql from "graphql-tag";

export const SEARCH_IPA = gql`
  query SearchIpa($search: String!) {
    search_ipa(args: { search: $search }) {
      cod_amm
      des_amm
      Comune
    }
    ipa_pa(where: { cod_amm: { _eq: $search } }) {
      cod_amm
      des_amm
      Comune
    }
  }
`;

export const GET_IPA = gql`
  query GetIpa($ipa_code: String!) {
    ipa_pa(where: { cod_amm: { _eq: $ipa_code } }) {
      cod_amm
      des_amm
      Comune
    }
    ipa_ou(
      where: {
        _and: {
          cod_amm: { _eq: $ipa_code }
          cod_ou: { _eq: "Ufficio_Transizione_Digitale" }
        }
      }
    ) {
      cod_ou
      nome_resp
      cogn_resp
      mail_resp
    }
  }
`;
