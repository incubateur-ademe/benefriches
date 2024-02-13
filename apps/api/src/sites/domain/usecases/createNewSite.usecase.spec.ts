/* eslint-disable jest/no-conditional-expect */
import { z } from "zod";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { InMemorySitesRepository } from "src/sites/adapters/secondary/site-repository/InMemorySiteRepository";
import { buildFricheProps, buildMinimalSiteProps } from "../models/site.mock";
import { CreateNewSiteUseCase, DateProvider } from "./createNewSite.usecase";

describe("CreateNewSite Use Case", () => {
  let siteRepository: InMemorySitesRepository;
  let dateProvider: DateProvider;
  const fakeNow = new Date("2024-01-03T13:50:45");

  const getZodIssues = (err: unknown) => {
    if (err instanceof z.ZodError) {
      return err.issues;
    }
    throw new Error("Not a ZodError");
  };

  beforeEach(() => {
    siteRepository = new InMemorySitesRepository();
    dateProvider = new DeterministicDateProvider(fakeNow);
  });

  describe("Mandatory data", () => {
    it.each([
      "id",
      "address",
      "surfaceArea",
      "isFriche",
      "soilsDistribution",
      "owner",
      "yearlyExpenses",
      "yearlyIncomes",
    ])("Cannot create a new site without providing %s", async (mandatoryField) => {
      const siteProps = buildMinimalSiteProps();
      // @ts-expect-error dynamic delete
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete siteProps[mandatoryField];

      const usecase = new CreateNewSiteUseCase(siteRepository, dateProvider);

      expect.assertions(2);
      try {
        await usecase.execute({ siteProps });
      } catch (err) {
        const zIssues = getZodIssues(err);
        expect(zIssues.length).toEqual(1);
        expect(zIssues[0].path).toEqual([mandatoryField]);
      }
    });
  });

  it("Cannot create a new site with invalid surfaceArea", async () => {
    const siteProps = buildMinimalSiteProps({ surfaceArea: -1000 });

    const usecase = new CreateNewSiteUseCase(siteRepository, dateProvider);
    expect.assertions(2);
    try {
      await usecase.execute({ siteProps });
    } catch (err) {
      const zIssues = getZodIssues(err);
      expect(zIssues.length).toEqual(1);
      expect(zIssues[0].path).toEqual(["surfaceArea"]);
    }
  });

  it("Can create a new site with minimal data", async () => {
    const siteProps = buildMinimalSiteProps();

    const usecase = new CreateNewSiteUseCase(siteRepository, dateProvider);

    await usecase.execute({ siteProps });

    const savedSites = siteRepository._getSites();

    expect(savedSites).toEqual([{ ...siteProps, createdAt: fakeNow }]);
  });

  it("Can create a new site with complete data", async () => {
    const siteProps = buildMinimalSiteProps({
      description: "Description of site",
      fullTimeJobsInvolved: 1.3,
      tenant: {
        structureType: "company",
        name: "Tenant SARL",
      },
      yearlyExpenses: [{ amount: 45000, bearer: "owner", category: "other", type: "other" }],
      yearlyIncomes: [
        { amount: 20000, type: "other" },
        { amount: 32740.3, type: "other" },
      ],
    });

    const usecase = new CreateNewSiteUseCase(siteRepository, dateProvider);

    await usecase.execute({ siteProps });

    const savedSites = siteRepository._getSites();

    expect(savedSites).toEqual([{ ...siteProps, createdAt: fakeNow }]);
  });

  it("Cannot create a site when already exists", async () => {
    const siteProps = buildMinimalSiteProps();

    siteRepository._setSites([{ ...siteProps, createdAt: new Date() }]);

    const usecase = new CreateNewSiteUseCase(siteRepository, dateProvider);
    await expect(usecase.execute({ siteProps })).rejects.toThrow(
      `Site with id ${siteProps.id} already exists`,
    );

    expect(siteRepository._getSites().length).toEqual(1);
  });

  describe("Friche", () => {
    it("Cannot create a new friche without providing fricheActivity", async () => {
      const fricheProps = buildFricheProps();
      // @ts-expect-error dynamic delete
      delete fricheProps.fricheActivity;

      const usecase = new CreateNewSiteUseCase(siteRepository, dateProvider);

      expect.assertions(2);
      try {
        await usecase.execute({ siteProps: fricheProps });
      } catch (err) {
        const zIssues = getZodIssues(err);
        expect(zIssues.length).toEqual(1);
        expect(zIssues[0].path).toEqual(["fricheActivity"]);
      }
    });

    it("Can create a new friche with minimal data", async () => {
      const fricheProps = buildFricheProps();

      const usecase = new CreateNewSiteUseCase(siteRepository, dateProvider);

      await usecase.execute({ siteProps: fricheProps });

      const savedSites = siteRepository._getSites();

      expect(savedSites).toEqual([{ ...fricheProps, createdAt: fakeNow }]);
    });

    it("Can create a new friche with complete data", async () => {
      const fricheProps = buildFricheProps({
        description: "Description of site",
        fullTimeJobsInvolved: 1.3,
        tenant: {
          structureType: "company",
          name: "Tenant SARL",
        },
        // friche-only data
        hasContaminatedSoils: true,
        contaminatedSoilSurface: 1400,
        accidentsMinorInjuries: 2,
        accidentsSevereInjuries: 2,
        accidentsDeaths: 2,
      });

      const usecase = new CreateNewSiteUseCase(siteRepository, dateProvider);

      await usecase.execute({ siteProps: fricheProps });

      const savedSites = siteRepository._getSites();

      expect(savedSites).toEqual([{ ...fricheProps, createdAt: fakeNow }]);
    });
  });
});
