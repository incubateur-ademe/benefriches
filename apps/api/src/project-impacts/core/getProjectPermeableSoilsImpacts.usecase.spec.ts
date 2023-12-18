import { InMemoryProjectRepository } from "../adapters/secondary/project-repository/InMemoryProjectRepository";
import { GetProjectPermeableSoilsImpactsUseCase } from "./getProjectPermeableSoilsImpacts.usecase";

describe("GetProjectPermeableSoilsImpactsUseCase", () => {
  it("should return 0 when no soils on current site and project", async () => {
    const projectRepository = new InMemoryProjectRepository({
      soilsDistribution: {
        current: [],
        future: [],
      },
      decontaminatedSoilsSurface: 0,
    });
    const usecase = new GetProjectPermeableSoilsImpactsUseCase(
      projectRepository,
    );
    const result = await usecase.execute({ projectId: "project-id" });
    expect(result).toEqual({ permeableSoilsSurfaceDifference: 0 });
  });

  it("should return 1000 when project has 1000 more m2 of tree filled artifical soil", async () => {
    const projectRepository = new InMemoryProjectRepository({
      soilsDistribution: {
        current: [
          { type: "BUILDINGS", surfaceArea: 3000 },
          { type: "IMPERMEABLE_SOILS", surfaceArea: 2000 },
          { type: "PRAIRIE_BUSHES", surfaceArea: 1200 },
        ],
        future: [
          { type: "BUILDINGS", surfaceArea: 2500 },
          { type: "IMPERMEABLE_SOILS", surfaceArea: 1500 },
          { type: "PRAIRIE_BUSHES", surfaceArea: 1200 },
          { type: "ARTIFICIAL_TREE_FILLED", surfaceArea: 1000 },
        ],
      },
      decontaminatedSoilsSurface: 0,
    });
    const usecase = new GetProjectPermeableSoilsImpactsUseCase(
      projectRepository,
    );
    const result = await usecase.execute({ projectId: "project-id-1" });
    expect(result).toEqual({ permeableSoilsSurfaceDifference: 1000 });
  });

  it("should return 2000 when project has 1000 more m2 of prairie and mineral soils", async () => {
    const projectRepository = new InMemoryProjectRepository({
      soilsDistribution: {
        current: [
          { type: "BUILDINGS", surfaceArea: 3000 },
          { type: "IMPERMEABLE_SOILS", surfaceArea: 2000 },
          { type: "PRAIRIE_BUSHES", surfaceArea: 1200 },
        ],
        future: [
          { type: "BUILDINGS", surfaceArea: 1000 },
          { type: "IMPERMEABLE_SOILS", surfaceArea: 2000 },
          { type: "PRAIRIE_BUSHES", surfaceArea: 2200 },
          { type: "MINERAL_SOIL", surfaceArea: 1000 },
        ],
      },
      decontaminatedSoilsSurface: 0,
    });
    const usecase = new GetProjectPermeableSoilsImpactsUseCase(
      projectRepository,
    );
    const result = await usecase.execute({ projectId: "project-id-1" });
    expect(result).toEqual({ permeableSoilsSurfaceDifference: 2000 });
  });

  it("should return -5000 when project has 5000 less m2 of forest", async () => {
    const projectRepository = new InMemoryProjectRepository({
      soilsDistribution: {
        current: [
          { type: "BUILDINGS", surfaceArea: 3000 },
          { type: "IMPERMEABLE_SOILS", surfaceArea: 2000 },
          { type: "FOREST_MIXED", surfaceArea: 7000 },
        ],
        future: [
          { type: "BUILDINGS", surfaceArea: 5000 },
          { type: "IMPERMEABLE_SOILS", surfaceArea: 5000 },
          { type: "FOREST_MIXED", surfaceArea: 2000 },
        ],
      },
      decontaminatedSoilsSurface: 0,
    });
    const usecase = new GetProjectPermeableSoilsImpactsUseCase(
      projectRepository,
    );
    const result = await usecase.execute({ projectId: "project-id-1" });
    expect(result).toEqual({ permeableSoilsSurfaceDifference: -5000 });
  });

  it("should throw an error when no project id", async () => {
    const projectRepository = new InMemoryProjectRepository({
      soilsDistribution: {
        current: [],
        future: [],
      },
      decontaminatedSoilsSurface: 0,
    });
    const usecase = new GetProjectPermeableSoilsImpactsUseCase(
      projectRepository,
    );
    // @ts-expect-error no project id passed
    await expect(usecase.execute({ projectId: undefined })).rejects.toThrow(
      "projectId is required",
    );
  });

  it("should throw an error when can't retrieve soils distribution for project", async () => {
    const projectRepository = new InMemoryProjectRepository(
      {
        soilsDistribution: {
          current: [],
          future: [],
        },
        decontaminatedSoilsSurface: 0,
      },
      { shouldFail: true },
    );
    const usecase = new GetProjectPermeableSoilsImpactsUseCase(
      projectRepository,
    );
    await expect(
      usecase.execute({ projectId: "project-id-1" }),
    ).rejects.toThrow(
      "Error while retrieving soils distribution for project project-id-1",
    );
  });
});
