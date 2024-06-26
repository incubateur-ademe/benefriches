import {
  ReconversionProjectsGroupedBySite,
  ReconversionProjectsListRepository,
} from "src/reconversion-projects/core/usecases/getUserReconversionProjectsBySite.usecase";

export class InMemoryReconversionProjectsListRepository
  implements ReconversionProjectsListRepository
{
  constructor(
    private readonly reconversionProjectsBySite: ReconversionProjectsGroupedBySite = [],
  ) {}

  getGroupedBySite(): Promise<ReconversionProjectsGroupedBySite> {
    return Promise.resolve(this.reconversionProjectsBySite);
  }
}
