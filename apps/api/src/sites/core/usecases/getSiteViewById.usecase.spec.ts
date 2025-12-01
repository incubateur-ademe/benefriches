import { FailureResult, SuccessResult } from "src/shared-kernel/result";
import { InMemoryMutabilityEvaluationQuery } from "src/site-evaluations/adapters/secondary/queries/InMemoryMutabilityEvaluationQuery";
import { InMemorySitesQuery } from "src/sites/adapters/secondary/site-query/InMemorySitesQuery";

import { SiteFeaturesView, SiteView } from "../models/views";
import { GetSiteViewByIdUseCase } from "./getSiteViewById.usecase";

describe("GetSiteViewById Use Case", () => {
  let sitesQuery: InMemorySitesQuery;

  beforeEach(() => {
    sitesQuery = new InMemorySitesQuery();
  });

  it("returns site with features, actions, compatibility evaluation and projects when site exists", async () => {
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

    const site: SiteView = {
      id: "4550d9f0-ce28-43ae-a319-94851ae033db",
      features: siteFeatures,
      actions: [
        {
          action: "EVALUATE_COMPATIBILITY",
          status: "todo",
        },
        {
          action: "REQUEST_FUNDING_INFORMATION",
          status: "done",
        },
      ],
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
      compatibilityEvaluation: null,
    };

    sitesQuery._setSitesWithProjects([site]);
    sitesQuery._setMutafrichesId(site.id, null);

    const mutabilityEvaluationQuery = new InMemoryMutabilityEvaluationQuery();
    const usecase = new GetSiteViewByIdUseCase(sitesQuery, mutabilityEvaluationQuery);
    const result = await usecase.execute({ siteId: site.id });

    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult<{ site: SiteView }>).getData()).toEqual({
      site,
    });
  });

  it("returns failure when site does not exist", async () => {
    const nonExistentSiteId = "00000000-0000-0000-0000-000000000000";

    const mutabilityEvaluationQuery = new InMemoryMutabilityEvaluationQuery();
    const usecase = new GetSiteViewByIdUseCase(sitesQuery, mutabilityEvaluationQuery);
    const result = await usecase.execute({ siteId: nonExistentSiteId });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult).getError()).toBe("SiteNotFound");
  });

  it("returns site with compatibility evaluation when evaluation exists", async () => {
    const siteId = "site-with-eval-123";
    const siteFeatures: SiteFeaturesView = {
      id: siteId,
      nature: "FRICHE",
      name: "Site with evaluation",
      isExpressSite: false,
      surfaceArea: 100000,
      fricheActivity: "INDUSTRY",
      owner: {
        structureType: "company",
        name: "Owner Company",
      },
      soilsDistribution: {
        BUILDINGS: 100000,
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

    const siteWithEvaluation: SiteView = {
      id: siteId,
      features: siteFeatures,
      actions: [],
      reconversionProjects: [],
      compatibilityEvaluation: null,
    };

    sitesQuery._setSitesWithProjects([siteWithEvaluation]);
    const mutafrichesEvaluationId = "eval-123";
    sitesQuery._setMutafrichesId(siteId, mutafrichesEvaluationId);

    const mutabilityEvaluationQuery = new InMemoryMutabilityEvaluationQuery();
    mutabilityEvaluationQuery.withDefaultDataForId(mutafrichesEvaluationId);
    const usecase = new GetSiteViewByIdUseCase(sitesQuery, mutabilityEvaluationQuery);
    const result = await usecase.execute({ siteId });

    expect(result.isSuccess()).toBe(true);
    const successResult = result as SuccessResult<{ site: SiteView }>;
    const returnedSite = successResult.getData().site;
    expect(returnedSite.compatibilityEvaluation).toEqual({
      results: [
        { usage: "equipements", score: 0.7 },
        { usage: "culture", score: 0.65 },
        { usage: "residentiel", score: 0.5 },
        { usage: "renaturation", score: 0.4 },
      ],
      reliabilityScore: 7,
    });
  });

  it("returns site with null compatibility evaluation when no evaluation exists", async () => {
    const siteFeatures: SiteFeaturesView = {
      id: "site-without-eval-456",
      nature: "FRICHE",
      name: "Site without evaluation",
      isExpressSite: false,
      surfaceArea: 50000,
      fricheActivity: "INDUSTRY",
      owner: {
        structureType: "company",
        name: "Owner Company",
      },
      soilsDistribution: {
        BUILDINGS: 50000,
      },
      yearlyExpenses: [],
      yearlyIncomes: [],
      address: {
        city: "Lyon",
        cityCode: "69000",
        postCode: "69000",
        banId: "456def",
        lat: 45.764043,
        long: 4.835659,
        value: "1 rue Test, 69000 Lyon",
      },
    };

    const siteWithoutEvaluation: SiteView = {
      id: "site-without-eval-456",
      features: siteFeatures,
      actions: [],
      reconversionProjects: [],
      compatibilityEvaluation: null,
    };

    sitesQuery._setSitesWithProjects([siteWithoutEvaluation]);
    sitesQuery._setMutafrichesId("site-without-eval-456", null);

    const mutabilityEvaluationQuery = new InMemoryMutabilityEvaluationQuery();
    const usecase = new GetSiteViewByIdUseCase(sitesQuery, mutabilityEvaluationQuery);
    const result = await usecase.execute({ siteId: "site-without-eval-456" });

    expect(result.isSuccess()).toBe(true);
    const successResult = result as SuccessResult<{ site: SiteView }>;
    const returnedSite = successResult.getData().site;
    expect(returnedSite.compatibilityEvaluation).toBeNull();
  });
});
