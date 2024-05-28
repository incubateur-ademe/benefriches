import { FricheActivity } from "../domain/friche.types";
import { InMemoryCreateSiteService } from "../infrastructure/create-site-service/inMemoryCreateSiteApi";
import {
  revertAddressStep,
  revertFricheActivityStep,
  revertFricheRecentAccidentsStep,
  revertFullTimeJobsInvolvedStep,
  revertIsFricheLeasedStep,
  revertIsSiteOperatedStep,
  revertNamingStep,
  revertOperatorStep,
  revertOwnerStep,
  revertSoilsContaminationStep,
  revertSoilsDistributionStep,
  revertSoilsSelectionStep,
  revertSoilsSurfaceAreaDistributionEntryModeStep,
  revertSurfaceAreaStep,
  revertTenantStep,
  revertYearlyExpensesStep,
  revertYearlyIncomeStep,
  saveSiteAction,
} from "./createSite.actions";
import {
  completeAddressStep,
  completeFricheActivity,
  completeFricheRecentAccidents,
  completeFullTimeJobsInvolved,
  completeIsFricheLeased,
  completeIsSiteOperated,
  completeManagementIntroduction,
  completeNaming,
  completeOperator,
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
      describe("complete", () => {
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
      describe("revert", () => {
        it("goes to previous step and unset address data", () => {
          const store = initStoreWithState({
            stepsHistory: ["SITE_TYPE", "ADDRESS"],
            siteData: { isFriche: true, address: siteWithExhaustiveData.address },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertAddressStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: { ...initialState.siteData, address: undefined },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("SOILS_INTRODUCTION", () => {
      describe("complete", () => {
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
    });
    describe("SURFACE_AREA", () => {
      describe("complete", () => {
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
      describe("revert", () => {
        it("goes to previous step and unset surface area", () => {
          const store = initStoreWithState({
            stepsHistory: ["SITE_TYPE", "ADDRESS", "SOILS_SELECTION"],
            siteData: { isFriche: true, surfaceArea: 12000 },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertSurfaceAreaStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: { ...initialState.siteData, surfaceArea: undefined },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("SOILS_SELECTION", () => {
      describe("complete", () => {
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
      describe("revert", () => {
        it("goes to previous step and unset soils data", () => {
          const store = initStoreWithState({
            stepsHistory: ["SITE_TYPE", "ADDRESS", "SOILS_SELECTION"],
            siteData: { isFriche: true, soils: siteWithExhaustiveData.soils },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertSoilsSelectionStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: { ...initialState.siteData, soils: [] },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE", () => {
      describe("complete", () => {
        it("goes to SOILS_SUMMARY step when step is completed with default_even_split", () => {
          const store = initStoreWithState({
            stepsHistory: ["SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE"],
            siteData: {
              surfaceArea: 100000,
              soils: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "BUILDINGS", "FOREST_CONIFER"],
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
                ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED"]: 33333.33,
                ["BUILDINGS"]: 33333.33,
                ["FOREST_CONIFER"]: 33333.34,
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
              soils: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "BUILDINGS", "FOREST_CONIFER"],
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
      describe("revert", () => {
        it("goes to previous step and unset soils distribution entry mode and surface areas", () => {
          const store = initStoreWithState({
            stepsHistory: [
              "SITE_TYPE",
              "ADDRESS",
              "SOILS_SELECTION",
              "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
            ],
            siteData: {
              isFriche: true,
              soils: siteWithExhaustiveData.soils,
              soilsDistribution: siteWithExhaustiveData.soilsDistribution,
              soilsDistributionEntryMode: siteWithExhaustiveData.soilsDistributionEntryMode,
            },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertSoilsSurfaceAreaDistributionEntryModeStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              soilsDistribution: undefined,
              soilsDistributionEntryMode: undefined,
            },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("SOILS_SURFACE_AREAS_DISTRIBUTION", () => {
      describe("complete", () => {
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
      describe("revert", () => {
        it("goes to previous step and unset soils distribution surface areas", () => {
          const store = initStoreWithState({
            stepsHistory: [
              "SITE_TYPE",
              "ADDRESS",
              "SOILS_SELECTION",
              "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
              "SOILS_SURFACE_AREAS_DISTRIBUTION",
            ],
            siteData: {
              isFriche: true,
              soils: siteWithExhaustiveData.soils,
              soilsDistribution: siteWithExhaustiveData.soilsDistribution,
            },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertSoilsDistributionStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: { ...initialState.siteData, soilsDistribution: undefined },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("SOILS_SUMMARY", () => {
      describe("complete", () => {
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
    });
    describe("SOILS_CARBON_STORAGE", () => {
      describe("complete", () => {
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
    });
    describe("SOILS_CONTAMINATION", () => {
      describe("complete", () => {
        it("goes to MANAGEMENT_INTRODUCTION step and sets contamination data when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["SOILS_CONTAMINATION"] });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(
            completeSoilsContamination({
              hasContaminatedSoils: true,
              contaminatedSoilSurface: 2500,
            }),
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
      describe("revert", () => {
        it("goes to previous step and unset soils contamination", () => {
          const store = initStoreWithState({
            stepsHistory: [
              "SITE_TYPE",
              "ADDRESS",
              "SOILS_SELECTION",
              "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
              "SOILS_SURFACE_AREAS_DISTRIBUTION",
              "SOILS_CONTAMINATION",
            ],
            siteData: {
              isFriche: true,
              soils: siteWithExhaustiveData.soils,
              hasContaminatedSoils: true,
              contaminatedSoilSurface: 12000,
            },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertSoilsContaminationStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              hasContaminatedSoils: undefined,
              contaminatedSoilSurface: undefined,
            },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("MANAGEMENT_INTRODUCTION", () => {
      describe("complete", () => {
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
    });
    describe("OWNER", () => {
      describe("complete", () => {
        it("goes to IS_FRICHE_LEASED step if site is friche and sets owner when step is completed", () => {
          const store = initStoreWithState({
            stepsHistory: ["OWNER"],
            siteData: { isFriche: true },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(completeOwner({ owner: siteWithExhaustiveData.owner }));

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: { ...initialState.siteData, owner: siteWithExhaustiveData.owner },
            stepsHistory: [...initialState.stepsHistory, "IS_FRICHE_LEASED"],
          });
        });
        it("goes to IS_SITE_OPERATED step and sets owner when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["OWNER"] });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(completeOwner({ owner: siteWithExhaustiveData.owner }));

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: { ...initialState.siteData, owner: siteWithExhaustiveData.owner },
            stepsHistory: [...initialState.stepsHistory, "IS_SITE_OPERATED"],
          });
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset owner", () => {
          const store = initStoreWithState({
            stepsHistory: ["SITE_TYPE", "ADDRESS", "OWNER"],
            siteData: {
              isFriche: true,
              owner: siteWithExhaustiveData.owner,
            },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertOwnerStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              owner: undefined,
            },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("IS_FRICHE_LEASED", () => {
      describe("complete", () => {
        it("goes to TENANT step and sets isFricheLeased when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["IS_FRICHE_LEASED"] });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(completeIsFricheLeased({ isFricheLeased: true }));

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: { ...initialState.siteData, isFricheLeased: true },
            stepsHistory: [...initialState.stepsHistory, "TENANT"],
          });
        });
        it("goes to FRICHE_RECENT_ACCIDENTS step when step is completed and not leased", () => {
          const store = initStoreWithState({ stepsHistory: ["IS_FRICHE_LEASED"] });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(completeIsFricheLeased({ isFricheLeased: false }));

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: { ...initialState.siteData, isFricheLeased: false },
            stepsHistory: [...initialState.stepsHistory, "FULL_TIME_JOBS_INVOLVED"],
          });
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset isFricheLeased", () => {
          const store = initStoreWithState({
            stepsHistory: ["SITE_TYPE", "ADDRESS", "OWNER", "IS_FRICHE_LEASED"],
            siteData: {
              isFriche: true,
              tenant: siteWithExhaustiveData.tenant,
            },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertIsFricheLeasedStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              isFricheLeased: undefined,
            },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("IS_SITE_OPERATED", () => {
      describe("complete", () => {
        it("goes to OPERATOR step and sets isSiteOperated when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["IS_SITE_OPERATED"] });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(completeIsSiteOperated({ isSiteOperated: true }));

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: { ...initialState.siteData, isSiteOperated: true },
            stepsHistory: [...initialState.stepsHistory, "OPERATOR"],
          });
        });
        it("goes to FULL_TIME_JOBS_INVOLVED step when step is completed and no tenant", () => {
          const store = initStoreWithState({ stepsHistory: ["IS_SITE_OPERATED"] });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(completeIsSiteOperated({ isSiteOperated: false }));

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              isSiteOperated: false,
            },
            stepsHistory: [...initialState.stepsHistory, "YEARLY_EXPENSES"],
          });
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset isSiteOperated", () => {
          const store = initStoreWithState({
            stepsHistory: ["SITE_TYPE", "ADDRESS", "OWNER", "IS_SITE_OPERATED"],
            siteData: {
              tenant: siteWithExhaustiveData.tenant,
            },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertIsSiteOperatedStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              isSiteOperated: undefined,
            },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("OPERATOR", () => {
      describe("complete", () => {
        it("goes to FULL_TIME_JOBS_INVOLVED step and sets tenant when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["OPERATOR"] });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(completeOperator({ tenant: siteWithExhaustiveData.tenant }));

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: { ...initialState.siteData, tenant: siteWithExhaustiveData.tenant },
            stepsHistory: [...initialState.stepsHistory, "FULL_TIME_JOBS_INVOLVED"],
          });
        });
        it("goes to FULL_TIME_JOBS_INVOLVED step when step is completed with tenant", () => {
          const store = initStoreWithState({ stepsHistory: ["OPERATOR"] });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(completeOperator({ tenant: undefined }));

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: initialState.siteData,
            stepsHistory: [...initialState.stepsHistory, "FULL_TIME_JOBS_INVOLVED"],
          });
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset tenant", () => {
          const store = initStoreWithState({
            stepsHistory: ["SITE_TYPE", "ADDRESS", "OWNER", "IS_SITE_OPERATED", "OPERATOR"],
            siteData: {
              tenant: siteWithExhaustiveData.tenant,
            },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertOperatorStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              tenant: undefined,
            },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });

    describe("TENANT", () => {
      describe("complete", () => {
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
      describe("revert", () => {
        it("goes to previous step and unset tenant", () => {
          const store = initStoreWithState({
            stepsHistory: ["SITE_TYPE", "ADDRESS", "OWNER", "TENANT"],
            siteData: {
              isFriche: true,
              tenant: siteWithExhaustiveData.tenant,
            },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertTenantStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              tenant: undefined,
            },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("FULL_TIME_JOBS_INVOLVED", () => {
      describe("complete", () => {
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
      describe("revert", () => {
        it("goes to previous step and unset full time jobs", () => {
          const store = initStoreWithState({
            stepsHistory: ["SITE_TYPE", "ADDRESS", "FULL_TIME_JOBS_INVOLVED"],
            siteData: {
              isFriche: true,
              fullTimeJobsInvolved: 1.2,
            },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertFullTimeJobsInvolvedStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              fullTimeJobsInvolved: undefined,
            },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("FRICHE_RECENT_ACCIDENTS", () => {
      describe("complete", () => {
        it("goes to YEARLY_EXPENSES step and sets accidents data when step is completed and friche has accidents", () => {
          const store = initStoreWithState({ stepsHistory: ["FRICHE_RECENT_ACCIDENTS"] });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(
            completeFricheRecentAccidents({
              hasRecentAccidents: true,
              accidentsDeaths: 1,
              accidentsSevereInjuries: 2,
              accidentsMinorInjuries: 3,
            }),
          );

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              hasRecentAccidents: true,
              accidentsDeaths: 1,
              accidentsSevereInjuries: 2,
              accidentsMinorInjuries: 3,
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
      describe("revert", () => {
        it("goes to previous step and unset friche accidents", () => {
          const store = initStoreWithState({
            stepsHistory: ["SITE_TYPE", "ADDRESS", "FRICHE_RECENT_ACCIDENTS"],
            siteData: {
              isFriche: true,
              hasRecentAccidents: true,
              accidentsDeaths: 1,
              accidentsSevereInjuries: 2,
              accidentsMinorInjuries: 0,
            },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertFricheRecentAccidentsStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              hasRecentAccidents: undefined,
              accidentsDeaths: undefined,
              accidentsSevereInjuries: undefined,
              accidentsMinorInjuries: undefined,
            },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("YEARLY_EXPENSES", () => {
      describe("complete", () => {
        it("goes to YEARLY_EXPENSES_SUMMARY step if site is friche and sets yearly expenses when step is completed", () => {
          const store = initStoreWithState({
            stepsHistory: ["YEARLY_EXPENSES"],
            siteData: { isFriche: true },
          });
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
        it("goes to YEARLY_INCOME step if site is worked and sets yearly expenses when step is completed", () => {
          const store = initStoreWithState({
            stepsHistory: ["YEARLY_EXPENSES"],
            siteData: { isSiteOperated: true },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(completeYearlyExpenses(siteWithExhaustiveData.yearlyExpenses));

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              yearlyExpenses: siteWithExhaustiveData.yearlyExpenses,
            },
            stepsHistory: [...initialState.stepsHistory, "YEARLY_INCOME"],
          });
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset yearly expenses", () => {
          const store = initStoreWithState({
            stepsHistory: ["SITE_TYPE", "ADDRESS", "YEARLY_EXPENSES"],
            siteData: { isFriche: true, yearlyExpenses: siteWithExhaustiveData.yearlyExpenses },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertYearlyExpensesStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              yearlyExpenses: [],
            },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("YEARLY_EXPENSES_SUMMARY", () => {
      describe("complete", () => {
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
        it("goes to NAMING step when step is completed and site is not a friche", () => {
          const store = initStoreWithState({
            stepsHistory: ["YEARLY_EXPENSES_SUMMARY"],
            siteData: { isFriche: false },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(completeYearlyExpensesSummary());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            stepsHistory: [...initialState.stepsHistory, "NAMING"],
          });
        });
      });
    });
    describe("YEARLY_INCOME", () => {
      it("goes to YEARLY_EXPENSES_SUMMARY step and sets yearly income when step is completed", () => {
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
          stepsHistory: [...initialState.stepsHistory, "YEARLY_EXPENSES_SUMMARY"],
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset yearly income", () => {
          const store = initStoreWithState({
            stepsHistory: ["SITE_TYPE", "ADDRESS", "YEARLY_INCOME"],
            siteData: { isFriche: true, yearlyIncomes: siteWithExhaustiveData.yearlyIncomes },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertYearlyIncomeStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              yearlyIncomes: [],
            },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("FRICHE_ACTIVITY", () => {
      describe("complete", () => {
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
      describe("revert", () => {
        it("goes to previous step and unset friche activity", () => {
          const store = initStoreWithState({
            stepsHistory: ["SITE_TYPE", "ADDRESS", "FRICHE_ACTIVITY"],
            siteData: { isFriche: true, fricheActivity: siteWithExhaustiveData.fricheActivity },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertFricheActivityStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              fricheActivity: undefined,
            },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
        });
      });
    });
    describe("NAMING", () => {
      describe("complete", () => {
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
      describe("revert", () => {
        it("goes to previous step and unset naming", () => {
          const store = initStoreWithState({
            stepsHistory: ["SITE_TYPE", "ADDRESS", "NAMING"],
            siteData: { isFriche: true, name: "site 1", description: "blabla" },
          });
          const { siteCreation: initialState } = store.getState();

          store.dispatch(revertNamingStep());

          const newState = store.getState().siteCreation;
          expect(newState).toEqual<RootState["siteCreation"]>({
            ...initialState,
            siteData: {
              ...initialState.siteData,
              name: undefined,
              description: undefined,
            },
            stepsHistory: initialState.stepsHistory.slice(0, -1),
          });
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
          createUserState: "idle",
          currentUserLoaded: true,
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
        {
          siteCreation: initialState,
          currentUser: {
            currentUser: buildUser(),
            createUserState: "idle",
            currentUserLoaded: true,
          },
        },
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
        currentUser: {
          currentUser: buildUser(),
          createUserState: "idle",
          currentUserLoaded: true,
        },
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
