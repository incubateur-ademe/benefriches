import { FailureResult, SuccessResult } from "src/shared-kernel/result";
import { InMemorySitesQuery } from "src/sites/adapters/secondary/site-query/InMemorySitesQuery";

import { SiteFeaturesView, SiteView } from "../models/views";
import { GetSiteViewByIdUseCase } from "./getSiteViewById.usecase";

describe("GetSiteViewById Use Case", () => {
  let sitesQuery: InMemorySitesQuery;

  beforeEach(() => {
    sitesQuery = new InMemorySitesQuery();
  });

  it("returns site with features and projects when site exists", async () => {
    const siteFeatures: SiteFeaturesView = {
      id: "4550d9f0-ce28-43ae-a319-94851ae033db",
      nature: "FRICHE",
      name: "My existing site",
      isExpressSite: false,
      surfaceArea: 140000,
      fricheActivity: "INDUSTRY",
      owner: {
        structureType: "company",
        name: "Owner Company",
      },
      soilsDistribution: {
        BUILDINGS: 140000,
      },
      yearlyExpenses: [],
      yearlyIncomes: [],
      address: {
        city: "Paris",
        cityCode: "75109",
        postCode: "75009",
        banId: "123abc",
        lat: 48.876517,
        long: 2.330785,
        value: "1 rue de Londres, 75009 Paris",
      },
    };

    const siteWithProjects: SiteView = {
      id: "4550d9f0-ce28-43ae-a319-94851ae033db",
      features: siteFeatures,
      reconversionProjects: [
        {
          id: "project-1",
          name: "Solar Farm",
          type: "PHOTOVOLTAIC_POWER_PLANT",
        },
        {
          id: "project-2",
          name: "Urban Center",
          type: "URBAN_PROJECT",
        },
      ],
    };

    sitesQuery._setSitesWithProjects([siteWithProjects]);

    const usecase = new GetSiteViewByIdUseCase(sitesQuery);
    const result = await usecase.execute({ siteId: siteWithProjects.id });

    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult<{ site: SiteView }>).getData()).toEqual({
      site: siteWithProjects,
    });
  });

  it("returns failure when site does not exist", async () => {
    const nonExistentSiteId = "00000000-0000-0000-0000-000000000000";

    const usecase = new GetSiteViewByIdUseCase(sitesQuery);
    const result = await usecase.execute({ siteId: nonExistentSiteId });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult).getError()).toBe("SiteNotFound");
  });
});
