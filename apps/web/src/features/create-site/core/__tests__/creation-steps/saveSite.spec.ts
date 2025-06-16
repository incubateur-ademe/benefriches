import { Address } from "shared";
import { v4 as uuid } from "uuid";

import { buildUser } from "@/features/onboarding/core/user.mock";

import { InMemoryCreateSiteService } from "../../../infrastructure/create-site-service/inMemoryCreateSiteApi";
import { customSiteSaved, expressSiteSaved } from "../../actions/finalStep.actions";
import {
  expressFricheCreationData,
  fricheWithExhaustiveData,
  fricheWithMinimalData,
  siteWithMinimalData,
} from "../../siteData.mock";
import { SiteCreationData, SiteExpressCreationData } from "../../siteFoncier.types";
import { expectNewCurrentStep, expectSiteDataUnchanged, StoreBuilder } from "./testUtils";

const BLAJAN_ADDRESS: Address = {
  banId: "31070_p4ur8e",
  value: "Sendere 31350 Blajan",
  city: "Blajan",
  cityCode: "31070",
  postCode: "31350",
  streetName: "Sendere",
  long: 0.664699,
  lat: 43.260859,
};

describe("Save created site", () => {
  describe("custom creation", () => {
    it("should be in error state when site data in store is not valid (missing name)", async () => {
      const siteData = { ...siteWithMinimalData, name: undefined };
      const store = new StoreBuilder().withCreationData(siteData).build();
      const initialRootState = store.getState();
      await store.dispatch(customSiteSaved());

      const newState = store.getState();
      expectSiteDataUnchanged(initialRootState, newState);
      expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
      expect(newState.siteCreation.saveLoadingState).toEqual("error");
    });

    it("should be in error state when no user id in store", async () => {
      const store = new StoreBuilder().withCreationData(siteWithMinimalData).build();
      const initialRootState = store.getState();
      await store.dispatch(customSiteSaved());

      const newState = store.getState();
      expectSiteDataUnchanged(initialRootState, newState);
      expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
      expect(newState.siteCreation.saveLoadingState).toEqual("error");
    });

    it("should be in error state when createSiteService fails", async () => {
      const failingCreateService = new InMemoryCreateSiteService();
      failingCreateService.shouldFailOnCall();

      const store = new StoreBuilder()
        .withCreationData(siteWithMinimalData)
        .withAppDependencies({ createSiteService: failingCreateService })
        .withCurrentUser(buildUser())
        .build();
      const initialRootState = store.getState();
      await store.dispatch(customSiteSaved());

      const newState = store.getState();
      expectSiteDataUnchanged(initialRootState, newState);
      expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
      expect(newState.siteCreation.saveLoadingState).toEqual("error");
    });

    it.each([
      {
        siteData: siteWithMinimalData,
        dataType: "agricultural operation",
      },
      {
        siteData: fricheWithMinimalData,
        dataType: "friche with minimal data",
      },
      {
        siteData: fricheWithExhaustiveData,
        dataType: "friche with exhaustive data",
      },
    ] satisfies { siteData: SiteCreationData; dataType: string }[])(
      "should be in success state and move to CREATION_RESULT step after saving $dataType",
      async ({ siteData }) => {
        const createSiteService = new InMemoryCreateSiteService();
        const user = buildUser();
        const store = new StoreBuilder()
          .withCreationData(siteData)
          .withCurrentUser(buildUser())
          .withAppDependencies({ createSiteService })
          .build();
        const initialRootState = store.getState();

        await store.dispatch(customSiteSaved());

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
        expect(newState.siteCreation.saveLoadingState).toEqual("success");
        expect(createSiteService._customSites).toEqual([
          {
            id: siteData.id,
            name: siteData.name,
            description: (siteData as SiteCreationData).description,
            address: siteData.address,
            soilsDistribution: siteData.soilsDistribution,
            owner: siteData.owner,
            tenant: (siteData as SiteCreationData).tenant,
            yearlyExpenses: siteData.yearlyExpenses,
            yearlyIncomes: siteData.yearlyIncomes,
            nature: siteData.nature,
            fricheActivity: (siteData as SiteCreationData).fricheActivity,
            contaminatedSoilSurface: (siteData as SiteCreationData).contaminatedSoilSurface,
            accidentsMinorInjuries: (siteData as SiteCreationData).accidentsMinorInjuries,
            accidentsSevereInjuries: (siteData as SiteCreationData).accidentsSevereInjuries,
            accidentsDeaths: (siteData as SiteCreationData).accidentsDeaths,
            createdBy: user.id,
            agriculturalOperationActivity: (siteData as SiteCreationData)
              .agriculturalOperationActivity,
            isSiteOperated: siteData.isSiteOperated,
          },
        ]);
      },
    );
  });

  describe("express creation", () => {
    it("should be in error state when site data in store is not valid (missing site nature)", async () => {
      const store = new StoreBuilder()
        .withCreationData({ ...expressFricheCreationData, nature: undefined })
        .withCurrentUser(buildUser())
        .build();
      const initialRootState = store.getState();

      await store.dispatch(expressSiteSaved());

      const newState = store.getState();
      expect(newState.siteCreation.saveLoadingState).toEqual("error");
      expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
    });

    it("should be in error state when no user id in store", async () => {
      const store = new StoreBuilder()
        .withCreationData({ ...expressFricheCreationData, surfaceArea: undefined })
        .build();
      const initialRootState = store.getState();

      await store.dispatch(expressSiteSaved());

      const newState = store.getState();
      expect(newState.siteCreation.saveLoadingState).toEqual("error");
      expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
    });

    it("should be in error state and move to CREATION_RESULT step when createSiteService fails", async () => {
      const failingCreateService = new InMemoryCreateSiteService();
      failingCreateService.shouldFailOnCall();

      const store = new StoreBuilder()
        .withCreationData(expressFricheCreationData)
        .withCurrentUser(buildUser())
        .withAppDependencies({ createSiteService: failingCreateService })
        .build();
      const initialRootState = store.getState();

      await store.dispatch(expressSiteSaved());

      const newState = store.getState();
      expect(newState.siteCreation.saveLoadingState).toEqual("error");
      expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
    });

    it.each([
      {
        dataType: "agricultural operation",
        siteData: {
          id: uuid(),
          nature: "AGRICULTURAL_OPERATION",
          address: BLAJAN_ADDRESS,
          surfaceArea: 15000,
          isFriche: false,
          agriculturalOperationActivity: "POLYCULTURE_AND_LIVESTOCK",
        },
      },
      {
        dataType: "friche",
        siteData: {
          id: uuid(),
          nature: "FRICHE",
          address: BLAJAN_ADDRESS,
          surfaceArea: 35000,
          isFriche: true,
          fricheActivity: "INDUSTRY",
        },
      },
      {
        dataType: "natural area",
        siteData: {
          id: uuid(),
          nature: "NATURAL_AREA",
          address: BLAJAN_ADDRESS,
          surfaceArea: 40000,
          isFriche: false,
          naturalAreaType: "FOREST",
        },
      },
    ] satisfies { siteData: SiteExpressCreationData; dataType: string }[])(
      "should be in success state after saving $dataType",
      async ({ siteData }) => {
        const createSiteService = new InMemoryCreateSiteService();
        const user = buildUser();
        const store = new StoreBuilder()
          .withCreationData(siteData)
          .withCurrentUser(buildUser())
          .withAppDependencies({ createSiteService })
          .build();
        const initialRootState = store.getState();

        await store.dispatch(expressSiteSaved());

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "CREATION_RESULT");
        expect(newState.siteCreation.saveLoadingState).toEqual("success");
        expect(createSiteService._expressSites).toEqual([
          {
            id: siteData.id,
            nature: siteData.nature,
            address: siteData.address,
            surfaceArea: siteData.surfaceArea,
            createdBy: user.id,
            type: siteData.naturalAreaType,
            activity: siteData.agriculturalOperationActivity,
            fricheActivity: siteData.fricheActivity,
          },
        ]);
      },
    );
  });
});
