import { InMemoryProjectRepository } from "../adapters/secondary/project-repository/InMemoryProjectRepository";
import { GetProjectContaminatedSoilsImpactUseCase } from "./getProjectContaminatedSoilsImpact.usecase";

describe("GetProjectContaminatedSoilsImpactUseCase", () => {
  it("should return 0 when no decontamination", async () => {
    const projectRepository = new InMemoryProjectRepository({
      soilsDistribution: {
        current: [],
        future: [],
      },
      decontaminatedSoilsSurface: 0,
    });
    const usecase = new GetProjectContaminatedSoilsImpactUseCase(projectRepository);
    const result = await usecase.execute({ projectId: "project-id-1" });
    expect(result).toEqual({ contaminatedSoilsSurfaceDifference: 0 });
  });

  it("should return 35000 when 35000 square meters of decontamination", async () => {
    const projectRepository = new InMemoryProjectRepository({
      soilsDistribution: {
        current: [],
        future: [],
      },
      decontaminatedSoilsSurface: 35000,
    });
    const usecase = new GetProjectContaminatedSoilsImpactUseCase(projectRepository);
    const result = await usecase.execute({ projectId: "project-id-1" });
    expect(result).toEqual({ contaminatedSoilsSurfaceDifference: 35000 });
  });
});
