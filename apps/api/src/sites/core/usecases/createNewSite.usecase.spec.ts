/* eslint-disable jest/no-conditional-expect */
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
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
    const siteProps = buildFricheProps({ name: 123 });

    const usecase = new CreateNewCustomSiteUseCase(siteRepository, dateProvider);
    expect.assertions(1);
    try {
      await usecase.execute({
        siteProps: { ...siteProps, isFriche: true },
        createdBy: "user-123",
      });
    } catch (err) {
      expect((err as Error).message).toContain(
        "Validation error: name (Expected string, received number)",
      );
    }
  });

  it("Cannot create a site when already exists", async () => {
    const fricheProps = buildFricheProps();

    siteRepository._setSites([
      {
        ...buildFriche(fricheProps),
        createdBy: "blabla",
        creationMode: "custom",
        createdAt: new Date(),
      },
    ]);

    const usecase = new CreateNewCustomSiteUseCase(siteRepository, dateProvider);
    await expect(
      usecase.execute({
        siteProps: { ...fricheProps, isFriche: true },
        createdBy: "blabla",
      }),
    ).rejects.toThrow(`Site with id ${fricheProps.id} already exists`);

    expect(siteRepository._getSites().length).toEqual(1);
  });
  describe("Agricultural or natura site", () => {
    it("Can create a new agricultural/natural site with minimal data", async () => {
      const siteProps = buildAgriculturalOperationSiteProps();

      const usecase = new CreateNewCustomSiteUseCase(siteRepository, dateProvider);

      await usecase.execute({
        createdBy: "user-id-123",
        siteProps: {
          ...siteProps,
          isFriche: false,
        },
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

    it("Can create a new agricultural/natural site with complete data", async () => {
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
        siteProps: {
          ...siteProps,
          isFriche: false,
        },
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

      const usecase = new CreateNewCustomSiteUseCase(siteRepository, dateProvider);

      await usecase.execute({
        createdBy: "user-id-123",
        siteProps: {
          ...fricheProps,
          isFriche: true,
        },
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

      const usecase = new CreateNewCustomSiteUseCase(siteRepository, dateProvider);

      await usecase.execute({
        createdBy: "user-id-123",
        siteProps: {
          ...fricheProps,
          isFriche: true,
        },
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
