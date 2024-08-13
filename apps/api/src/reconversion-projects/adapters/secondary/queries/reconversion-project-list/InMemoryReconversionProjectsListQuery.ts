import {
  ReconversionProjectsGroupedBySite,
  ReconversionProjectsListQuery,
} from "src/reconversion-projects/core/usecases/getUserReconversionProjectsBySite.usecase";

export class InMemoryReconversionProjectsListQuery implements ReconversionProjectsListQuery {
  constructor(
    private readonly reconversionProjectsBySite: ReconversionProjectsGroupedBySite = [],
  ) {}

  getGroupedBySite(): Promise<ReconversionProjectsGroupedBySite> {
    return Promise.resolve(this.reconversionProjectsBySite);
  }
}
