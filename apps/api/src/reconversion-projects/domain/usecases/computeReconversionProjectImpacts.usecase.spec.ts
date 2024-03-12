import { v4 as uuid } from "uuid";
import { InMemoryReconversionProjectRepository } from "src/reconversion-projects/adapters/secondary/reconversion-project-repository/InMemoryReconversionProjectRepository";
import { InMemorySitesRepository } from "src/sites/adapters/secondary/site-repository/InMemorySiteRepository";
import { buildMinimalFriche } from "src/sites/domain/models/site.mock";
import { buildReconversionProject } from "../model/reconversionProject.mock";
import {
  ComputeReconversionProjectImpactsUseCase,
  Result,
} from "./computeReconversionProjectImpacts.usecase";

describe("ComputeReconversionProjectImpactsUseCase", () => {
  it("throws error when reconversion project does not exist", async () => {
    const projectRepository = new InMemoryReconversionProjectRepository();
    const siteRepository = new InMemorySitesRepository();
    const usecase = new ComputeReconversionProjectImpactsUseCase(projectRepository, siteRepository);

    const reconversionProjectId = uuid();
    await expect(usecase.execute({ reconversionProjectId })).rejects.toThrow(
      `ReconversionProject with id ${reconversionProjectId} not found`,
    );
  });

  it("throws error when reconversion project related site does not exist", async () => {
    const reconversionProjectId = uuid();
    const siteId = uuid();
    const projectRepository = new InMemoryReconversionProjectRepository();
    projectRepository._setReconversionProjects([
      buildReconversionProject({ id: reconversionProjectId, relatedSiteId: siteId }),
    ]);
    const siteRepository = new InMemorySitesRepository();
    const usecase = new ComputeReconversionProjectImpactsUseCase(projectRepository, siteRepository);

    await expect(usecase.execute({ reconversionProjectId })).rejects.toThrow(
      `Site with id ${siteId} not found`,
    );
  });

  it("returns impacts for a reconversion project dedicated to renewable energy production on friche with contaminated soil", async () => {
    const reconversionProject = buildReconversionProject({
      id: uuid(),
      name: "Project with big impacts",
      relatedSiteId: uuid(),
      soilsDistribution: {
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
        PRAIRIE_TREES: 20000,
        BUILDINGS: 20000,
        MINERAL_SOIL: 20000,
        IMPERMEABLE_SOILS: 30000,
      },
    });
    const site = buildMinimalFriche({
      id: reconversionProject.relatedSiteId,
      hasContaminatedSoils: true,
      contaminatedSoilSurface: 20000,
      name: "My base site",
      surfaceArea: 100000,
      soilsDistribution: {
        ...reconversionProject.soilsDistribution,
        PRAIRIE_TREES: 0,
        IMPERMEABLE_SOILS: 10000,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 40000,
      },
    });
    const projectRepository = new InMemoryReconversionProjectRepository();
    projectRepository._setReconversionProjects([reconversionProject]);
    const siteRepository = new InMemorySitesRepository();
    siteRepository._setSites([site]);

    const usecase = new ComputeReconversionProjectImpactsUseCase(projectRepository, siteRepository);
    const result = await usecase.execute({ reconversionProjectId: reconversionProject.id });
    expect(result).toEqual<Result>({
      id: reconversionProject.id,
      name: reconversionProject.name,
      relatedSiteId: site.id,
      relatedSiteName: site.name,
      impacts: {
        contaminatedSurfaceArea: {
          base: 20000,
          forecast: 0,
        },
        permeableSurfaceArea: {
          base: 60000,
          forecast: 50000,
          greenSoil: {
            base: 40000,
            forecast: 30000,
          },
          mineralSoil: {
            base: 20000,
            forecast: 20000,
          },
        },
      },
    });
  });
});
