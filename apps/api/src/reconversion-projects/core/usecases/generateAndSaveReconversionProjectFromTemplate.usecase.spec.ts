import { reconversionProjectTemplateSchema } from "shared";
import { v4 as uuid } from "uuid";

import { MockPhotovoltaicGeoInfoSystemApi } from "src/photovoltaic-performance/adapters/secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi.mock";
import { InMemoryReconversionProjectRepository } from "src/reconversion-projects/adapters/secondary/repositories/reconversion-project/InMemoryReconversionProjectRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { FailureResult } from "src/shared-kernel/result";
import { InMemorySitesQuery } from "src/sites/adapters/secondary/site-query/InMemorySitesQuery";
import { SiteFeaturesView } from "src/sites/core/models/views";
import { InMemoryUserQuery } from "src/users/adapters/secondary/user-query/InMemoryUserQuery";

import { RECONVERSION_PROJECT_CREATED } from "../events/reconversionProjectCreated.event";
import { ReconversionProjectSaveDto } from "../model/reconversionProject";
import { GenerateAndSaveReconversionProjectFromTemplateUseCase } from "./generateAndSaveReconversionProjectFromTemplate.usecase";
import { GenerateReconversionProjectFromTemplateUseCase } from "./generateReconversionProjectFromTemplate.usecase";

const site: SiteFeaturesView = {
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

describe("GenerateAndSaveReconversionProjectFromTemplateUseCase Use Case", () => {
  let generateReconversionProjectFromTemplateUseCase: GenerateReconversionProjectFromTemplateUseCase;
  let reconversionProjectRepository: InMemoryReconversionProjectRepository;
  let eventPublisher: InMemoryEventPublisher;
  let idGenerator: UidGenerator;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    const siteQuery = new InMemorySitesQuery();
    siteQuery._setSites([site]);

    generateReconversionProjectFromTemplateUseCase =
      new GenerateReconversionProjectFromTemplateUseCase(
        new DeterministicDateProvider(fakeNow),
        siteQuery,
        new MockPhotovoltaicGeoInfoSystemApi(),
        new InMemoryUserQuery(),
      );
    reconversionProjectRepository = new InMemoryReconversionProjectRepository();
    eventPublisher = new InMemoryEventPublisher();
    idGenerator = new RandomUuidGenerator();
  });

  describe("Error cases", () => {
    it.each(reconversionProjectTemplateSchema.options)(
      "cannot create a template %s reconversion project with a non-existing site",
      async (template) => {
        const usecase = new GenerateAndSaveReconversionProjectFromTemplateUseCase(
          generateReconversionProjectFromTemplateUseCase,
          reconversionProjectRepository,
          eventPublisher,
          idGenerator,
        );

        const siteId = uuid();
        const result = await usecase.execute({
          reconversionProjectId: uuid(),
          siteId,
          createdBy: uuid(),
          template: template,
        });
        expect(result.isFailure()).toBe(true);
        expect((result as FailureResult).getError()).toBe("SiteNotFound");
      },
    );
  });

  it.each(reconversionProjectTemplateSchema.options)(
    "should generate and save a %s project with default name, given related site id, createdBy, createdAt and creationMode",
    async (template) => {
      const usecase = new GenerateAndSaveReconversionProjectFromTemplateUseCase(
        generateReconversionProjectFromTemplateUseCase,
        reconversionProjectRepository,
        eventPublisher,
        idGenerator,
      );

      const reconversionProjectId = uuid();
      const creatorId = uuid();
      const result = await usecase.execute({
        reconversionProjectId,
        siteId: site.id,
        createdBy: creatorId,
        template: template,
      });
      expect(result.isSuccess()).toBe(true);

      const createdReconversionProjects: ReconversionProjectSaveDto[] =
        reconversionProjectRepository._getReconversionProjects();
      expect(createdReconversionProjects).toHaveLength(1);
      const createdReconversionProject = createdReconversionProjects[0];
      expect(createdReconversionProject?.id).toEqual(reconversionProjectId);
      expect(createdReconversionProject?.relatedSiteId).toEqual(site.id);
      expect(createdReconversionProject?.createdBy).toEqual(creatorId);
      expect(createdReconversionProject?.creationMode).toEqual("express");

      // success published event
      expect(eventPublisher.events).toHaveLength(1);
      const event = eventPublisher.events[0];
      expect(event?.name).toEqual(RECONVERSION_PROJECT_CREATED);
      expect(event?.payload).toEqual({
        reconversionProjectId,
        siteId: site.id,
        createdBy: creatorId,
      });
    },
  );
});
