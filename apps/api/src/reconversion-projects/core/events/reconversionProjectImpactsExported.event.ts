import type { ImpactsExportFormat, PdfExportSectionSelection } from "shared";

import { DomainEvent } from "src/shared-kernel/domainEvent";

export const RECONVERSION_PROJECT_IMPACTS_EXPORTED = "reconversion-project.impacts-exported";

export type ReconversionProjectImpactsExportedEvent = DomainEvent<
  typeof RECONVERSION_PROJECT_IMPACTS_EXPORTED,
  {
    userId: string;
    reconversionProjectId: string;
    format: ImpactsExportFormat;
    sections: PdfExportSectionSelection;
  }
>;

export const createReconversionProjectImpactsExportedEvent = (
  id: string,
  payload: ReconversionProjectImpactsExportedEvent["payload"],
): ReconversionProjectImpactsExportedEvent => {
  return {
    id,
    name: RECONVERSION_PROJECT_IMPACTS_EXPORTED,
    payload,
  };
};
