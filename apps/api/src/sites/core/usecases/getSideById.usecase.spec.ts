import { InMemorySiteReadRepository } from "src/sites/adapters/secondary/site-repository/read/InMemorySiteReadRepository";
import { GetSiteByIdUseCase, SiteViewModel } from "./getSiteById.usecase";

describe("GetSiteById Use Case", () => {
  let siteRepository: InMemorySiteReadRepository;

  beforeEach(() => {
    siteRepository = new InMemorySiteReadRepository();
  });

  it("cannot get a non-existing site", async () => {
    const siteId = "fdc94bb2-ec2c-49f8-92ea-19bd91160027";
    const usecase = new GetSiteByIdUseCase(siteRepository);
    await expect(usecase.execute({ siteId })).rejects.toThrow(`Site with ID ${siteId} not found`);
  });

  it("Can get an existing site", async () => {
    const site: SiteViewModel = {
      id: "4550d9f0-ce28-43ae-a319-94851ae033db",
      name: "My existing site",
      isExpressSite: true,
      isFriche: true,
      surfaceArea: 140000,
      fricheActivity: "ADMINISTRATION",
      owner: {
        structureType: "department",
        name: "Le département Paris",
      },
      tenant: {
        structureType: "company",
        name: "Tenant company name",
      },
      soilsDistribution: {
        BUILDINGS: 3000,
        ARTIFICIAL_TREE_FILLED: 5000,
        FOREST_MIXED: 60000,
        MINERAL_SOIL: 5000,
        IMPERMEABLE_SOILS: 1300,
      },
      yearlyExpenses: [{ amount: 10999, purpose: "rent" }],
      address: {
        city: "Paris",
        cityCode: "75109",
        postCode: "75009",
        banId: "123abc",
        lat: 48.876517,
        long: 2.330785,
        value: "1 rue de Londres, 75009 Paris",
        streetName: "rue de Londres",
      },
      contaminatedSoilSurface: 1000,
      description: "Description of the site",
      fullTimeJobsInvolved: 2.3,
      accidentsDeaths: 0,
      accidentsMinorInjuries: 2,
      accidentsSevereInjuries: 1,
    };
    siteRepository._setSites([site]);

    const usecase = new GetSiteByIdUseCase(siteRepository);

    const result = await usecase.execute({ siteId: site.id });

    expect(result).toEqual({
      id: site.id,
      name: site.name,
      isExpressSite: site.isExpressSite,
      description: site.description,
      isFriche: site.isFriche,
      owner: site.owner,
      tenant: site.tenant,
      soilsDistribution: site.soilsDistribution,
      surfaceArea: site.surfaceArea,
      contaminatedSoilSurface: site.contaminatedSoilSurface,
      address: site.address,
      fullTimeJobsInvolved: site.fullTimeJobsInvolved,
      accidentsDeaths: 0,
      accidentsMinorInjuries: 2,
      accidentsSevereInjuries: 1,
      yearlyExpenses: [{ amount: 10999, purpose: "rent" }],
      fricheActivity: site.fricheActivity,
    });
  });
});
