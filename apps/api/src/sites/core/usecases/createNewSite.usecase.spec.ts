/* oxlint-disable typescript-eslint/no-unsafe-assignment */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import type { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import type { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import type { FailureResult } from "src/shared-kernel/result";
import { InMemorySitesRepository } from "src/sites/adapters/secondary/site-repository/InMemorySiteRepository";

import type { SiteCreatedEvent } from "../events/siteCreated.event";
import { SITE_CREATED } from "../events/siteCreated.event";
import {
  buildAgriculturalOrNaturalSite,
  buildAgriculturalOperationSiteProps,
  buildFriche,
  buildFricheProps,
  buildUrbanZoneSite,
  buildUrbanZoneSiteProps,
} from "../models/site.mock";
import type { SiteEntity } from "../models/siteEntity";
import { CreateNewCustomSiteUseCase } from "./createNewSite.usecase";

describe("CreateNewSite Use Case", () => {
  let siteRepository: InMemorySitesRepository;
  let dateProvider: DateProvider;
  let uuidGenerator: UidGenerator;
  let eventPublisher: InMemoryEventPublisher;
  const fakeNow = new Date("2024-01-03T13:50:45");

  beforeEach(() => {
    siteRepository = new InMemorySitesRepository();
    dateProvider = new DeterministicDateProvider(fakeNow);
    uuidGenerator = new RandomUuidGenerator();
    eventPublisher = new InMemoryEventPublisher();
  });

  it("Cannot create a new friche with invalid props", async () => {
    // @ts-expect-error invalid name
    const fricheProps = buildFricheProps({ name: 123 });

    const usecase = new CreateNewCustomSiteUseCase(
      siteRepository,
      dateProvider,
      uuidGenerator,
      eventPublisher,
    );
    const result = await usecase.execute({
      siteProps: { ...fricheProps, nature: "FRICHE" },
      createdBy: "user-123",
    });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual(
      (result as FailureResult<"ValidationError", unknown>).getError(),
      "ValidationError",
    );
    assert.deepStrictEqual((result as FailureResult<"ValidationError", unknown>).getIssues(), {
      name: ["Invalid input: expected string, received number"],
    });
    assert.strictEqual(eventPublisher.events.length, 0);
  });

  it("Cannot create a site when already exists", async () => {
    const fricheProps = buildFricheProps();
    const siteProps = { nature: "FRICHE", ...fricheProps } as const;

    siteRepository._setSites([
      {
        ...buildFriche(fricheProps),
        createdBy: "blabla",
        creationMode: "custom",
        createdAt: new Date(),
        status: "active",
      },
    ]);

    const usecase = new CreateNewCustomSiteUseCase(
      siteRepository,
      dateProvider,
      uuidGenerator,
      eventPublisher,
    );
    const result = await usecase.execute({
      siteProps,
      createdBy: "blabla",
    });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual((result as FailureResult).getError(), "SiteAlreadyExists");
    assert.strictEqual(siteRepository._getSites().length, 1);
    assert.strictEqual(eventPublisher.events.length, 0);
  });

  describe("Agricultural or natura site", () => {
    it("Can create a new agricultural site with minimal data", async () => {
      const agriculturalOperationProps = buildAgriculturalOperationSiteProps();
      const usecase = new CreateNewCustomSiteUseCase(
        siteRepository,
        dateProvider,
        uuidGenerator,
        eventPublisher,
      );

      await usecase.execute({
        siteProps: agriculturalOperationProps,
        createdBy: "user-id-123",
      });

      const savedSites = siteRepository._getSites();

      assert.deepStrictEqual(savedSites, [
        {
          ...buildAgriculturalOrNaturalSite(agriculturalOperationProps),
          createdAt: fakeNow,
          createdBy: "user-id-123",
          creationMode: "custom",
          status: "active",
        },
      ] satisfies SiteEntity[]);

      const siteId = savedSites[0]!.id;
      assert.strictEqual(eventPublisher.events.length, 1);
      assert.ok(typeof eventPublisher.events[0]!.id === "string");
      assert.deepStrictEqual(eventPublisher.events[0], {
        id: eventPublisher.events[0]!.id,
        name: SITE_CREATED,
        payload: {
          siteId,
          createdBy: "user-id-123",
        },
      } satisfies SiteCreatedEvent);
    });

    it("Can create a new agricultural site with complete data", async () => {
      const siteProps = buildAgriculturalOperationSiteProps({
        description: "Description of site",
        tenant: {
          structureType: "company",
          name: "Tenant SARL",
        },
        yearlyExpenses: [{ amount: 45000, bearer: "owner", purpose: "maintenance" }],
        yearlyIncomes: [
          { amount: 20000, source: "other" },
          { amount: 32740.3, source: "other" },
        ],
      });

      const usecase = new CreateNewCustomSiteUseCase(
        siteRepository,
        dateProvider,
        uuidGenerator,
        eventPublisher,
      );

      await usecase.execute({
        createdBy: "user-id-123",
        siteProps,
      });

      const savedSites = siteRepository._getSites();

      assert.deepStrictEqual(savedSites, [
        {
          ...buildAgriculturalOrNaturalSite(siteProps),
          createdAt: fakeNow,
          createdBy: "user-id-123",
          creationMode: "custom",
          status: "active",
        },
      ] satisfies SiteEntity[]);

      const siteId = savedSites[0]!.id;
      assert.strictEqual(eventPublisher.events.length, 1);
      assert.ok(typeof eventPublisher.events[0]!.id === "string");
      assert.deepStrictEqual(eventPublisher.events[0], {
        id: eventPublisher.events[0]!.id,
        name: SITE_CREATED,
        payload: {
          siteId,
          createdBy: "user-id-123",
        },
      } satisfies SiteCreatedEvent);
    });
  });

  describe("Friche", () => {
    it("Can create a new friche with minimal data", async () => {
      const fricheProps = buildFricheProps();
      const siteProps = { nature: "FRICHE", ...fricheProps } as const;

      const usecase = new CreateNewCustomSiteUseCase(
        siteRepository,
        dateProvider,
        uuidGenerator,
        eventPublisher,
      );

      await usecase.execute({
        createdBy: "user-id-123",
        siteProps,
      });

      const savedSites = siteRepository._getSites();

      assert.deepStrictEqual(savedSites, [
        {
          ...buildFriche(fricheProps),
          createdAt: fakeNow,
          createdBy: "user-id-123",
          creationMode: "custom",
          status: "active",
        },
      ] satisfies SiteEntity[]);

      const siteId = savedSites[0]!.id;
      assert.strictEqual(eventPublisher.events.length, 1);
      assert.ok(typeof eventPublisher.events[0]!.id === "string");
      assert.deepStrictEqual(eventPublisher.events[0], {
        id: eventPublisher.events[0]!.id,
        name: SITE_CREATED,
        payload: {
          siteId,
          createdBy: "user-id-123",
        },
      } satisfies SiteCreatedEvent);
    });

    it("Can create a new friche with complete data", async () => {
      const fricheProps = buildFricheProps({
        description: "Description of site",
        tenant: {
          structureType: "company",
          name: "Tenant SARL",
        },
        // friche-only data
        fricheActivity: "INDUSTRY",
        contaminatedSoilSurface: 1400,
        accidentsMinorInjuries: 2,
        accidentsSevereInjuries: 2,
        accidentsDeaths: 2,
      });
      const siteProps = { nature: "FRICHE", ...fricheProps } as const;

      const usecase = new CreateNewCustomSiteUseCase(
        siteRepository,
        dateProvider,
        uuidGenerator,
        eventPublisher,
      );

      await usecase.execute({
        createdBy: "user-id-123",
        siteProps,
      });

      const savedSites = siteRepository._getSites();

      assert.deepStrictEqual(savedSites, [
        {
          ...buildFriche(fricheProps),
          createdAt: fakeNow,
          createdBy: "user-id-123",
          creationMode: "custom",
          status: "active",
        },
      ] satisfies SiteEntity[]);

      const siteId = savedSites[0]!.id;
      assert.strictEqual(eventPublisher.events.length, 1);
      assert.ok(typeof eventPublisher.events[0]!.id === "string");
      assert.deepStrictEqual(eventPublisher.events[0], {
        id: eventPublisher.events[0]!.id,
        name: SITE_CREATED,
        payload: {
          siteId,
          createdBy: "user-id-123",
        },
      } satisfies SiteCreatedEvent);
    });
  });

  describe("Urban zone", () => {
    it("Can create a new urban zone site", async () => {
      const urbanZoneProps = buildUrbanZoneSiteProps();
      const siteProps = { nature: "URBAN_ZONE" as const, ...urbanZoneProps };

      const usecase = new CreateNewCustomSiteUseCase(
        siteRepository,
        dateProvider,
        uuidGenerator,
        eventPublisher,
      );

      await usecase.execute({
        createdBy: "user-id-123",
        siteProps,
      });

      const savedSites = siteRepository._getSites();

      assert.deepStrictEqual(savedSites, [
        {
          ...buildUrbanZoneSite(urbanZoneProps),
          createdAt: fakeNow,
          createdBy: "user-id-123",
          creationMode: "custom",
          status: "active",
        },
      ] satisfies SiteEntity[]);

      const siteId = savedSites[0]!.id;
      assert.strictEqual(eventPublisher.events.length, 1);
      assert.ok(typeof eventPublisher.events[0]!.id === "string");
      assert.deepStrictEqual(eventPublisher.events[0], {
        id: eventPublisher.events[0]!.id,
        name: SITE_CREATED,
        payload: {
          siteId,
          createdBy: "user-id-123",
        },
      } satisfies SiteCreatedEvent);
    });

    it("Cannot create an urban zone site with invalid props", async () => {
      const urbanZoneProps = buildUrbanZoneSiteProps({ landParcels: [] });
      const siteProps = { nature: "URBAN_ZONE" as const, ...urbanZoneProps };

      const usecase = new CreateNewCustomSiteUseCase(
        siteRepository,
        dateProvider,
        uuidGenerator,
        eventPublisher,
      );
      const result = await usecase.execute({
        siteProps,
        createdBy: "user-123",
      });

      assert.strictEqual(result.isFailure(), true);
      assert.strictEqual(
        (result as FailureResult<"ValidationError", unknown>).getError(),
        "ValidationError",
      );
      assert.strictEqual(eventPublisher.events.length, 0);
    });
  });
});
