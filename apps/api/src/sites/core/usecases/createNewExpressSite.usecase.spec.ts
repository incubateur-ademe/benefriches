import { Address, createSoilSurfaceAreaDistribution } from "shared";

import { MockCityDataService } from "src/reconversion-projects/adapters/secondary/services/city-service/MockCityDataService";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { InMemorySitesRepository } from "src/sites/adapters/secondary/site-repository/InMemorySiteRepository";

import { buildFriche, buildFricheProps } from "../models/site.mock";
import { SiteEntity } from "../models/siteEntity";
import { CreateNewExpressSiteUseCase } from "./createNewExpressSite.usecase";

const buildAddress = (propsOverride?: Partial<Address>): Address => {
  return {
    city: "Montrouge",
    streetName: "Avenue Pierre Brossolette",
    streetNumber: "155bis",
    value: "155 bis Av. Pierre Brossolette, 92120 Montrouge",
    banId: "92049_7161_00155_bis",
    cityCode: "92049",
    postCode: "92120",
    long: 2.305116,
    lat: 48.815679,
    ...propsOverride,
  };
};

describe("CreateNewExpressSite Use case", () => {
  let siteRepository: InMemorySitesRepository;
  let dateProvider: DateProvider;
  let cityDataProvider: MockCityDataService;
  const fakeNow = new Date("2024-01-03T13:50:45");

  beforeEach(() => {
    siteRepository = new InMemorySitesRepository();
    dateProvider = new DeterministicDateProvider(fakeNow);
    cityDataProvider = new MockCityDataService();
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

    const usecase = new CreateNewExpressSiteUseCase(siteRepository, dateProvider, cityDataProvider);
    await expect(
      usecase.execute({
        siteProps: {
          id: fricheProps.id,
          surfaceArea: 1000,
          address: buildAddress(),
          nature: "FRICHE",
        },
        createdBy: "blabla",
      }),
    ).rejects.toThrow(`Site with id ${fricheProps.id} already exists`);

    expect(siteRepository._getSites().length).toEqual(1);
  });

  it("Can create a site when CityDataService fails to get city population", async () => {
    const failingCityDataProvider = new MockCityDataService();
    failingCityDataProvider.shouldFail();
    const usecase = new CreateNewExpressSiteUseCase(
      siteRepository,
      dateProvider,
      failingCityDataProvider,
    );

    const siteProps = {
      id: "e869d8db-3d63-4fd5-93ab-7728c1c19a1e",
      surfaceArea: 1000,
      address: buildAddress(),
      nature: "AGRICULTURAL",
      activity: "VITICULTURE",
    } as const;
    await usecase.execute({ createdBy: "user-id-123", siteProps });

    const savedSites = siteRepository._getSites();
    expect(savedSites).toHaveLength(1);
  });

  describe("Agricultural or natural site", () => {
    it("creates a new express agricultural site from given props", async () => {
      const usecase = new CreateNewExpressSiteUseCase(
        siteRepository,
        dateProvider,
        cityDataProvider,
      );

      const siteProps = {
        id: "e869d8db-3d63-4fd5-93ab-7728c1c19a1e",
        surfaceArea: 1000,
        address: buildAddress(),
        nature: "AGRICULTURAL",
        activity: "VITICULTURE",
      } as const;
      await usecase.execute({ createdBy: "user-id-123", siteProps });

      const savedSites = siteRepository._getSites();

      expect(savedSites).toEqual<SiteEntity[]>([
        {
          id: siteProps.id,
          address: siteProps.address,
          surfaceArea: siteProps.surfaceArea,
          name: "Espace agricole de Montrouge",
          createdAt: fakeNow,
          createdBy: "user-id-123",
          creationMode: "express",
          nature: "AGRICULTURAL",
          isFriche: false,
          soilsDistribution: createSoilSurfaceAreaDistribution({
            VINEYARD: 950,
            BUILDINGS: 50,
          }),
          owner: { structureType: "municipality", name: "Mairie de Montrouge" },
          tenant: { structureType: "company", name: "Actuel locataire" },
          yearlyExpenses: [
            { amount: 350, purpose: "maintenance", bearer: "owner" },
            { amount: 141, purpose: "propertyTaxes", bearer: "owner" },
          ],
          yearlyIncomes: [],
        },
      ]);
    });
  });

  describe("Friche", () => {
    it("creates a new express friche from given props", async () => {
      const usecase = new CreateNewExpressSiteUseCase(
        siteRepository,
        dateProvider,
        cityDataProvider,
      );

      const fricheProps = {
        id: "e869d8db-3d63-4fd5-93ab-7728c1c19a1e",
        surfaceArea: 2540,
        address: buildAddress(),
        nature: "FRICHE",
      } as const;
      await usecase.execute({ createdBy: "user-id-123", siteProps: fricheProps });

      const savedSites = siteRepository._getSites();

      expect(savedSites).toEqual<SiteEntity[]>([
        {
          id: fricheProps.id,
          address: fricheProps.address,
          surfaceArea: fricheProps.surfaceArea,
          createdAt: fakeNow,
          createdBy: "user-id-123",
          creationMode: "express",
          isFriche: true,
          nature: "FRICHE",
          name: "Friche de Montrouge",
          description: undefined,
          soilsDistribution: createSoilSurfaceAreaDistribution({
            BUILDINGS: 762,
            IMPERMEABLE_SOILS: 508,
            MINERAL_SOIL: 381,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 635,
            ARTIFICIAL_TREE_FILLED: 254,
          }),
          owner: { structureType: "municipality", name: "Mairie de Montrouge" },
          yearlyExpenses: [
            { purpose: "maintenance", amount: 5334, bearer: "owner" },
            { purpose: "propertyTaxes", amount: 2154, bearer: "owner" },
            { purpose: "illegalDumpingCost", amount: 0, bearer: "owner" },
            { purpose: "security", amount: 5588, bearer: "owner" },
          ],
          yearlyIncomes: [],
          tenant: { structureType: "company", name: "Actuel locataire" },
          fricheActivity: "OTHER",
          hasContaminatedSoils: true,
          contaminatedSoilSurface: 1270,
          accidentsMinorInjuries: undefined,
          accidentsSevereInjuries: undefined,
          accidentsDeaths: undefined,
        },
      ]);
    });
  });
});
