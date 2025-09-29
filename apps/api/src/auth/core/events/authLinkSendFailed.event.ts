import { DomainEvent } from "src/shared-kernel/domainEvent";

export const AUTH_LINK_SEND_FAILED = "auth.link-send-failed";

export type AuthLinkSendFailedEvent = DomainEvent<{
  userEmail?: string;
  error: string | null;
}>;

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
