/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PostAuthEmailIpaCode
// ====================================================

export interface PostAuthEmailIpaCode_post_auth_email_ipa_code_ipa_pa {
  readonly __typename: "GetPaFromIpa_ipa_pa";
  /**
   * IPA code.
   */
  readonly cod_amm: string;
}

export interface PostAuthEmailIpaCode_post_auth_email_ipa_code_ipa_ou {
  readonly __typename: "GetPaFromIpa_ipa_ou";
  readonly mail_resp: string;
}

export interface PostAuthEmailIpaCode_post_auth_email_ipa_code {
  readonly __typename: "GetPaFromIpa";
  readonly ipa_pa: PostAuthEmailIpaCode_post_auth_email_ipa_code_ipa_pa;
  readonly ipa_ou: PostAuthEmailIpaCode_post_auth_email_ipa_code_ipa_ou;
}

export interface PostAuthEmailIpaCode {
  /**
   * Send an email with a secret code to the RTD of the Public Administration
   * (organization) identified by the IPA code. 
   * Gets the information on the organization from the
   * [IPA](https: // indicepa.gov.it) catalogue using the provided IPA code.
   * The secret code will be used by the client to login into the backend.
   */
  readonly post_auth_email_ipa_code: PostAuthEmailIpaCode_post_auth_email_ipa_code;
}

export interface PostAuthEmailIpaCodeVariables {
  readonly ipa_code: string;
  readonly body: string;
}
