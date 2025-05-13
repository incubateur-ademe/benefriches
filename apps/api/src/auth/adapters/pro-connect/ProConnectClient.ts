export const PRO_CONNECT_CLIENT_INJECTION_TOKEN = Symbol("ProConnectClient");

export type FetchUserIdentityParams = {
  expectedState: string;
  expectedNonce: string;
  currentUrl: URL;
};

export type FetchUserIdentityResult = {
  idToken: string;
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  siret: string;
};

export interface ProConnectClient {
  getAuthorizationUrl(
    loginCallbackUrl: string,
  ): Promise<{ authorizationUrl: URL; state: string; nonce: string }>;

  fetchUserIdentity(params: FetchUserIdentityParams): Promise<FetchUserIdentityResult>;
}
