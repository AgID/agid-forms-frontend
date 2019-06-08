import { gql } from "apollo-boost";

export const GET_IPA = gql`
  query GetIpa {
    ipa_pa(where: { cod_amm: { _eq: "agid" } }) {
      cod_amm
      des_amm
    }
    ipa_ou(
      where: {
        _and: {
          cod_amm: { _eq: "agid" }
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
