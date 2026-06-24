import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { v4 as uuid } from "uuid";

import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import type { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import type { FailureResult } from "src/shared-kernel/result";
import { InMemorySitesRepository } from "src/sites/adapters/secondary/site-repository/InMemorySiteRepository";

import { buildFriche } from "../models/site.mock";
import { ArchiveSiteUseCase } from "./archiveSite.usecase";

describe("ArchiveSite use case", () => {
  let dateProvider: DateProvider;
  let siteRepository: InMemorySitesRepository;
  const fakeNow = new Date("2024-01-10T13:00:00");
  const createdAt = new Date("2024-01-05T10:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    siteRepository = new InMemorySitesRepository();
  });

  it("fails when user is not the creator of the site", async () => {
    const siteId = uuid();
    const site = buildFriche({
      id: siteId,
    });

    siteRepository._setSites([
      {
        ...site,
        createdAt,
        creationMode: "express",
        createdBy: uuid(),
        status: "active",
      },
    ]);

    const usecase = new ArchiveSiteUseCase(siteRepository, dateProvider);

    const result = await usecase.execute({
      siteId,
      userId: uuid(),
    });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual(
      (result as FailureResult<"UserNotAuthorized">).getError(),
      "UserNotAuthorized",
    );

    const sites = siteRepository._getSites();
    assert.deepStrictEqual(sites[0]?.status, "active");
    assert.strictEqual(sites[0]?.updatedAt, undefined);
  });

  it("fails when site does not exist", async () => {
    const usecase = new ArchiveSiteUseCase(siteRepository, dateProvider);

    const result = await usecase.execute({
      siteId: "non-existent-id",
      userId: uuid(),
    });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual((result as FailureResult<"SiteNotFound">).getError(), "SiteNotFound");
  });

  it("archive a site successfully", async () => {
    const siteId = uuid();
    const userId = uuid();
    const site = buildFriche({
      id: siteId,
    });

    siteRepository._setSites([
      {
        ...site,
        createdAt,
        creationMode: "express",
        createdBy: userId,
        status: "active",
      },
    ]);

    const usecase = new ArchiveSiteUseCase(siteRepository, dateProvider);

    const result = await usecase.execute({
      siteId,
      userId,
    });
    assert.strictEqual(result.isSuccess(), true);

    const sites = siteRepository._getSites();

    assert.deepStrictEqual(sites[0], {
      ...site,
      createdAt,
      creationMode: "express",
      createdBy: userId,
      status: "archived",
      updatedAt: fakeNow,
    });
  });
});
