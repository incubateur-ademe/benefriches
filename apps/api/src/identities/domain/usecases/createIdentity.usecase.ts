import { z } from "zod";
import { UseCase } from "src/shared-kernel/usecase";
import { Identity, identitySchema } from "../model/identity";

export interface IdentityRepository {
  save(identity: Identity): Promise<void>;
}

export interface DateProvider {
  now(): Date;
}

export const identityPropsSchema = identitySchema
  .omit({
    createdAt: true,
    personalDataAnalyticsUseConsentedAt: true,
    personalDataCommunicationUseConsentedAt: true,
    personalDataStorageConsentedAt: true,
  })
  .extend({
    personalDataCommunicationUseConsented: z.boolean(),
    personalDataAnalyticsUseConsented: z.boolean(),
    personalDataStorageConsented: z.boolean(),
  });
export type IdentityProps = z.infer<typeof identityPropsSchema>;

type Request = {
  identity: IdentityProps;
};

export class CreateIdentityUseCase implements UseCase<Request, void> {
  constructor(
    private readonly identityRepository: IdentityRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({ identity: identityProps }: Request): Promise<void> {
    const {
      personalDataCommunicationUseConsented,
      personalDataAnalyticsUseConsented,
      personalDataStorageConsented,
      ...identity
    } = await identityPropsSchema.parseAsync(identityProps);

    if (!personalDataStorageConsented) {
      throw new Error("Personal data storage consented field should be true");
    }

    await this.identityRepository.save({
      ...identity,
      createdAt: this.dateProvider.now(),
      personalDataStorageConsentedAt: this.dateProvider.now(),
      personalDataAnalyticsUseConsentedAt: personalDataAnalyticsUseConsented
        ? this.dateProvider.now()
        : undefined,
      personalDataCommunicationUseConsentedAt: personalDataCommunicationUseConsented
        ? this.dateProvider.now()
        : undefined,
    });
  }
}
