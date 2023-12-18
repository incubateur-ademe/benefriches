import {
  ProjectRepository,
  SoilsDistribution,
} from "src/project-impacts/core/getProjectPermeableSoilsImpacts.usecase";

export class InMemoryProjectRepository implements ProjectRepository {
  constructor(
    private readonly soilsDistribution: {
      current: SoilsDistribution;
      future: SoilsDistribution;
    },
    private readonly options = { shouldFail: false },
  ) {}

  getProjectCurrentAndFutureSoilsDistribution(): Promise<{
    current: SoilsDistribution;
    future: SoilsDistribution;
  }> {
    if (this.options.shouldFail) throw new Error("Error in ProjectRepository");
    return Promise.resolve(this.soilsDistribution);
  }
}
