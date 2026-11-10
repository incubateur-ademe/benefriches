import type { PdfExportSectionSelection } from "shared";

export type { PdfExportSectionId, PdfExportSectionSelection } from "shared";

export const getDefaultSectionSelection = (): PdfExportSectionSelection => ({
  siteFeatures: true,
  projectFeatures: true,
  economicBalance: true,
  socioEconomicImpacts: true,
  socialImpacts: true,
  environmentalImpacts: true,
  aboutBenefriches: true,
});

export const hasAtLeastOneSectionSelected = (selection: PdfExportSectionSelection): boolean =>
  Object.values(selection).some(Boolean);
