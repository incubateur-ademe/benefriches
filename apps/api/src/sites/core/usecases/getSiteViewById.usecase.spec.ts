import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import { FailureResult, SuccessResult } from "src/shared-kernel/result";
import { InMemoryMutabilityEvaluationQuery } from "src/site-evaluations/adapters/secondary/queries/InMemoryMutabilityEvaluationQuery";
import { InMemorySitesQuery } from "src/sites/adapters/secondary/site-query/InMemorySitesQuery";

import { SiteFeaturesView, SiteView, SiteViewData } from "../models/views";
import { GetSiteViewByIdUseCase } from "./getSiteViewById.usecase";

describe("GetSiteViewById Use Case", () => {
  let sitesQuery: InMemorySitesQuery;
  const userId = "0918223a-4d05-43a3-ad15-ccac704f7998";

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

    const siteData: SiteViewData = {
      id: "4550d9f0-ce28-43ae-a319-94851ae033db",
      createdBy: userId,
      creationMode: "custom",
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
          express: false,
        },
        {
          id: "project-2",
          name: "Urban Center",
          type: "URBAN_PROJECT",
          express: false,
        },
      ],
    };

    sitesQuery._setSitesWithProjects([siteData]);
    sitesQuery._setMutafrichesId(siteData.id, null);

    const mutabilityEvaluationQuery = new InMemoryMutabilityEvaluationQuery();
    const usecase = new GetSiteViewByIdUseCase(sitesQuery, mutabilityEvaluationQuery);
    const result = await usecase.execute({ siteId: siteData.id, userId });

    assert.strictEqual(result.isSuccess(), true);

    const expectedSite: SiteView = {
      id: siteData.id,
      features: siteFeatures,
      actions: siteData.actions,
      reconversionProjects: siteData.reconversionProjects,
      compatibilityEvaluation: null,
      isEditable: false,
      notEditableReason: "ACTIVE_RECONVERSION_PROJECT",
    };

    assert.deepStrictEqual((result as SuccessResult<{ site: SiteView }>).getData(), {
      site: expectedSite,
    });
  });

  it("returns failure when site does not exist", async () => {
    const nonExistentSiteId = "00000000-0000-0000-0000-000000000000";

    const mutabilityEvaluationQuery = new InMemoryMutabilityEvaluationQuery();
    const usecase = new GetSiteViewByIdUseCase(sitesQuery, mutabilityEvaluationQuery);
    const result = await usecase.execute({ siteId: nonExistentSiteId, userId });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual((result as FailureResult).getError(), "SiteNotFound");
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

    const siteDataWithEvaluation: SiteViewData = {
      id: siteId,
      createdBy: userId,
      creationMode: "custom",
      features: siteFeatures,
      actions: [],
      reconversionProjects: [],
    };

    sitesQuery._setSitesWithProjects([siteDataWithEvaluation]);
    const mutafrichesEvaluationId = "eval-123";
    sitesQuery._setMutafrichesId(siteId, mutafrichesEvaluationId);

    const mutabilityEvaluationQuery = new InMemoryMutabilityEvaluationQuery();
    mutabilityEvaluationQuery.withDefaultDataForId(mutafrichesEvaluationId);
    const usecase = new GetSiteViewByIdUseCase(sitesQuery, mutabilityEvaluationQuery);
    const result = await usecase.execute({ siteId, userId });

    assert.strictEqual(result.isSuccess(), true);
    const successResult = result as SuccessResult<{ site: SiteView }>;
    const returnedSite = successResult.getData().site;
    assert.deepStrictEqual(returnedSite.compatibilityEvaluation, {
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

    const siteDataWithoutEvaluation: SiteViewData = {
      id: "site-without-eval-456",
      createdBy: userId,
      creationMode: "custom",
      features: siteFeatures,
      actions: [],
      reconversionProjects: [],
    };

    sitesQuery._setSitesWithProjects([siteDataWithoutEvaluation]);
    sitesQuery._setMutafrichesId("site-without-eval-456", null);

    const mutabilityEvaluationQuery = new InMemoryMutabilityEvaluationQuery();
    const usecase = new GetSiteViewByIdUseCase(sitesQuery, mutabilityEvaluationQuery);
    const result = await usecase.execute({ siteId: "site-without-eval-456", userId });

    assert.strictEqual(result.isSuccess(), true);
    const successResult = result as SuccessResult<{ site: SiteView }>;
    const returnedSite = successResult.getData().site;
    assert.strictEqual(returnedSite.compatibilityEvaluation, null);
  });

  it("reports the site as editable when the requester created a custom site with no reconversion project", async () => {
    const siteFeatures: SiteFeaturesView = {
      id: "editable-site-1",
      nature: "FRICHE",
      name: "Editable site",
      isExpressSite: false,
      surfaceArea: 10000,
      fricheActivity: "INDUSTRY",
      owner: { structureType: "company", name: "Owner Company" },
      soilsDistribution: { BUILDINGS: 10000 },
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

    const siteData: SiteViewData = {
      id: "editable-site-1",
      createdBy: userId,
      creationMode: "custom",
      features: siteFeatures,
      actions: [],
      reconversionProjects: [],
    };

    sitesQuery._setSitesWithProjects([siteData]);
    sitesQuery._setMutafrichesId(siteData.id, null);

    const usecase = new GetSiteViewByIdUseCase(sitesQuery, new InMemoryMutabilityEvaluationQuery());
    const result = await usecase.execute({ siteId: siteData.id, userId });

    assert.strictEqual(result.isSuccess(), true);
    const site = (result as SuccessResult<{ site: SiteView }>).getData().site;
    assert.strictEqual(site.isEditable, true);
    assert.strictEqual(site.notEditableReason, null);
  });

  it("reports NOT_CREATOR when the requesting user is not the site's creator", async () => {
    const siteFeatures: SiteFeaturesView = {
      id: "other-users-site",
      nature: "FRICHE",
      name: "Someone else's site",
      isExpressSite: false,
      surfaceArea: 10000,
      fricheActivity: "INDUSTRY",
      owner: { structureType: "company", name: "Owner Company" },
      soilsDistribution: { BUILDINGS: 10000 },
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

    const siteData: SiteViewData = {
      id: "other-users-site",
      createdBy: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
      creationMode: "custom",
      features: siteFeatures,
      actions: [],
      reconversionProjects: [],
    };

    sitesQuery._setSitesWithProjects([siteData]);
    sitesQuery._setMutafrichesId(siteData.id, null);

    const usecase = new GetSiteViewByIdUseCase(sitesQuery, new InMemoryMutabilityEvaluationQuery());
    const result = await usecase.execute({ siteId: siteData.id, userId });

    assert.strictEqual(result.isSuccess(), true);
    const site = (result as SuccessResult<{ site: SiteView }>).getData().site;
    assert.strictEqual(site.isEditable, false);
    assert.strictEqual(site.notEditableReason, "NOT_CREATOR");
  });

  it("reports ACTIVE_RECONVERSION_PROJECT when the site view carries reconversion projects", async () => {
    const siteFeatures: SiteFeaturesView = {
      id: "site-with-active-project",
      nature: "FRICHE",
      name: "Site with active project",
      isExpressSite: false,
      surfaceArea: 10000,
      fricheActivity: "INDUSTRY",
      owner: { structureType: "company", name: "Owner Company" },
      soilsDistribution: { BUILDINGS: 10000 },
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

    const siteData: SiteViewData = {
      id: "site-with-active-project",
      createdBy: userId,
      creationMode: "custom",
      features: siteFeatures,
      actions: [],
      reconversionProjects: [
        { id: "project-1", name: "Solar Farm", type: "PHOTOVOLTAIC_POWER_PLANT", express: false },
      ],
    };

    sitesQuery._setSitesWithProjects([siteData]);
    sitesQuery._setMutafrichesId(siteData.id, null);

    const usecase = new GetSiteViewByIdUseCase(sitesQuery, new InMemoryMutabilityEvaluationQuery());
    const result = await usecase.execute({ siteId: siteData.id, userId });

    assert.strictEqual(result.isSuccess(), true);
    const site = (result as SuccessResult<{ site: SiteView }>).getData().site;
    assert.strictEqual(site.isEditable, false);
    assert.strictEqual(site.notEditableReason, "ACTIVE_RECONVERSION_PROJECT");
  });

  it("does not expose the site's creator or creation mode in the returned view", async () => {
    const siteFeatures: SiteFeaturesView = {
      id: "no-leak-site",
      nature: "FRICHE",
      name: "No leak site",
      isExpressSite: false,
      surfaceArea: 10000,
      fricheActivity: "INDUSTRY",
      owner: { structureType: "company", name: "Owner Company" },
      soilsDistribution: { BUILDINGS: 10000 },
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

    const siteData: SiteViewData = {
      id: "no-leak-site",
      createdBy: userId,
      creationMode: "custom",
      features: siteFeatures,
      actions: [],
      reconversionProjects: [],
    };

    sitesQuery._setSitesWithProjects([siteData]);
    sitesQuery._setMutafrichesId(siteData.id, null);

    const usecase = new GetSiteViewByIdUseCase(sitesQuery, new InMemoryMutabilityEvaluationQuery());
    const result = await usecase.execute({ siteId: siteData.id, userId });

    assert.strictEqual(result.isSuccess(), true);
    const site = (result as SuccessResult<{ site: SiteView }>).getData().site;

    const expectedSite: SiteView = {
      id: siteData.id,
      features: siteFeatures,
      actions: [],
      reconversionProjects: [],
      compatibilityEvaluation: null,
      isEditable: true,
      notEditableReason: null,
    };

    assert.deepStrictEqual(site, expectedSite);
    assert.strictEqual((site as unknown as SiteViewData).createdBy, undefined);
    assert.strictEqual((site as unknown as SiteViewData).creationMode, undefined);
  });
});
