import z from "zod";

import {
  impactsExportFormatSchema,
  pdfExportSectionSelectionSchema,
} from "../../reconversion-project-impacts/impacts-export";

// No userId: the API takes the user from the access token, never from the body.
export const reportImpactsExportedRequestDtoSchema = z.object({
  format: impactsExportFormatSchema,
  sections: pdfExportSectionSelectionSchema,
});

export type ReportImpactsExportedRequestDto = z.infer<typeof reportImpactsExportedRequestDtoSchema>;
