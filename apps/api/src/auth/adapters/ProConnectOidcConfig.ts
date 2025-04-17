import * as client from "openid-client";

export const PRO_CONNECT_CLIENT_CONFIG = Symbol("ProConnectClientConfig");

type BuildProConnectClientProps = {
  providerDomain: string;
  clientId: string;
  clientSecret: string;
};

export async function getProConnectOidcConfig({
  providerDomain,
  clientId,
  clientSecret,
}: BuildProConnectClientProps): Promise<client.Configuration> {
  const config = await client.discovery(
    new URL(`https://${providerDomain}/api/v2/.well-known/openid-configuration`),
    clientId,
    clientSecret,
  );

  return config;
}
