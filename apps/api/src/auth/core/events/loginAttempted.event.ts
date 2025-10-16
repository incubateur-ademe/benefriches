import { DomainEvent } from "src/shared-kernel/domainEvent";

const LOGIN_ATTEMPTED = "user.login-attempted";

type LoginAttemptedEvent = DomainEvent<
  typeof LOGIN_ATTEMPTED,
  {
    userEmail?: string;
    method: "pro-connect" | "email-link";
  }
>;

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
