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
  describe("Data creation steps", () => {
    const initStoreWithState = (siteCreationState: Partial<RootState["siteCreation"]>) => {
      return createStore(getTestAppDependencies(), {
        siteCreation: {
          ...getInitialState(),
          ...siteCreationState,
        },
      });
    };
    describe("SITE_TYPE", () => {
      it("goes to ADDRESS step and sets type when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["SITE_TYPE"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeSiteTypeStep({ isFriche: true }));

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: { ...initialState.siteData, isFriche: true },
          stepsHistory: [...initialState.stepsHistory, "ADDRESS"],
        });
      });
    });
    describe("ADDRESS", () => {
      it("goes to SOILS_INTRODUCTION step and sets address when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["ADDRESS"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeAddressStep({ address: siteWithExhaustiveData.address }));

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: { ...initialState.siteData, address: siteWithExhaustiveData.address },
          stepsHistory: [...initialState.stepsHistory, "SOILS_INTRODUCTION"],
        });
      });
    });
    describe("SOILS_INTRODUCTION", () => {
      it("goes to SURFACE_AREA step when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["SOILS_INTRODUCTION"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeSoilsIntroduction());

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          stepsHistory: [...initialState.stepsHistory, "SURFACE_AREA"],
        });
      });
    });
    describe("SURFACE_AREA", () => {
      it("goes to SOILS_SELECTION step and sets surface area when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["SURFACE_AREA"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeSiteSurfaceArea({ surfaceArea: 143000 }));

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: { ...initialState.siteData, surfaceArea: 143000 },
          stepsHistory: [...initialState.stepsHistory, "SOILS_SELECTION"],
        });
      });
    });
    describe("SOILS_SELECTION", () => {
      it("goes to SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE step and sets soils when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["SOILS_SELECTION"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeSoils({ soils: siteWithExhaustiveData.soils }));

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: { ...initialState.siteData, soils: siteWithExhaustiveData.soils },
          stepsHistory: [
            ...initialState.stepsHistory,
            "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
          ],
        });
      });
    });
    describe("SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE", () => {
      it("goes to SOILS_SUMMARY step when step is completed with default_even_split", () => {
        const store = initStoreWithState({
          stepsHistory: ["SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE"],
          siteData: {
            surfaceArea: 100000,
            soils: [
              SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
              SoilType.BUILDINGS,
              SoilType.FOREST_CONIFER,
            ],
          },
        });

        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeSoilsSurfaceAreaDistributionEntryMode("default_even_split"));

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: {
            ...initialState.siteData,
            soilsDistributionEntryMode: "default_even_split",
            soilsDistribution: {
              [SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED]: 33333.33,
              [SoilType.BUILDINGS]: 33333.33,
              [SoilType.FOREST_CONIFER]: 33333.34,
            },
          },
          stepsHistory: [...initialState.stepsHistory, "SOILS_SUMMARY"],
        });
      });

      it("goes to SOILS_SURFACE_AREAS_DISTRIBUTION step when step is completed with square_meters", () => {
        const store = initStoreWithState({
          stepsHistory: ["SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE"],
          siteData: {
            surfaceArea: 100000,
            soils: [
              SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
              SoilType.BUILDINGS,
              SoilType.FOREST_CONIFER,
            ],
          },
        });

        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeSoilsSurfaceAreaDistributionEntryMode("square_meters"));

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: {
            ...initialState.siteData,
            soilsDistributionEntryMode: "square_meters",
          },
          stepsHistory: [...initialState.stepsHistory, "SOILS_SURFACE_AREAS_DISTRIBUTION"],
        });
      });
    });
    describe("SOILS_SURFACE_AREAS_DISTRIBUTION", () => {
      it("goes to SOILS_SUMMARY step and sets soils distribution when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["SOILS_SURFACE_AREAS_DISTRIBUTION"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(
          completeSoilsDistribution({ distribution: siteWithExhaustiveData.soilsDistribution }),
        );

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: {
            ...initialState.siteData,
            soilsDistribution: siteWithExhaustiveData.soilsDistribution,
          },
          stepsHistory: [...initialState.stepsHistory, "SOILS_SUMMARY"],
        });
      });
    });
    describe("SOILS_SUMMARY", () => {
      it("goes to SOILS_CARBON_STORAGE step when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["SOILS_SUMMARY"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeSoilsSummary());

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          stepsHistory: [...initialState.stepsHistory, "SOILS_CARBON_STORAGE"],
        });
      });
    });
    describe("SOILS_CARBON_STORAGE", () => {
      it("goes to SOILS_CONTAMINATION step when step is completed and site is a friche", () => {
        const store = initStoreWithState({
          stepsHistory: ["SOILS_CARBON_STORAGE"],
          siteData: { isFriche: true },
        });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeSoilsCarbonStorage());

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          stepsHistory: [...initialState.stepsHistory, "SOILS_CONTAMINATION"],
        });
      });
      it("goes to MANAGEMENT_INTRODUCTION step when step is completed and site is not a friche", () => {
        const store = initStoreWithState({
          stepsHistory: ["SOILS_CARBON_STORAGE"],
          siteData: { isFriche: false },
        });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeSoilsCarbonStorage());

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: initialState.siteData,
          stepsHistory: [...initialState.stepsHistory, "MANAGEMENT_INTRODUCTION"],
        });
      });
    });
    describe("SOILS_CONTAMINATION", () => {
      it("goes to MANAGEMENT_INTRODUCTION step and sets contamination data when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["SOILS_CONTAMINATION"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(
          completeSoilsContamination({ hasContaminatedSoils: true, contaminatedSoilSurface: 2500 }),
        );

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: {
            ...initialState.siteData,
            hasContaminatedSoils: true,
            contaminatedSoilSurface: 2500,
          },
          stepsHistory: [...initialState.stepsHistory, "MANAGEMENT_INTRODUCTION"],
        });
      });
    });
    describe("MANAGEMENT_INTRODUCTION", () => {
      it("goes to OWNER step when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["MANAGEMENT_INTRODUCTION"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeManagementIntroduction());

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          stepsHistory: [...initialState.stepsHistory, "OWNER"],
        });
      });
    });
    describe("OWNER", () => {
      it("goes to TENANT step and sets owner when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["OWNER"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeOwner({ owner: siteWithExhaustiveData.owner }));

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: { ...initialState.siteData, owner: siteWithExhaustiveData.owner },
          stepsHistory: [...initialState.stepsHistory, "TENANT"],
        });
      });
    });
    describe("TENANT", () => {
      it("goes to FULL_TIME_JOBS_INVOLVED step and sets tenant when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["TENANT"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeTenant({ tenant: siteWithExhaustiveData.tenant }));

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: { ...initialState.siteData, tenant: siteWithExhaustiveData.tenant },
          stepsHistory: [...initialState.stepsHistory, "FULL_TIME_JOBS_INVOLVED"],
        });
      });
      it("goes to FULL_TIME_JOBS_INVOLVED step when step is completed and no tenant", () => {
        const store = initStoreWithState({ stepsHistory: ["TENANT"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeTenant({ tenant: undefined }));

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: initialState.siteData,
          stepsHistory: [...initialState.stepsHistory, "FULL_TIME_JOBS_INVOLVED"],
        });
      });
    });
    describe("FULL_TIME_JOBS_INVOLVED", () => {
      it("goes to FRICHE_RECENT_ACCIDENTS step and sets owner when step is completed and site is a friche", () => {
        const store = initStoreWithState({
          stepsHistory: ["FULL_TIME_JOBS_INVOLVED"],
          siteData: { isFriche: true },
        });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(
          completeFullTimeJobsInvolved({ jobs: siteWithExhaustiveData.fullTimeJobsInvolved }),
        );

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: {
            ...initialState.siteData,
            fullTimeJobsInvolved: siteWithExhaustiveData.fullTimeJobsInvolved,
          },
          stepsHistory: [...initialState.stepsHistory, "FRICHE_RECENT_ACCIDENTS"],
        });
      });
      it("goes to YEARLY_EXPENSES step and sets owner when step is completed and site is not a friche", () => {
        const store = initStoreWithState({
          stepsHistory: ["FULL_TIME_JOBS_INVOLVED"],
          siteData: { isFriche: false },
        });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(
          completeFullTimeJobsInvolved({ jobs: siteWithExhaustiveData.fullTimeJobsInvolved }),
        );

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: {
            ...initialState.siteData,
            fullTimeJobsInvolved: siteWithExhaustiveData.fullTimeJobsInvolved,
          },
          stepsHistory: [...initialState.stepsHistory, "YEARLY_EXPENSES"],
        });
      });
    });
    describe("FRICHE_RECENT_ACCIDENTS", () => {
      it("goes to YEARLY_EXPENSES step and sets accidents data when step is completed and friche has accidents", () => {
        const store = initStoreWithState({ stepsHistory: ["FRICHE_RECENT_ACCIDENTS"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(
          completeFricheRecentAccidents({
            hasRecentAccidents: true,
            deaths: 1,
            severeInjuriesPersons: 2,
            minorInjuriesPersons: 3,
          }),
        );

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: {
            ...initialState.siteData,
            hasRecentAccidents: true,
            deaths: 1,
            severeInjuriesPersons: 2,
            minorInjuriesPersons: 3,
          },
          stepsHistory: [...initialState.stepsHistory, "YEARLY_EXPENSES"],
        });
      });
      it("goes to YEARLY_EXPENSES step and sets accidents data when step is completed and friche has no accident", () => {
        const store = initStoreWithState({ stepsHistory: ["FRICHE_RECENT_ACCIDENTS"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeFricheRecentAccidents({ hasRecentAccidents: false }));

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: { ...initialState.siteData, hasRecentAccidents: false },
          stepsHistory: [...initialState.stepsHistory, "YEARLY_EXPENSES"],
        });
      });
    });
    describe("YEARLY_EXPENSES", () => {
      it("goes to YEARLY_EXPENSES_SUMMARY step and sets yearly expenses when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["YEARLY_EXPENSES"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeYearlyExpenses(siteWithExhaustiveData.yearlyExpenses));

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: {
            ...initialState.siteData,
            yearlyExpenses: siteWithExhaustiveData.yearlyExpenses,
          },
          stepsHistory: [...initialState.stepsHistory, "YEARLY_EXPENSES_SUMMARY"],
        });
      });
    });
    describe("YEARLY_EXPENSES_SUMMARY", () => {
      it("goes to FRICHE_ACTIVITY step when step is completed and site is a friche", () => {
        const store = initStoreWithState({
          stepsHistory: ["YEARLY_EXPENSES_SUMMARY"],
          siteData: { isFriche: true },
        });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeYearlyExpensesSummary());

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          stepsHistory: [...initialState.stepsHistory, "FRICHE_ACTIVITY"],
        });
      });
      it("goes to YEARLY_INCOME step when step is completed and site is not a friche", () => {
        const store = initStoreWithState({
          stepsHistory: ["YEARLY_EXPENSES_SUMMARY"],
          siteData: { isFriche: false },
        });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeYearlyExpensesSummary());

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          stepsHistory: [...initialState.stepsHistory, "YEARLY_INCOME"],
        });
      });
    });
    describe("YEARLY_INCOME", () => {
      it("goes to NAMING step and sets yearly income when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["YEARLY_INCOME"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeYearlyIncome(siteWithExhaustiveData.yearlyIncomes));

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: {
            ...initialState.siteData,
            yearlyIncomes: siteWithExhaustiveData.yearlyIncomes,
          },
          stepsHistory: [...initialState.stepsHistory, "NAMING"],
        });
      });
    });
    describe("FRICHE_ACTIVITY", () => {
      it("goes to NAMING step and sets friche activity when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["FRICHE_ACTIVITY"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeFricheActivity(FricheActivity.BUSINESS));

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: {
            ...initialState.siteData,
            fricheActivity: FricheActivity.BUSINESS,
          },
          stepsHistory: [...initialState.stepsHistory, "NAMING"],
        });
      });
    });
    describe("NAMING", () => {
      it("goes to FINAL_SUMMARY step and sets name and description when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["NAMING"] });
        const { siteCreation: initialState } = store.getState();

        const { name, description } = siteWithExhaustiveData;
        store.dispatch(completeNaming({ name, description }));

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          siteData: {
            ...initialState.siteData,
            name,
            description,
          },
          stepsHistory: [...initialState.stepsHistory, "FINAL_SUMMARY"],
        });
      });
    });
    describe("FINAL_SUMMARY", () => {
      it("goes to CREATION_CONFIRMATION step when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["FINAL_SUMMARY"] });
        const { siteCreation: initialState } = store.getState();

        store.dispatch(completeSummary());

        const newState = store.getState().siteCreation;
        expect(newState).toEqual<RootState["siteCreation"]>({
          ...initialState,
          stepsHistory: [...initialState.stepsHistory, "CREATION_CONFIRMATION"],
        });
      });
    });
  });

  describe("saveSite action", () => {
    it("should be in error state when site data in store is not valid (missing name)", async () => {
      const siteData = { ...siteWithMinimalData, name: undefined };
      const initialState: RootState["siteCreation"] = {
        saveLoadingState: "idle",
        stepsHistory: ["CREATION_CONFIRMATION"],
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
        stepsHistory: ["CREATION_CONFIRMATION"],
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
        stepsHistory: ["CREATION_CONFIRMATION"],
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
        stepsHistory: ["CREATION_CONFIRMATION"],
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
