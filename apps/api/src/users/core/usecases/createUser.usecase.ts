import { z } from "zod";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { UserRepository } from "../gateways/UserRepository";
import { userSchema } from "../model/user";

export const userPropsSchema = userSchema
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
export type UserProps = z.infer<typeof userPropsSchema>;

type Request = {
  user: UserProps;
};

export class CreateUserUseCase implements UseCase<Request, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({ user: userProps }: Request): Promise<void> {
    const {
      personalDataCommunicationUseConsented,
      personalDataAnalyticsUseConsented,
      personalDataStorageConsented,
      ...user
    } = await userPropsSchema.parseAsync(userProps);

    if (!personalDataStorageConsented) {
      throw new Error("Personal data storage consented field should be true");
    }

    await this.userRepository.save({
      ...user,
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
