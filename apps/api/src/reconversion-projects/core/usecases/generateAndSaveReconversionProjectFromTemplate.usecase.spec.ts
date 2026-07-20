import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { reconversionProjectTemplateSchema } from "shared";
import { v4 as uuid } from "uuid";

import { FakePhotovoltaicDataProvider } from "src/photovoltaic-performance/adapters/secondary/photovoltaic-data-provider/FakePhotovoltaicDataProvider";
import { InMemoryReconversionProjectRepository } from "src/reconversion-projects/adapters/secondary/repositories/reconversion-project/InMemoryReconversionProjectRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import { FailureResult } from "src/shared-kernel/result";
import { UidGenerator } from "src/shared-kernel/uidGenerator";
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
        new FakePhotovoltaicDataProvider(),
        new InMemoryUserQuery(),
      );
    reconversionProjectRepository = new InMemoryReconversionProjectRepository();
    eventPublisher = new InMemoryEventPublisher();
    idGenerator = new RandomUuidGenerator();
  });

  describe("Error cases", () => {
    for (const template of reconversionProjectTemplateSchema.options) {
      it(`cannot create a template ${template} reconversion project with a non-existing site`, async () => {
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
        assert.strictEqual(result.isFailure(), true);
        assert.strictEqual((result as FailureResult).getError(), "SiteNotFound");
      });
    }
  });

  for (const template of reconversionProjectTemplateSchema.options) {
    it(`should generate and save a ${template} project with default name, given related site id, createdBy, createdAt and creationMode`, async () => {
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
      assert.strictEqual(result.isSuccess(), true);

      const createdReconversionProjects: ReconversionProjectSaveDto[] =
        reconversionProjectRepository._getReconversionProjects();
      assert.strictEqual(createdReconversionProjects.length, 1);
      const createdReconversionProject = createdReconversionProjects[0];
      assert.deepStrictEqual(createdReconversionProject?.id, reconversionProjectId);
      assert.deepStrictEqual(createdReconversionProject?.relatedSiteId, site.id);
      assert.deepStrictEqual(createdReconversionProject?.createdBy, creatorId);
      assert.deepStrictEqual(createdReconversionProject?.creationMode, "express");

      // success published event
      assert.strictEqual(eventPublisher.events.length, 1);
      const event = eventPublisher.events[0];
      assert.deepStrictEqual(event?.name, RECONVERSION_PROJECT_CREATED);
      assert.deepStrictEqual(event?.payload, {
        reconversionProjectId,
        siteId: site.id,
        createdBy: creatorId,
      });
    });
  }
});
