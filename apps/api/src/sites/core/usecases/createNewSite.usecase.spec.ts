import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { FailureResult } from "src/shared-kernel/result";
import { InMemorySitesRepository } from "src/sites/adapters/secondary/site-repository/InMemorySiteRepository";

import {
  buildAgriculturalOrNaturalSite,
  buildAgriculturalOperationSiteProps,
  buildFriche,
  buildFricheProps,
} from "../models/site.mock";
import { SiteEntity } from "../models/siteEntity";
import { CreateNewCustomSiteUseCase } from "./createNewSite.usecase";

describe("CreateNewSite Use Case", () => {
  let siteRepository: InMemorySitesRepository;
  let dateProvider: DateProvider;
  const fakeNow = new Date("2024-01-03T13:50:45");

  beforeEach(() => {
    siteRepository = new InMemorySitesRepository();
    dateProvider = new DeterministicDateProvider(fakeNow);
  });

  it("Cannot create a new friche with invalid props", async () => {
    // @ts-expect-error invalid name
    const fricheProps = buildFricheProps({ name: 123 });

    const usecase = new CreateNewCustomSiteUseCase(siteRepository, dateProvider);
    const result = await usecase.execute({
      siteProps: { ...fricheProps, nature: "FRICHE" },
      createdBy: "user-123",
    });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"ValidationError", unknown>).getError()).toBe(
      "ValidationError",
    );
    expect((result as FailureResult<"ValidationError", unknown>).getIssues()).toEqual({
      name: ["Invalid input: expected string, received number"],
    });
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
      },
    ]);

    const usecase = new CreateNewCustomSiteUseCase(siteRepository, dateProvider);
    const result = await usecase.execute({
      siteProps,
      createdBy: "blabla",
    });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult).getError()).toBe("SiteAlreadyExists");
    expect(siteRepository._getSites().length).toEqual(1);
  });
  describe("Agricultural or natura site", () => {
    it("Can create a new agricultural site with minimal data", async () => {
      const agriculturalOperationProps = buildAgriculturalOperationSiteProps();
      const usecase = new CreateNewCustomSiteUseCase(siteRepository, dateProvider);

      await usecase.execute({
        siteProps: agriculturalOperationProps,
        createdBy: "user-id-123",
      });

      const savedSites = siteRepository._getSites();

      expect(savedSites).toEqual<SiteEntity[]>([
        {
          ...buildAgriculturalOrNaturalSite(agriculturalOperationProps),
          createdAt: fakeNow,
          createdBy: "user-id-123",
          creationMode: "custom",
        },
      ]);
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

      const usecase = new CreateNewCustomSiteUseCase(siteRepository, dateProvider);

      await usecase.execute({
        createdBy: "user-id-123",
        siteProps,
      });

      const savedSites = siteRepository._getSites();

      expect(savedSites).toEqual<SiteEntity[]>([
        {
          ...buildAgriculturalOrNaturalSite(siteProps),
          createdAt: fakeNow,
          createdBy: "user-id-123",
          creationMode: "custom",
        },
      ]);
    });
  });

  describe("Friche", () => {
    it("Can create a new friche with minimal data", async () => {
      const fricheProps = buildFricheProps();
      const siteProps = { nature: "FRICHE", ...fricheProps } as const;

      const usecase = new CreateNewCustomSiteUseCase(siteRepository, dateProvider);

      await usecase.execute({
        createdBy: "user-id-123",
        siteProps,
      });

      const savedSites = siteRepository._getSites();

      expect(savedSites).toEqual<SiteEntity[]>([
        {
          ...buildFriche(fricheProps),
          createdAt: fakeNow,
          createdBy: "user-id-123",
          creationMode: "custom",
        },
      ]);
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

      const usecase = new CreateNewCustomSiteUseCase(siteRepository, dateProvider);

      await usecase.execute({
        createdBy: "user-id-123",
        siteProps,
      });

      const savedSites = siteRepository._getSites();

      expect(savedSites).toEqual<SiteEntity[]>([
        {
          ...buildFriche(fricheProps),
          createdAt: fakeNow,
          createdBy: "user-id-123",
          creationMode: "custom",
        },
      ]);
    });
  });
});
