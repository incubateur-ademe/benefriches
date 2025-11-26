import type { DomainEvent } from "src/shared-kernel/domainEvent";

export const RECONVERSION_PROJECT_CREATED = "reconversionProject.created";

export type ReconversionProjectCreatedEvent = DomainEvent<
  typeof RECONVERSION_PROJECT_CREATED,
  {
    reconversionProjectId: string;
    siteId: string;
    createdBy: string;
  }
>;

export const createReconversionProjectCreatedEvent = (
  id: string,
  payload: ReconversionProjectCreatedEvent["payload"],
): ReconversionProjectCreatedEvent => {
  return {
    id,
    name: RECONVERSION_PROJECT_CREATED,
    payload,
  };
};
