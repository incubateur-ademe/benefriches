import type { GetReconversionProjectImpactsResultDto } from "shared";

import type { ReconversionProjectImpactsGateway } from "../../application/project-impacts/actions";

export class MockReconversionProjectImpactsApi implements ReconversionProjectImpactsGateway {
  data: GetReconversionProjectImpactsResultDto | undefined = undefined;
  projectNotFound = false;

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
}
