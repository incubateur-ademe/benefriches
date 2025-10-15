import { expressProjectCategorySchema } from "shared";
import { v4 as uuid } from "uuid";

import { MockPhotovoltaicGeoInfoSystemApi } from "src/photovoltaic-performance/adapters/secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi.mock";
import { InMemoryReconversionProjectRepository } from "src/reconversion-projects/adapters/secondary/repositories/reconversion-project/InMemoryReconversionProjectRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { InMemorySitesQuery } from "src/sites/adapters/secondary/site-query/InMemorySitesQuery";
import { SiteViewModel } from "src/sites/core/usecases/getSiteById.usecase";
import { InMemoryUserQuery } from "src/users/adapters/secondary/user-query/InMemoryUserQuery";

import { ReconversionProjectInput } from "../model/reconversionProject";
import { GenerateAndSaveExpressReconversionProjectUseCase } from "./generateAndSaveExpressReconversionProject.usecase";
import { GenerateExpressReconversionProjectUseCase } from "./generateExpressReconversionProject.usecase";

const EXPRESS_CATEGORIES = expressProjectCategorySchema.options;

const site: SiteViewModel = {
  id: uuid(),
  name: "Base site",
  nature: "FRICHE",
  isExpressSite: false,
  surfaceArea: 10000,
  soilsDistribution: {
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 5000,
    IMPERMEABLE_SOILS: 3000,
    MINERAL_SOIL: 2000,
  },
  contaminatedSoilSurface: 0,
  owner: {
    name: "Mairie de Montrouge",
    structureType: "municipality",
  },
  address: {
    city: "Montrouge",
    streetName: "Avenue Pierre Brossolette",
    streetNumber: "155bis",
    value: "155 bis Av. Pierre Brossolette, 92120 Montrouge",
    banId: "92049_7161_00155_bis",
    cityCode: "92049",
    postCode: "92120",
    long: 2.305116,
    lat: 48.815679,
  },
  yearlyExpenses: [],
  yearlyIncomes: [],
};

describe("GenerateAndSaveExpressReconversionProjectUseCase Use Case", () => {
  let generateExpressReconversionProjectUseCase: GenerateExpressReconversionProjectUseCase;
  let reconversionProjectRepository: InMemoryReconversionProjectRepository;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    const siteQuery = new InMemorySitesQuery();
    siteQuery._setSites([site]);

    generateExpressReconversionProjectUseCase = new GenerateExpressReconversionProjectUseCase(
      new DeterministicDateProvider(fakeNow),
      siteQuery,
      new MockPhotovoltaicGeoInfoSystemApi(),
      new InMemoryUserQuery(),
    );
    reconversionProjectRepository = new InMemoryReconversionProjectRepository();
  });

  describe("Error cases", () => {
    test.each(EXPRESS_CATEGORIES)(
      "cannot create an express %s reconversion project with a non-existing site",
      async (expressCategory) => {
        const usecase = new GenerateAndSaveExpressReconversionProjectUseCase(
          generateExpressReconversionProjectUseCase,
          reconversionProjectRepository,
        );

        const siteId = uuid();
        await expect(
          usecase.execute({
            reconversionProjectId: uuid(),
            siteId,
            createdBy: uuid(),
            category: expressCategory,
          }),
        ).rejects.toThrow(`Site with id ${siteId} does not exist`);
      },
    );
  });

  test.each(EXPRESS_CATEGORIES)(
    "should generate and save a %s project with default name, given related site id, createdBy, createdAt and creationMode",
    async (expressCategory) => {
      const usecase = new GenerateAndSaveExpressReconversionProjectUseCase(
        generateExpressReconversionProjectUseCase,
        reconversionProjectRepository,
      );

      const reconversionProjectId = uuid();
      const creatorId = uuid();
      await usecase.execute({
        reconversionProjectId,
        siteId: site.id,
        createdBy: creatorId,
        category: expressCategory,
      });

      const createdReconversionProjects: ReconversionProjectInput[] =
        reconversionProjectRepository._getReconversionProjects();
      expect(createdReconversionProjects).toHaveLength(1);
      const createdReconversionProject = createdReconversionProjects[0];
      expect(createdReconversionProject?.id).toEqual(reconversionProjectId);
      expect(createdReconversionProject?.relatedSiteId).toEqual(site.id);
      expect(createdReconversionProject?.createdBy).toEqual(creatorId);
      expect(createdReconversionProject?.creationMode).toEqual("express");
    },
  );
});
