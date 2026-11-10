import type {
  GetReconversionProjectImpactsResultDto,
  ReportImpactsExportedRequestDto,
} from "shared";

import type { ReconversionProjectImpactsGateway } from "../../application/project-impacts/actions";

export class HttpReconversionProjectImpactsApi implements ReconversionProjectImpactsGateway {
  async getReconversionProjectImpacts(
    reconversionProjectId: string,
  ): Promise<GetReconversionProjectImpactsResultDto | undefined> {
    const response = await fetch(`/api/reconversion-projects/${reconversionProjectId}/impacts`);

    // 404: unknown project id, 400: malformed project id
    if (response.status === 404 || response.status === 400) return undefined;

    if (!response.ok)
      throw new Error(`Error while fetching reconversion projects break even level`);

    const jsonResponse = (await response.json()) as GetReconversionProjectImpactsResultDto;
    return jsonResponse;
  }

  async reportImpactsExported(
    reconversionProjectId: string,
    impactsExport: ReportImpactsExportedRequestDto,
  ): Promise<void> {
    const response = await fetch(
      `/api/reconversion-projects/${reconversionProjectId}/report-impacts-exported`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(impactsExport),
      },
    );

    if (!response.ok) throw new Error("Error while reporting the impacts export");
  }
}
