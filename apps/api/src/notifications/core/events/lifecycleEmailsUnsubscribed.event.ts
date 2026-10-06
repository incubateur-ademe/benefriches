import type { DomainEvent } from "src/shared-kernel/domainEvent";

export const LIFECYCLE_EMAILS_UNSUBSCRIBED = "lifecycle-emails.unsubscribed";

// No token in the payload: events are stored in domain_events and the token never expires.
export type LifecycleEmailsUnsubscribedEvent = DomainEvent<
  typeof LIFECYCLE_EMAILS_UNSUBSCRIBED,
  {
    userId: string;
  }
>;

export const createLifecycleEmailsUnsubscribedEvent = (
  id: string,
  payload: LifecycleEmailsUnsubscribedEvent["payload"],
): LifecycleEmailsUnsubscribedEvent => {
  return {
    id,
    name: LIFECYCLE_EMAILS_UNSUBSCRIBED,
    payload,
  };
};
