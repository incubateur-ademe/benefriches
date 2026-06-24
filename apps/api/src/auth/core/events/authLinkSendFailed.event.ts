import { DomainEvent } from "src/shared-kernel/domainEvent";

const AUTH_LINK_SEND_FAILED = "auth.link-send-failed";

type AuthLinkSendFailedEvent = DomainEvent<
  typeof AUTH_LINK_SEND_FAILED,
  {
    userEmail?: string;
    error: string | null;
  }
>;

export function createAuthLinkSendFailedEvent(
  id: string,
  payload: AuthLinkSendFailedEvent["payload"],
): AuthLinkSendFailedEvent {
  return {
    id,
    name: AUTH_LINK_SEND_FAILED,
    payload,
  };
}
