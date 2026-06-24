import { DomainEvent } from "src/shared-kernel/domainEvent";

export const USER_ACCOUNT_CREATED = "user.account-created";

export type UserAccountCreatedEvent = DomainEvent<
  typeof USER_ACCOUNT_CREATED,
  {
    userId: string;
    userEmail: string;
    userFirstName: string;
    userLastName: string;
    subscribedToNewsletter: boolean;
  }
>;

export function createUserAccountCreatedEvent(
  id: string,
  payload: UserAccountCreatedEvent["payload"],
): UserAccountCreatedEvent {
  return {
    id,
    name: USER_ACCOUNT_CREATED,
    payload,
  };
}
