import z from "zod";

const pdfExportSectionIdSchema = z.enum([
  "siteFeatures",
  "projectFeatures",
  "economicBalance",
  "socioEconomicImpacts",
  "socialImpacts",
  "environmentalImpacts",
  "aboutBenefriches",
]);

export type PdfExportSectionId = z.infer<typeof pdfExportSectionIdSchema>;

export type PdfExportSectionSelection = Record<PdfExportSectionId, boolean>;

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
