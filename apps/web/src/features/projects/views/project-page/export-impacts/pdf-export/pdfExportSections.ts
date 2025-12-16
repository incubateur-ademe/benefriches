import z from "zod";

export const pdfExportSectionIdSchema = z.enum([
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

export const PDF_EXPORT_SECTION_LABELS: Record<PdfExportSectionId, string> = {
  siteFeatures: "Caractéristiques du site",
  projectFeatures: "Caractéristiques du projet",
  economicBalance: "Bilan de l'opération",
  socioEconomicImpacts: "Impacts socio-économiques",
  socialImpacts: "Impacts sociaux",
  environmentalImpacts: "Impacts environnementaux",
  aboutBenefriches: "Notice explicative",
};

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
