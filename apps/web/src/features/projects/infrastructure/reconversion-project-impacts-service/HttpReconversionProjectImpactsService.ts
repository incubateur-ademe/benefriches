import { ReconversionProjectImpactsBreakEvenLevel } from "shared";

import {
  ReconversionProjectImpactsGateway,
  ReconversionProjectImpactsResult,
} from "../../application/project-impacts/actions";

export class HttpReconversionProjectImpactsApi implements ReconversionProjectImpactsGateway {
  async getReconversionProjectImpacts(
    reconversionProjectId: string,
    evaluationPeriodInYears?: number,
  ): Promise<ReconversionProjectImpactsResult> {
    const url = `/api/reconversion-projects/${reconversionProjectId}/impacts`;
    const response = await fetch(
      evaluationPeriodInYears === undefined
        ? url
        : `${url}?evaluationPeriodInYears=${evaluationPeriodInYears}`,
    );

    if (!response.ok) throw new Error(`Error while fetching reconversion projects`);

    const jsonResponse = (await response.json()) as ReconversionProjectImpactsResult;
    return jsonResponse;
  }

  async getReconversionProjectImpactsBreakEvenLevel(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectImpactsBreakEvenLevel> {
    const response = await fetch(
      `/api/reconversion-projects/${reconversionProjectId}/impacts/break-even-level`,
    );

    if (!response.ok)
      throw new Error(`Error while fetching reconversion projects break even level`);

    const jsonResponse = (await response.json()) as ReconversionProjectImpactsBreakEvenLevel;
    return jsonResponse;
  }
}
