import { z } from "zod";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { UseCase } from "src/shared-kernel/usecase";

import {
  createUserAccountCreatedEvent,
  UserAccountCreatedEvent,
} from "./events/userAccountCreated.event";
import { UuidGenerator } from "./gateways/IdGenerator";
import { UserRepository } from "./gateways/UsersRepository";
import { userSchema } from "./user";

type CreateUserFailureReason = "UserEmailAlreadyExists" | "PersonalDataStorageNotConsented";

type CreateUserResult = { success: true } | { success: false; error: CreateUserFailureReason };

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

export class CreateUserUseCase implements UseCase<Request, CreateUserResult> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dateProvider: DateProvider,
    private readonly uuidGenerator: UuidGenerator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute({ user: userProps }: Request): Promise<CreateUserResult> {
    const {
      personalDataCommunicationUseConsented,
      personalDataAnalyticsUseConsented,
      personalDataStorageConsented,
      ...user
    } = await userPropsSchema.parseAsync(userProps);

    if (await this.userRepository.existsWithEmail(user.email)) {
      return { success: false, error: "UserEmailAlreadyExists" };
    }

    if (!personalDataStorageConsented) {
      return { success: false, error: "PersonalDataStorageNotConsented" };
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

    await this.publishUserCreatedEvent({
      userId: user.id,
      userEmail: user.email,
      userFirstName: user.firstName,
      userLastName: user.lastName,
      // todo: get this value from props
      subscribeToNewsletter: false,
    });

    return { success: true };
  }

  private async publishUserCreatedEvent(eventPayload: UserAccountCreatedEvent["payload"]) {
    const event = createUserAccountCreatedEvent(this.uuidGenerator.generate(), eventPayload);
    await this.eventPublisher.publish(event);
  }
}
