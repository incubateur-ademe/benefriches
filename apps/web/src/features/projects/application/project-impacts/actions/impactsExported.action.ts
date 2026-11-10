import type { ImpactsExportFormat, PdfExportSectionSelection } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

// Reports a download of the project's impacts to the API, which records it as an impacts export.
// Best effort: the download never waits for it and a failure is never shown to the user.
export const impactsExported = createAppAsyncThunk<
  void,
  { projectId: string; format: ImpactsExportFormat; sections: PdfExportSectionSelection }
>("projectImpacts/impactsExported", async ({ projectId, format, sections }, { extra }) => {
  try {
    await extra.reconversionProjectImpacts.reportImpactsExported(projectId, { format, sections });
  } catch {
    // Swallowed on purpose: recording the export must never affect the user.
  }
});
