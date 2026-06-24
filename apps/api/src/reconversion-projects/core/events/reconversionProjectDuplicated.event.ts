import { DomainEvent } from "src/shared-kernel/domainEvent";

type ReconversionProjectDuplicatedEventPayload = {
  sourceProjectId: string;
  newProjectId: string;
  userId: string;
};

export const createReconversionProjectDuplicatedEvent = (
  id: string,
  payload: ReconversionProjectDuplicatedEventPayload,
): DomainEvent<"reconversion-project.duplicated", ReconversionProjectDuplicatedEventPayload> => {
  return {
    id,
    name: "reconversion-project.duplicated",
    payload,
  };
};
