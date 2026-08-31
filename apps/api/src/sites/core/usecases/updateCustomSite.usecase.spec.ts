import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { v4 as uuid } from "uuid";

import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/dateProvider";
import { FailureResult } from "src/shared-kernel/result";
import { InMemorySitesRepository } from "src/sites/adapters/secondary/site-repository/InMemorySiteRepository";

import { buildFriche, buildFricheProps } from "../models/site.mock";
import { UpdateCustomSiteUseCase, type SiteNotEditableReason } from "./updateCustomSite.usecase";

describe("UpdateCustomSite use case", () => {
  const fakeNow = new Date("2024-01-10T13:00:00");
  const createdAt = new Date("2024-01-05T10:00:00");

  it("fails with SiteNotFound when the site does not exist", async () => {
    const dateProvider: DateProvider = new DeterministicDateProvider(fakeNow);
    const siteRepository = new InMemorySitesRepository();
    const usecase = new UpdateCustomSiteUseCase(siteRepository, dateProvider);

    const result = await usecase.execute({
      siteId: "non-existent-id",
      userId: uuid(),
      siteProps: { ...buildFricheProps(), nature: "FRICHE" },
    });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual((result as FailureResult<"SiteNotFound">).getError(), "SiteNotFound");
  });

  it("fails with UserNotAuthorized and leaves the site untouched when the requester did not create it", async () => {
    const dateProvider: DateProvider = new DeterministicDateProvider(fakeNow);
    const siteRepository = new InMemorySitesRepository();
    const siteId = uuid();
    const site = buildFriche({ id: siteId });

    siteRepository._setSites([
      { ...site, createdAt, creationMode: "custom", createdBy: uuid(), status: "active" },
    ]);

    const usecase = new UpdateCustomSiteUseCase(siteRepository, dateProvider);

    const result = await usecase.execute({
      siteId,
      userId: uuid(),
      siteProps: { ...buildFricheProps({ id: siteId, name: "Updated name" }), nature: "FRICHE" },
    });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual(
      (result as FailureResult<"UserNotAuthorized">).getError(),
      "UserNotAuthorized",
    );

    const sites = siteRepository._getSites();
    assert.strictEqual(sites[0]?.name, site.name);
    assert.strictEqual(sites[0]?.updatedAt, undefined);
  });

  describe("SiteNotEditable", () => {
    it("fails with SiteNotEditable (reason: NOT_CUSTOM) when the site's creation mode is express", async () => {
      const dateProvider: DateProvider = new DeterministicDateProvider(fakeNow);
      const siteRepository = new InMemorySitesRepository();
      const siteId = uuid();
      const userId = uuid();
      const site = buildFriche({ id: siteId });

      siteRepository._setSites([
        { ...site, createdAt, creationMode: "express", createdBy: userId, status: "active" },
      ]);

      const usecase = new UpdateCustomSiteUseCase(siteRepository, dateProvider);

      const result = await usecase.execute({
        siteId,
        userId,
        siteProps: { ...buildFricheProps({ id: siteId }), nature: "FRICHE" },
      });

      assert.strictEqual(result.isFailure(), true);
      const failure = result as FailureResult<"SiteNotEditable", SiteNotEditableReason>;
      assert.strictEqual(failure.getError(), "SiteNotEditable");
      assert.deepStrictEqual(failure.getIssues(), {
        reason: "NOT_CUSTOM",
        creationMode: "express",
      });
    });

    it("fails with SiteNotEditable (reason: NOT_CUSTOM) when the site's creation mode is csv-import", async () => {
      const dateProvider: DateProvider = new DeterministicDateProvider(fakeNow);
      const siteRepository = new InMemorySitesRepository();
      const siteId = uuid();
      const userId = uuid();
      const site = buildFriche({ id: siteId });

      siteRepository._setSites([
        { ...site, createdAt, creationMode: "csv-import", createdBy: userId, status: "active" },
      ]);

      const usecase = new UpdateCustomSiteUseCase(siteRepository, dateProvider);

      const result = await usecase.execute({
        siteId,
        userId,
        siteProps: { ...buildFricheProps({ id: siteId }), nature: "FRICHE" },
      });

      assert.strictEqual(result.isFailure(), true);
      const failure = result as FailureResult<"SiteNotEditable", SiteNotEditableReason>;
      assert.strictEqual(failure.getError(), "SiteNotEditable");
      assert.deepStrictEqual(failure.getIssues(), {
        reason: "NOT_CUSTOM",
        creationMode: "csv-import",
      });
    });

    it("fails with SiteNotEditable (reason: ACTIVE_RECONVERSION_PROJECT) when the site has an active reconversion project", async () => {
      const dateProvider: DateProvider = new DeterministicDateProvider(fakeNow);
      const siteRepository = new InMemorySitesRepository();
      const siteId = uuid();
      const userId = uuid();
      const site = buildFriche({ id: siteId });

      siteRepository._setSites([
        { ...site, createdAt, creationMode: "custom", createdBy: userId, status: "active" },
      ]);
      siteRepository._setSitesWithActiveReconversionProjects([siteId]);

      const usecase = new UpdateCustomSiteUseCase(siteRepository, dateProvider);

      const result = await usecase.execute({
        siteId,
        userId,
        siteProps: { ...buildFricheProps({ id: siteId }), nature: "FRICHE" },
      });

      assert.strictEqual(result.isFailure(), true);
      const failure = result as FailureResult<"SiteNotEditable", SiteNotEditableReason>;
      assert.strictEqual(failure.getError(), "SiteNotEditable");
      assert.deepStrictEqual(failure.getIssues(), {
        reason: "ACTIVE_RECONVERSION_PROJECT",
      });
    });
  });

  it("succeeds when the site's only reconversion projects are not active (e.g. deleted)", async () => {
    const dateProvider: DateProvider = new DeterministicDateProvider(fakeNow);
    const siteRepository = new InMemorySitesRepository();
    const siteId = uuid();
    const userId = uuid();
    const site = buildFriche({ id: siteId });

    siteRepository._setSites([
      { ...site, createdAt, creationMode: "custom", createdBy: userId, status: "active" },
    ]);
    // no site id registered as having an active reconversion project

    const usecase = new UpdateCustomSiteUseCase(siteRepository, dateProvider);

    const result = await usecase.execute({
      siteId,
      userId,
      siteProps: { ...buildFricheProps({ id: siteId, name: "Updated name" }), nature: "FRICHE" },
    });

    assert.strictEqual(result.isSuccess(), true);
  });

  it("fails with ValidationError when the submitted payload's nature differs from the persisted site's nature", async () => {
    const dateProvider: DateProvider = new DeterministicDateProvider(fakeNow);
    const siteRepository = new InMemorySitesRepository();
    const siteId = uuid();
    const userId = uuid();
    const site = buildFriche({ id: siteId });

    siteRepository._setSites([
      { ...site, createdAt, creationMode: "custom", createdBy: userId, status: "active" },
    ]);

    const usecase = new UpdateCustomSiteUseCase(siteRepository, dateProvider);

    const result = await usecase.execute({
      siteId,
      userId,
      siteProps: {
        name: "Urban zone version",
        address: site.address,
        yearlyExpenses: [],
        yearlyIncomes: [],
        nature: "URBAN_ZONE",
        urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
        landParcels: [
          {
            type: "COMMERCIAL_ACTIVITY_AREA",
            surfaceArea: 5000,
            soilsDistribution: { BUILDINGS: 5000 },
          },
        ],
        manager: { structureType: "company", name: "Manager SARL" },
        vacantCommercialPremisesFootprint: 1000,
      },
    });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual((result as FailureResult<"ValidationError">).getError(), "ValidationError");
  });

  it("persists the revised site while preserving createdAt, createdBy, creationMode, status and id", async () => {
    const dateProvider: DateProvider = new DeterministicDateProvider(fakeNow);
    const siteRepository = new InMemorySitesRepository();
    const siteId = uuid();
    const userId = uuid();
    const site = buildFriche({ id: siteId });

    siteRepository._setSites([
      { ...site, createdAt, creationMode: "custom", createdBy: userId, status: "active" },
    ]);

    const usecase = new UpdateCustomSiteUseCase(siteRepository, dateProvider);

    const updatedProps = {
      ...buildFricheProps({ id: siteId, name: "Corrected friche name" }),
      nature: "FRICHE" as const,
    };

    const result = await usecase.execute({
      siteId,
      userId,
      siteProps: updatedProps,
    });

    assert.strictEqual(result.isSuccess(), true);

    const sites = siteRepository._getSites();
    assert.strictEqual(sites.length, 1);
    assert.strictEqual(sites[0]?.name, "Corrected friche name");
    assert.deepStrictEqual(
      {
        id: sites[0]?.id,
        createdAt: sites[0]?.createdAt,
        createdBy: sites[0]?.createdBy,
        creationMode: sites[0]?.creationMode,
        status: sites[0]?.status,
        updatedAt: sites[0]?.updatedAt,
      },
      {
        id: siteId,
        createdAt,
        createdBy: userId,
        creationMode: "custom",
        status: "active",
        updatedAt: fakeNow,
      },
    );
  });
});
