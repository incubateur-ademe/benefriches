import { FricheActivity } from "../domain/friche.types";
import { InMemoryCreateSiteService } from "../infrastructure/create-site-service/inMemoryCreateSiteApi";
import { saveSiteAction } from "./createSite.actions";
import {
  completeAddressStep,
  completeFricheActivity,
  completeFricheRecentAccidents,
  completeFullTimeJobsInvolved,
  completeManagementIntroduction,
  completeNaming,
  completeOwner,
  completeSiteSurfaceArea,
  completeSiteTypeStep,
  completeSoils,
  completeSoilsCarbonStorage,
  completeSoilsContamination,
  completeSoilsDistribution,
  completeSoilsIntroduction,
  completeSoilsSummary,
  completeSoilsSurfaceAreaDistributionEntryMode,
  completeSummary,
  completeTenant,
  completeYearlyExpenses,
  completeYearlyExpensesSummary,
  completeYearlyIncome,
  getInitialState,
} from "./createSite.reducer";
import {
  fricheWithExhaustiveData,
  fricheWithMinimalData,
  siteWithExhaustiveData,
  siteWithMinimalData,
} from "./siteData.mock";

import { createStore, RootState } from "@/app/application/store";
import { buildUser } from "@/features/users/domain/user.mock";
import { SoilType } from "@/shared/domain/soils";
import { getTestAppDependencies } from "@/test/testAppDependencies";

describe("Create site reducer", () => {
  describe("Data creation flow", () => {
    it.each([
      {
        initialState: { step: "SITE_TYPE" },
        action: completeSiteTypeStep({ isFriche: true }),
        expectedState: { step: "ADDRESS", siteData: { isFriche: true } },
      },
      {
        initialState: { step: "ADDRESS" },
        action: completeAddressStep({ address: siteWithExhaustiveData.address }),
        expectedState: {
          step: "SOILS_INTRODUCTION",
          siteData: { address: siteWithExhaustiveData.address },
        },
      },
      {
        initialState: { step: "SOILS_INTRODUCTION" },
        action: completeSoilsIntroduction(),
        expectedState: {
          step: "SURFACE_AREA",
        },
      },
      {
        initialState: { step: "SURFACE_AREA" },
        action: completeSiteSurfaceArea({ surfaceArea: siteWithExhaustiveData.surfaceArea }),
        expectedState: {
          step: "SOILS_SELECTION",
          siteData: { surfaceArea: siteWithExhaustiveData.surfaceArea },
        },
      },
      {
        initialState: { step: "SOILS_SELECTION" },
        action: completeSoils({ soils: siteWithExhaustiveData.soils }),
        expectedState: {
          step: "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
          siteData: { soils: siteWithExhaustiveData.soils },
        },
      },
      {
        initialState: {
          step: "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
          siteData: {
            surfaceArea: 100000,
            soils: [
              SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
              SoilType.BUILDINGS,
              SoilType.FOREST_CONIFER,
            ] as SoilType[],
          },
        },
        action: completeSoilsSurfaceAreaDistributionEntryMode("default_even_split"),
        expectedState: {
          step: "SOILS_SUMMARY",
          siteData: {
            soilsDistributionEntryMode: "default_even_split",
            soilsDistribution: {
              [SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED]: 33333.33,
              [SoilType.BUILDINGS]: 33333.33,
              [SoilType.FOREST_CONIFER]: 33333.34,
            },
          },
        },
        testAdditionalInfo: "with default_even_split mode and soils distribution should be set",
      },
      {
        initialState: {
          step: "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
        },
        action: completeSoilsSurfaceAreaDistributionEntryMode("square_meters"),
        expectedState: {
          step: "SOILS_SURFACE_AREAS_DISTRIBUTION",
          siteData: {
            soilsDistributionEntryMode: "square_meters",
          },
        },
        testAdditionalInfo: "with default_even_split mode and soils distribution should be set",
      },
      {
        initialState: { step: "SOILS_SURFACE_AREAS_DISTRIBUTION" },
        action: completeSoilsDistribution({
          distribution: siteWithExhaustiveData.soilsDistribution,
        }),
        expectedState: {
          step: "SOILS_SUMMARY",
          siteData: { soilsDistribution: siteWithExhaustiveData.soilsDistribution },
        },
      },
      {
        initialState: { step: "SOILS_SUMMARY" },
        action: completeSoilsSummary(),
        expectedState: {
          step: "SOILS_CARBON_STORAGE",
        },
      },
      {
        initialState: { step: "SOILS_CARBON_STORAGE", siteData: { isFriche: true } },
        action: completeSoilsCarbonStorage(),
        expectedState: {
          step: "SOILS_CONTAMINATION",
        },
        testAdditionalInfo: "and site is a friche",
      },
      {
        initialState: { step: "SOILS_CARBON_STORAGE", siteData: { isFriche: false } },
        action: completeSoilsCarbonStorage(),
        expectedState: {
          step: "MANAGEMENT_INTRODUCTION",
        },
        testAdditionalInfo: "and site is not a friche",
      },
      {
        initialState: { step: "SOILS_CONTAMINATION" },
        action: completeSoilsContamination({
          hasContaminatedSoils: true,
          contaminatedSoilSurface: 2500,
        }),
        expectedState: {
          step: "MANAGEMENT_INTRODUCTION",
          siteData: { hasContaminatedSoils: true, contaminatedSoilSurface: 2500 },
        },
      },
      {
        initialState: { step: "MANAGEMENT_INTRODUCTION" },
        action: completeManagementIntroduction(),
        expectedState: {
          step: "OWNER",
        },
      },
      {
        initialState: { step: "OWNER" },
        action: completeOwner({ owner: siteWithExhaustiveData.owner }),
        expectedState: {
          step: "TENANT",
          siteData: { owner: siteWithExhaustiveData.owner },
        },
      },
      {
        initialState: { step: "TENANT" },
        action: completeTenant({ tenant: siteWithExhaustiveData.tenant }),
        expectedState: {
          step: "FULL_TIME_JOBS_INVOLVED",
          siteData: { tenant: siteWithExhaustiveData.tenant },
        },
      },
      {
        initialState: { step: "FULL_TIME_JOBS_INVOLVED", siteData: { isFriche: true } },
        action: completeFullTimeJobsInvolved({ jobs: 0.3 }),
        expectedState: {
          step: "FRICHE_RECENT_ACCIDENTS",
          siteData: { fullTimeJobsInvolved: 0.3 },
        },
        testAdditionalInfo: "and site is a friche",
      },
      {
        initialState: { step: "FULL_TIME_JOBS_INVOLVED", siteData: { isFriche: false } },
        action: completeFullTimeJobsInvolved({ jobs: 0.3 }),
        expectedState: {
          step: "YEARLY_EXPENSES",
          siteData: { fullTimeJobsInvolved: 0.3 },
        },
        testAdditionalInfo: "and site is not a friche",
      },
      {
        initialState: { step: "FRICHE_RECENT_ACCIDENTS" },
        action: completeFricheRecentAccidents({
          hasRecentAccidents: true,
          minorInjuriesPersons: 1,
          deaths: 0,
          severeInjuriesPersons: 2,
        }),
        expectedState: {
          step: "YEARLY_EXPENSES",
          siteData: {
            hasRecentAccidents: true,
            minorInjuriesPersons: 1,
            deaths: 0,
            severeInjuriesPersons: 2,
          },
        },
      },
      {
        initialState: { step: "YEARLY_EXPENSES" },
        action: completeYearlyExpenses(siteWithExhaustiveData.yearlyExpenses),
        expectedState: {
          step: "YEARLY_EXPENSES_SUMMARY",
          siteData: { yearlyExpenses: siteWithExhaustiveData.yearlyExpenses },
        },
      },
      {
        initialState: { step: "YEARLY_EXPENSES_SUMMARY", siteData: { isFriche: true } },
        action: completeYearlyExpensesSummary(),
        expectedState: {
          step: "FRICHE_ACTIVITY",
        },
        testAdditionalInfo: "and site is a friche",
      },
      {
        initialState: { step: "YEARLY_EXPENSES_SUMMARY", siteData: { isFriche: false } },
        action: completeYearlyExpensesSummary(),
        expectedState: {
          step: "YEARLY_INCOME",
        },
        testAdditionalInfo: "and site is not a friche",
      },
      {
        initialState: { step: "YEARLY_INCOME" },
        action: completeYearlyIncome(siteWithExhaustiveData.yearlyIncomes),
        expectedState: {
          step: "NAMING",
          siteData: { yearlyIncomes: siteWithExhaustiveData.yearlyIncomes },
        },
      },
      {
        initialState: { step: "FRICHE_ACTIVITY" },
        action: completeFricheActivity(FricheActivity.AGRICULTURE),
        expectedState: {
          step: "NAMING",
          siteData: { fricheActivity: FricheActivity.AGRICULTURE },
        },
      },
      {
        initialState: { step: "NAMING" },
        action: completeNaming({ name: "My site", description: "A description" }),
        expectedState: {
          step: "FINAL_SUMMARY",
          siteData: { name: "My site", description: "A description" },
        },
      },
      {
        initialState: { step: "FINAL_SUMMARY" },
        action: completeSummary(),
        expectedState: {
          step: "CREATION_CONFIRMATION",
        },
      },
    ] as const)(
      "goes to $initialState.step step when $expectedState.step is completed $testAdditionalInfo",
      ({ initialState: initialStatePartial, action, expectedState }) => {
        const store = createStore(getTestAppDependencies(), {
          siteCreation: { ...getInitialState(), ...initialStatePartial },
        });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(action);

        expect(store.getState().siteCreation).toEqual<RootState["siteCreation"]>({
          ...initialState,
          step: expectedState.step,
          siteData: { ...initialState.siteData, ...expectedState.siteData },
        });
      },
    );
  });

  describe("saveSite action", () => {
    it("should be in error state when site data in store is not valid (missing name)", async () => {
      const siteData = { ...siteWithMinimalData, name: undefined };
      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        step: "CREATION_CONFIRMATION",
        siteData,
      };

      const store = createStore(getTestAppDependencies(), {
        siteCreation: initialState,
        currentUser: {
          currentUser: buildUser(),
        },
      });
      await store.dispatch(saveSiteAction());

      const state = store.getState();
      expect(state.siteCreation).toEqual({
        ...initialState,
        saveLoadingState: "error",
      });
    });

    it("should be in error state when no user id in store", async () => {
      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        step: "CREATION_CONFIRMATION",
        siteData: siteWithMinimalData,
      };

      const store = createStore(getTestAppDependencies(), {
        siteCreation: initialState,
      });
      await store.dispatch(saveSiteAction());

      const state = store.getState();
      expect(state.siteCreation).toEqual({
        ...initialState,
        saveLoadingState: "error",
      });
    });

    it("should be in error state when createSiteService fails", async () => {
      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        step: "CREATION_CONFIRMATION",
        siteData: siteWithMinimalData,
      };

      const shouldFail = true;
      const store = createStore(
        getTestAppDependencies({ createSiteService: new InMemoryCreateSiteService(shouldFail) }),
        { siteCreation: initialState, currentUser: { currentUser: buildUser() } },
      );
      await store.dispatch(saveSiteAction());

      const state = store.getState();
      expect(state.siteCreation).toEqual({
        ...initialState,
        saveLoadingState: "error",
      });
    });

    it.each([
      { siteData: siteWithMinimalData, dataType: "site with minimal data" },
      { siteData: siteWithExhaustiveData, dataType: "site with exhaustive data" },
      { siteData: fricheWithMinimalData, dataType: "friche with minimal data" },
      { siteData: fricheWithExhaustiveData, dataType: "friche with exhaustive data" },
    ])("should be in success state when saving $dataType", async ({ siteData }) => {
      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        step: "CREATION_CONFIRMATION",
        siteData,
      };

      const store = createStore(getTestAppDependencies(), {
        siteCreation: initialState,
        currentUser: { currentUser: buildUser() },
      });

      await store.dispatch(saveSiteAction());

      const state = store.getState();
      expect(state.siteCreation).toEqual({
        ...initialState,
        saveLoadingState: "success",
      });
    });
  });
});
