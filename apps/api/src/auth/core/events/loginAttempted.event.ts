import { DomainEvent } from "src/shared-kernel/domainEvent";

export const LOGIN_ATTEMPTED = "user.login-attempted";

export type LoginAttemptedEvent = DomainEvent<{
  userEmail?: string;
  method: "pro-connect" | "email-link";
}>;

export function createLoginAttemptedEvent(
  id: string,
  payload: LoginAttemptedEvent["payload"],
): LoginAttemptedEvent {
  return {
    id,
    name: LOGIN_ATTEMPTED,
    payload,
  };
}
