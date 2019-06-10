/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchIpa
// ====================================================

export interface SearchIpa_search_ipa {
  readonly __typename: "ipa_pa";
  readonly cod_amm: string;
  readonly des_amm: string;
  readonly Comune: string;
}

export interface SearchIpa_ipa_pa {
  readonly __typename: "ipa_pa";
  readonly cod_amm: string;
  readonly des_amm: string;
  readonly Comune: string;
}

export interface SearchIpa {
  /**
   * execute function "search_ipa" which returns "ipa_pa"
   */
  readonly search_ipa: ReadonlyArray<SearchIpa_search_ipa>;
  /**
   * fetch data from the table: "ipa_pa"
   */
  readonly ipa_pa: ReadonlyArray<SearchIpa_ipa_pa>;
}

export interface SearchIpaVariables {
  readonly search: string;
}
