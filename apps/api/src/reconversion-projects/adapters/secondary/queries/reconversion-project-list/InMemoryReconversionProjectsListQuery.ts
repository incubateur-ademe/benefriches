import {
  ReconversionProjectsGroupedBySite,
  ReconversionProjectsListQuery,
} from "src/reconversion-projects/core/usecases/getUserReconversionProjectsBySite.usecase";

export class InMemoryReconversionProjectsListQuery implements ReconversionProjectsListQuery {
  private readonly reconversionProjectsBySite: ReconversionProjectsGroupedBySite;
  constructor(reconversionProjectsBySite: ReconversionProjectsGroupedBySite = []) {
    this.reconversionProjectsBySite = reconversionProjectsBySite;
  }

  getGroupedBySite(): Promise<ReconversionProjectsGroupedBySite> {
    return Promise.resolve(this.reconversionProjectsBySite);
  }
}
