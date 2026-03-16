import { v4 as uuid } from "uuid";

import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { FailureResult } from "src/shared-kernel/result";
import { InMemorySitesRepository } from "src/sites/adapters/secondary/site-repository/InMemorySiteRepository";

import { buildFriche } from "../models/site.mock";
import { ArchiveSiteUseCase } from "./archiveSite.usecase";

describe("ArchiveSite use case", () => {
  let dateProvider: DateProvider;
  let siteRepository: InMemorySitesRepository;
  const fakeNow = new Date("2024-01-10T13:00:00");

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
        createdAt: new Date(),
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

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"UserNotAuthorized">).getError()).toBe("UserNotAuthorized");

    const sites = siteRepository._getSites();
    expect(sites[0]?.status).toEqual("active");
    expect(sites[0]?.updatedAt).toEqual(undefined);
  });

  it("fails when site does not exist", async () => {
    const usecase = new ArchiveSiteUseCase(siteRepository, dateProvider);

    const result = await usecase.execute({
      siteId: "non-existent-id",
      userId: uuid(),
    });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"SiteNotFound">).getError()).toBe("SiteNotFound");
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
        createdAt: new Date(),
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
    expect(result.isSuccess()).toBe(true);

    const sites = siteRepository._getSites();

    expect(sites[0]).toEqual({
      ...site,
      createdAt: new Date(),
      creationMode: "express",
      createdBy: userId,
      status: "archived",
      updatedAt: fakeNow,
    });
  });
});
