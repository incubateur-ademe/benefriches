import z from "zod";

// Formats a user can download a project's impacts in. Only PDF is offered today; Excel and the
// sharing link are disabled in the UI.
export const impactsExportFormatSchema = z.enum(["pdf"]);

export type ImpactsExportFormat = z.infer<typeof impactsExportFormatSchema>;

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

// Exhaustive: every section id is required, with whether the user included it in the PDF.
export const pdfExportSectionSelectionSchema = z.record(pdfExportSectionIdSchema, z.boolean());

export type PdfExportSectionSelection = z.infer<typeof pdfExportSectionSelectionSchema>;
