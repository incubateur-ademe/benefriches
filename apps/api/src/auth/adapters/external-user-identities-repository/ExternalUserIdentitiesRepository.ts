export const EXTERNAL_USER_IDENTITIES_REPOSITORY_INJECTION_TOKEN = Symbol(
  "ExternalUserIdentityRepository",
);

export type ExternalUserIdentity = {
  id: string;
  userId: string;
  provider: string;
  providerUserId: string;
  createdAt: Date;
  providerInfo?: Record<string, unknown>;
};

export interface ExternalUserIdentityRepository {
  save(userIdentity: ExternalUserIdentity): Promise<void>;

  findByProviderUserId(
    provider: string,
    providerUserId: string,
  ): Promise<ExternalUserIdentity | undefined>;
}
