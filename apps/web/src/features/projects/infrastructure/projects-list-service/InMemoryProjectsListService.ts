import { ReconversionProjectsListGateway } from "../../application/projects-list/projectsList.actions";
import { ReconversionProjectsGroupedBySite } from "../../domain/projects.types";

export class InMemoryReconversionProjectsListService implements ReconversionProjectsListGateway {
  constructor(
    private readonly reconversionProjects: ReconversionProjectsGroupedBySite,
    private readonly shouldFail = false,
  ) {}

  getGroupedBySite(): Promise<ReconversionProjectsGroupedBySite> {
    if (this.shouldFail) throw new Error("Intended error");

    return Promise.resolve(this.reconversionProjects);
  }
}
