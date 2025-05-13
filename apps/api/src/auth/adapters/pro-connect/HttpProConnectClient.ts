import * as oidcHttpClient from "openid-client";

import {
  FetchUserIdentityParams,
  FetchUserIdentityResult,
  ProConnectClient,
} from "./ProConnectClient";

export class HttpProConnectClient implements ProConnectClient {
  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly providerDomain: string,
  ) {}

  async getAuthorizationUrl(
    loginCallbackUrl: string,
  ): Promise<{ authorizationUrl: URL; state: string; nonce: string }> {
    const config = await this.discoverConfig();

    const nonce = oidcHttpClient.randomNonce();
    const state = oidcHttpClient.randomState();

    const authorizationUrl = oidcHttpClient.buildAuthorizationUrl(
      config,
      new URLSearchParams({
        nonce,
        state,
        response_type: "code",
        redirect_uri: loginCallbackUrl,
        scope: "openid uid given_name usual_name email siret",
        acr_values: "eidas1",
      }),
    );

    return { authorizationUrl, state, nonce };
  }

  async fetchUserIdentity({
    expectedState,
    expectedNonce,
    currentUrl,
  }: FetchUserIdentityParams): Promise<FetchUserIdentityResult> {
    const config = await this.discoverConfig();

    // exchange received authorization code for tokens
    const tokens = await oidcHttpClient.authorizationCodeGrant(config, currentUrl, {
      expectedState,
      expectedNonce,
    });

    const claims = tokens.claims();

    if (!claims) throw new Error("No claims found in the token");

    const userInfo = await oidcHttpClient.fetchUserInfo(config, tokens.access_token, claims.sub);

    return {
      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      idToken: tokens.id_token as string,
      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      email: userInfo.email as string,
      id: userInfo.sub,
      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      firstName: userInfo.given_name as string,
      lastName: userInfo.usual_name as string,
      siret: userInfo.siret as string,
    };
  }

  private async discoverConfig(): Promise<oidcHttpClient.Configuration> {
    const config = await oidcHttpClient.discovery(
      new URL(`https://${this.providerDomain}/api/v2/.well-known/openid-configuration`),
      this.clientId,
      this.clientSecret,
    );

    return config;
  }
}
