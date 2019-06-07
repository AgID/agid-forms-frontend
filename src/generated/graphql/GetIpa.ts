/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetIpa
// ====================================================

export interface GetIpa_ipa_pa {
  readonly __typename: "ipa_pa";
  readonly cod_amm: string;
  readonly des_amm: string;
}

export interface GetIpa_ipa_ou {
  readonly __typename: "ipa_ou";
  readonly cod_ou: string;
  readonly nome_resp: string;
  readonly cogn_resp: string;
  readonly mail_resp: string;
}

export interface GetIpa {
  /**
   * fetch data from the table: "ipa_pa"
   */
  readonly ipa_pa: ReadonlyArray<GetIpa_ipa_pa>;
  /**
   * fetch data from the table: "ipa_ou"
   */
  readonly ipa_ou: ReadonlyArray<GetIpa_ipa_ou>;
}
