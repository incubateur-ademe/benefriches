import { DomainEvent } from "src/shared-kernel/domainEvent";

export const SITE_CREATED = "site.created";

export type SiteCreatedEvent = DomainEvent<
  typeof SITE_CREATED,
  {
    siteId: string;
    createdBy: string;
  }
>;

export const createSiteCreatedEvent = (
  id: string,
  payload: SiteCreatedEvent["payload"],
): SiteCreatedEvent => {
  return {
    id,
    name: SITE_CREATED,
    payload,
  };
};
