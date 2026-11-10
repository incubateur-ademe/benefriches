import type {
  GetReconversionProjectImpactsResultDto,
  ReportImpactsExportedRequestDto,
} from "shared";

import type { ReconversionProjectImpactsGateway } from "../../application/project-impacts/actions";

export class MockReconversionProjectImpactsApi implements ReconversionProjectImpactsGateway {
  data: GetReconversionProjectImpactsResultDto | undefined = undefined;
  projectNotFound = false;
  reportedImpactsExports: {
    reconversionProjectId: string;
    impactsExport: ReportImpactsExportedRequestDto;
  }[] = [];
  shouldFailReportingImpactsExport = false;

  async getReconversionProjectImpacts(): Promise<
    GetReconversionProjectImpactsResultDto | undefined
  > {
    if (this.projectNotFound) return Promise.resolve(undefined);
    if (!this.data) throw new Error("MockReconversionProjectImpactsApi error: no data");
    return Promise.resolve(this.data);
  }

  _setReconversionProjectNotFound() {
    this.projectNotFound = true;
  }

  _setReconversionProjectImpacts(data: GetReconversionProjectImpactsResultDto) {
    this.data = data;
  }

  async reportImpactsExported(
    reconversionProjectId: string,
    impactsExport: ReportImpactsExportedRequestDto,
  ): Promise<void> {
    if (this.shouldFailReportingImpactsExport)
      throw new Error("MockReconversionProjectImpactsApi error: report failed");
    this.reportedImpactsExports.push({ reconversionProjectId, impactsExport });
    return Promise.resolve();
  }

  _setReportingImpactsExportFails() {
    this.shouldFailReportingImpactsExport = true;
  }
}
