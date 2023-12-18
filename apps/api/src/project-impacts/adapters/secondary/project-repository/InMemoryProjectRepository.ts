import { ProjectRepository as ContaminatedSoilProjectRepository } from "src/project-impacts/core/getProjectContaminatedSoilsImpact.usecase";
import {
  ProjectRepository as SoilsDistributionProjectRepository,
  SoilsDistribution,
} from "src/project-impacts/core/getProjectPermeableSoilsImpacts.usecase";

type CurrentAndFutureSoilsDistribution = {
  current: SoilsDistribution;
  future: SoilsDistribution;
};

type MockProjectData = {
  soilsDistribution: CurrentAndFutureSoilsDistribution;
  decontaminatedSoilsSurface: number | null;
};

export class InMemoryProjectRepository
  implements
    SoilsDistributionProjectRepository,
    ContaminatedSoilProjectRepository
{
  constructor(
    private readonly projectData: MockProjectData,
    private readonly options = { shouldFail: false },
  ) {}

  getProjectCurrentAndFutureSoilsDistribution(): Promise<{
    current: SoilsDistribution;
    future: SoilsDistribution;
  }> {
    if (this.options.shouldFail) throw new Error("Error in ProjectRepository");
    return Promise.resolve(this.projectData.soilsDistribution);
  }

  getProjectDecontaminatedSoilsSurface(): Promise<number | null> {
    if (this.options.shouldFail) throw new Error("Error in ProjectRepository");
    return Promise.resolve(this.projectData.decontaminatedSoilsSurface);
  }
}
