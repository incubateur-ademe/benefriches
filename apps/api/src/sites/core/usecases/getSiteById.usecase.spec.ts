import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import type { FailureResult, SuccessResult } from "src/shared-kernel/result";
import { InMemorySitesQuery } from "src/sites/adapters/secondary/site-query/InMemorySitesQuery";

import type { SiteFeaturesView } from "../models/views";
import { GetSiteByIdUseCase } from "./getSiteById.usecase";

describe("GetSiteById Use Case", () => {
  let sitesQuery: InMemorySitesQuery;

  beforeEach(() => {
    sitesQuery = new InMemorySitesQuery();
  });

  it("cannot get a non-existing site", async () => {
    const siteId = "fdc94bb2-ec2c-49f8-92ea-19bd91160027";
    const usecase = new GetSiteByIdUseCase(sitesQuery);
    const result = await usecase.execute({ siteId });
    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual((result as FailureResult).getError(), "SiteNotFound");
  });

  it("Can get an existing site", async () => {
    const site: SiteFeaturesView = {
      id: "4550d9f0-ce28-43ae-a319-94851ae033db",
      nature: "FRICHE",
      name: "My existing site",
      isExpressSite: true,
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
      yearlyIncomes: [{ amount: 13000, source: "subsidies" }],
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
      accidentsDeaths: 0,
      accidentsMinorInjuries: 2,
      accidentsSevereInjuries: 1,
    };
    sitesQuery._setSites([site]);

    const usecase = new GetSiteByIdUseCase(sitesQuery);

    const result = await usecase.execute({ siteId: site.id });

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult<unknown>).getData(), {
      site: {
        id: site.id,
        name: site.name,
        nature: "FRICHE",
        isExpressSite: site.isExpressSite,
        description: site.description,
        owner: site.owner,
        tenant: site.tenant,
        soilsDistribution: site.soilsDistribution,
        surfaceArea: site.surfaceArea,
        contaminatedSoilSurface: site.contaminatedSoilSurface,
        address: site.address,
        accidentsDeaths: 0,
        accidentsMinorInjuries: 2,
        accidentsSevereInjuries: 1,
        yearlyExpenses: [{ amount: 10999, purpose: "rent" }],
        yearlyIncomes: [{ amount: 13000, source: "subsidies" }],
        fricheActivity: site.fricheActivity,
      },
    });
  });
});
