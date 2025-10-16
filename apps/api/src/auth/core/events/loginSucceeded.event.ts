import { DomainEvent } from "src/shared-kernel/domainEvent";

const LOGIN_SUCCEEDED = "user.login-succeeded";

type LoginSucceededEvent = DomainEvent<
  typeof LOGIN_SUCCEEDED,
  {
    userId: string;
    userEmail: string;
    method: "pro-connect" | "email-link";
  }
>;

export function createLoginSucceededEvent(
  id: string,
  payload: LoginSucceededEvent["payload"],
): LoginSucceededEvent {
  return {
    id,
    name: LOGIN_SUCCEEDED,
    payload,
  };
}
