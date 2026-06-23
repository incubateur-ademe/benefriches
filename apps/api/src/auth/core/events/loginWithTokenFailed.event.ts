import type { DomainEvent } from "src/shared-kernel/domainEvent";

export const LOGIN_WITH_TOKEN_FAILED = "auth.login-with-token-failed";

export type LoginWithTokenFailedEvent = DomainEvent<
  typeof LOGIN_WITH_TOKEN_FAILED,
  {
    errorType: "TokenNotFound" | "AuthenticationAttemptExpired" | "TokenAlreadyUsed";
  }
>;

export function createLoginWithTokenFailedEvent(
  id: string,
  payload: LoginWithTokenFailedEvent["payload"],
): LoginWithTokenFailedEvent {
  return {
    id,
    name: LOGIN_WITH_TOKEN_FAILED,
    payload,
  };
}
