import { createStore, RootState } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import {
  isFricheReverted,
  revertAddressStep,
  revertFricheAccidentsStep,
  revertFricheActivityStep,
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
} from "../actions/createSite.actions";
import {
  completeAddressStep,
  completeFricheAccidents,
  completeFricheAccidentsIntroduction,
  completeFricheActivity,
  completeIsFricheLeased,
  completeIsSiteOperated,
  completeManagementIntroduction,
  completeNaming,
  completeOperator,
  completeOwner,
  completeSiteSurfaceArea,
  completeSoils,
  completeSoilsCarbonStorage,
  completeSoilsContamination,
  completeSoilsContaminationIntroductionStep,
  completeSoilsDistribution,
  completeSoilsIntroduction,
  completeSoilsSummary,
  completeSoilsSurfaceAreaDistributionEntryMode,
  completeTenant,
  completeYearlyExpenses,
  completeYearlyExpensesSummary,
  completeYearlyIncome,
  getInitialState,
  namingIntroductionStepCompleted,
  isFricheCompleted,
  introductionStepCompleted,
  createModeSelectionCompleted,
} from "../createSite.reducer";
import { siteWithExhaustiveData } from "../siteData.mock";
import {
  expectNewCurrentStep,
  expectSiteDataDiff,
  expectSiteDataUnchanged,
  expectStepReverted,
} from "./testHelpers";

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
    describe("INTRODUCTION", () => {
      it("goes to IS_FRICHE step when step completed", () => {
        const store = initStoreWithState({ stepsHistory: ["INTRODUCTION"] });
        const initialRootState = store.getState();

        store.dispatch(introductionStepCompleted());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "IS_FRICHE");
      });
    });
    describe("IS_FRICHE", () => {
      // it("goes to SITE_NATURE step when step is completed and site is not a friche", () => {
      //   const store = initStoreWithState({ stepsHistory: ["IS_FRICHE"] });
      //   const initialRootState = store.getState();

      //   store.dispatch(isFricheCompleted({ isFriche: false }));

      //   const newState = store.getState();
      //   expectSiteDataDiff(initialRootState, newState, { isFriche: false });
      //   expectNewCurrentStep(initialRootState, newState, "SITE_NATURE");
      // });
      it("goes to CREATE_MODE_SELECTION step and sets site nature to friche when step is completed and site is a friche", () => {
        const store = initStoreWithState({ stepsHistory: ["IS_FRICHE"] });
        const initialRootState = store.getState();

        store.dispatch(isFricheCompleted({ isFriche: true }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { isFriche: true });
        expectNewCurrentStep(initialRootState, newState, "CREATE_MODE_SELECTION");
      });
      it("goes to previous step and unsets isFriche when step is reverted", () => {
        const store = initStoreWithState({ stepsHistory: ["INTRODUCTION", "IS_FRICHE"] });
        const initialRootState = store.getState();

        store.dispatch(isFricheReverted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { isFriche: undefined });
        expectStepReverted(initialRootState, newState);
      });
    });
    describe("CREATE_MODE_SELECTION", () => {
      it("goes to FRICHE_ACTIVITY step when 'custom' mode is selected and site is a friche", () => {
        const store = initStoreWithState({
          stepsHistory: ["IS_FRICHE", "CREATE_MODE_SELECTION"],
          siteData: { isFriche: true },
        });
        const initialRootState = store.getState();

        store.dispatch(createModeSelectionCompleted({ createMode: "custom" }));

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "FRICHE_ACTIVITY");
      });
      it("goes to ADDRESS step when 'custom' mode is selected and site is NOT a friche", () => {
        const store = initStoreWithState({
          stepsHistory: ["IS_FRICHE", "CREATE_MODE_SELECTION"],
          siteData: { isFriche: false },
        });
        const initialRootState = store.getState();

        store.dispatch(createModeSelectionCompleted({ createMode: "custom" }));

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "ADDRESS");
      });
      it("goes to ADDRESS step when 'express' mode is selected", () => {
        const store = initStoreWithState({ stepsHistory: ["IS_FRICHE", "CREATE_MODE_SELECTION"] });
        const initialRootState = store.getState();

        store.dispatch(createModeSelectionCompleted({ createMode: "express" }));

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "ADDRESS");
      });
    });
    describe("FRICHE_ACTIVITY", () => {
      describe("complete", () => {
        it("goes to ADDRESS step and sets friche activity when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["FRICHE_ACTIVITY"] });
          const initialRootState = store.getState();

          store.dispatch(completeFricheActivity("INDUSTRY"));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            fricheActivity: "INDUSTRY",
          });
          expectNewCurrentStep(initialRootState, newState, "ADDRESS");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset friche activity", () => {
          const store = initStoreWithState({
            stepsHistory: ["IS_FRICHE", "FRICHE_ACTIVITY"],
            siteData: { isFriche: true, fricheActivity: siteWithExhaustiveData.fricheActivity },
          });
          const initialRootState = store.getState();

          store.dispatch(revertFricheActivityStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            fricheActivity: undefined,
          });
          expectStepReverted(initialRootState, newState);
        });
      });
    });
    describe("ADDRESS", () => {
      describe("complete", () => {
        it("goes to SOILS_INTRODUCTION step and sets address when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["ADDRESS"] });
          const initialRootState = store.getState();

          store.dispatch(completeAddressStep({ address: siteWithExhaustiveData.address }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            address: siteWithExhaustiveData.address,
          });
          expectNewCurrentStep(initialRootState, newState, "SOILS_INTRODUCTION");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset address data", () => {
          const store = initStoreWithState({
            stepsHistory: ["IS_FRICHE", "ADDRESS"],
            siteData: { isFriche: true, address: siteWithExhaustiveData.address },
          });
          const initialRootState = store.getState();

          store.dispatch(revertAddressStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { address: undefined });
          expectStepReverted(initialRootState, newState);
        });
      });
    });
    describe("SOILS_INTRODUCTION", () => {
      describe("complete", () => {
        it("goes to SURFACE_AREA step when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["SOILS_INTRODUCTION"] });
          const initialRootState = store.getState();

          store.dispatch(completeSoilsIntroduction());

          const newState = store.getState();
          expectSiteDataUnchanged(initialRootState, newState);
          expectNewCurrentStep(initialRootState, newState, "SURFACE_AREA");
        });
      });
    });
    describe("SURFACE_AREA", () => {
      describe("complete", () => {
        describe("custom mode", () => {
          it("goes to SOILS_SELECTION step and sets surface area when step is completed", () => {
            const store = initStoreWithState({
              createMode: "custom",
              stepsHistory: ["SURFACE_AREA"],
            });
            const initialRootState = store.getState();

            store.dispatch(completeSiteSurfaceArea({ surfaceArea: 143000 }));

            const newState = store.getState();
            expectSiteDataDiff(initialRootState, newState, { surfaceArea: 143000 });
            expectNewCurrentStep(initialRootState, newState, "SOILS_SELECTION");
          });
          describe("revert", () => {
            it("goes to previous step and unset surface area", () => {
              const store = initStoreWithState({
                stepsHistory: ["IS_FRICHE", "ADDRESS", "SOILS_SELECTION"],
                siteData: { isFriche: true, surfaceArea: 12000 },
              });
              const initialRootState = store.getState();

              store.dispatch(revertSurfaceAreaStep());

              const newState = store.getState();
              expectSiteDataDiff(initialRootState, newState, { surfaceArea: undefined });
              expectStepReverted(initialRootState, newState);
            });
          });
        });
        describe("express mode", () => {
          it("sets surface area when step is completed", () => {
            const store = initStoreWithState({
              createMode: "express",
              stepsHistory: ["SURFACE_AREA"],
            });
            const initialRootState = store.getState();

            store.dispatch(completeSiteSurfaceArea({ surfaceArea: 143000 }));

            const newState = store.getState();
            expectSiteDataDiff(initialRootState, newState, { surfaceArea: 143000 });
            expect(newState.siteCreation.stepsHistory).toEqual(
              initialRootState.siteCreation.stepsHistory,
            );
          });
        });
      });
    });
    describe("SOILS_SELECTION", () => {
      describe("complete", () => {
        it("goes to SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE step and sets soils when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["SOILS_SELECTION"] });
          const initialRootState = store.getState();

          store.dispatch(completeSoils({ soils: siteWithExhaustiveData.soils }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { soils: siteWithExhaustiveData.soils });
          expectNewCurrentStep(
            initialRootState,
            newState,
            "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
          );
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset soils data", () => {
          const store = initStoreWithState({
            stepsHistory: ["IS_FRICHE", "ADDRESS", "SOILS_SELECTION"],
            siteData: { isFriche: true, soils: siteWithExhaustiveData.soils },
          });
          const initialRootState = store.getState();

          store.dispatch(revertSoilsSelectionStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { soils: [] });
          expectStepReverted(initialRootState, newState);
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

          const initialRootState = store.getState();

          store.dispatch(completeSoilsSurfaceAreaDistributionEntryMode("default_even_split"));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            soilsDistributionEntryMode: "default_even_split",
            soilsDistribution: {
              ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED"]: 33333.33,
              ["BUILDINGS"]: 33333.33,
              ["FOREST_CONIFER"]: 33333.34,
            },
          });
          expectNewCurrentStep(initialRootState, newState, "SOILS_SUMMARY");
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

        const initialRootState = store.getState();

        store.dispatch(completeSoilsSurfaceAreaDistributionEntryMode("square_meters"));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          soilsDistributionEntryMode: "square_meters",
        });
        expectNewCurrentStep(initialRootState, newState, "SOILS_SURFACE_AREAS_DISTRIBUTION");
      });
      describe("revert", () => {
        it("goes to previous step and unset soils distribution entry mode and surface areas", () => {
          const store = initStoreWithState({
            stepsHistory: [
              "IS_FRICHE",
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
          const initialRootState = store.getState();

          store.dispatch(revertSoilsSurfaceAreaDistributionEntryModeStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            soilsDistribution: undefined,
            soilsDistributionEntryMode: undefined,
          });
          expectStepReverted(initialRootState, newState);
        });
      });
    });
    describe("SOILS_SURFACE_AREAS_DISTRIBUTION", () => {
      describe("complete", () => {
        it("goes to SOILS_SUMMARY step and sets soils distribution when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["SOILS_SURFACE_AREAS_DISTRIBUTION"] });
          const initialRootState = store.getState();

          store.dispatch(
            completeSoilsDistribution({ distribution: siteWithExhaustiveData.soilsDistribution }),
          );

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            soilsDistribution: siteWithExhaustiveData.soilsDistribution,
          });
          expectNewCurrentStep(initialRootState, newState, "SOILS_SUMMARY");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset soils distribution surface areas", () => {
          const store = initStoreWithState({
            stepsHistory: [
              "IS_FRICHE",
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
          const initialRootState = store.getState();

          store.dispatch(revertSoilsDistributionStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { soilsDistribution: undefined });
          expectStepReverted(initialRootState, newState);
        });
      });
    });
    describe("SOILS_SUMMARY", () => {
      describe("complete", () => {
        it("goes to SOILS_CARBON_STORAGE step when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["SOILS_SUMMARY"] });
          const initialRootState = store.getState();

          store.dispatch(completeSoilsSummary());

          const newState = store.getState();
          expectSiteDataUnchanged(initialRootState, newState);
          expectNewCurrentStep(initialRootState, newState, "SOILS_CARBON_STORAGE");
        });
      });
    });
    describe("SOILS_CARBON_STORAGE", () => {
      describe("complete", () => {
        it("goes to SOILS_CONTAMINATION_INTRODUCTION step when step is completed and site is a friche", () => {
          const store = initStoreWithState({
            stepsHistory: ["SOILS_CARBON_STORAGE"],
            siteData: { isFriche: true },
          });
          const initialRootState = store.getState();

          store.dispatch(completeSoilsCarbonStorage());

          const newState = store.getState();
          expectSiteDataUnchanged(initialRootState, newState);
          expectNewCurrentStep(initialRootState, newState, "SOILS_CONTAMINATION_INTRODUCTION");
        });
        it("goes to MANAGEMENT_INTRODUCTION step when step is completed and site is not a friche", () => {
          const store = initStoreWithState({
            stepsHistory: ["SOILS_CARBON_STORAGE"],
            siteData: { isFriche: false },
          });
          const initialRootState = store.getState();

          store.dispatch(completeSoilsCarbonStorage());

          const newState = store.getState();
          expectSiteDataUnchanged(initialRootState, newState);
          expectNewCurrentStep(initialRootState, newState, "MANAGEMENT_INTRODUCTION");
        });
      });
    });
    describe("SOILS_CONTAMINATION_INTRODUCTION", () => {
      describe("complete", () => {
        it("goes to SOILS_CONTAMINATION step when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["SOILS_CONTAMINATION_INTRODUCTION"] });
          const initialRootState = store.getState();

          store.dispatch(completeSoilsContaminationIntroductionStep());

          const newState = store.getState();
          expectSiteDataUnchanged(initialRootState, newState);
          expectNewCurrentStep(initialRootState, newState, "SOILS_CONTAMINATION");
        });
      });
    });
    describe("SOILS_CONTAMINATION", () => {
      describe("complete", () => {
        it("goes to FRICHE_ACCIDENTS_INTRODUCTION step and sets contamination data when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["SOILS_CONTAMINATION"] });
          const initialRootState = store.getState();

          store.dispatch(
            completeSoilsContamination({
              hasContaminatedSoils: true,
              contaminatedSoilSurface: 2500,
            }),
          );

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            hasContaminatedSoils: true,
            contaminatedSoilSurface: 2500,
          });
          expectNewCurrentStep(initialRootState, newState, "FRICHE_ACCIDENTS_INTRODUCTION");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset soils contamination", () => {
          const store = initStoreWithState({
            stepsHistory: [
              "IS_FRICHE",
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
          const initialRootState = store.getState();

          store.dispatch(revertSoilsContaminationStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            hasContaminatedSoils: undefined,
            contaminatedSoilSurface: undefined,
          });
          expectStepReverted(initialRootState, newState);
        });
      });
    });
    describe("FRICHE_ACCIDENTS_INTRODUCTION", () => {
      describe("complete", () => {
        it("goes to FRICHE_ACCIDENTS step when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["FRICHE_ACCIDENTS_INTRODUCTION"] });
          const initialRootState = store.getState();

          store.dispatch(completeFricheAccidentsIntroduction());

          const newState = store.getState();
          expectSiteDataUnchanged(initialRootState, newState);
          expectNewCurrentStep(initialRootState, newState, "FRICHE_ACCIDENTS");
        });
      });
    });
    describe("FRICHE_ACCIDENTS", () => {
      describe("complete", () => {
        it("goes to MANAGEMENT_INTRODUCTION step and sets accidents data when step is completed and friche has accidents", () => {
          const store = initStoreWithState({ stepsHistory: ["FRICHE_ACCIDENTS"] });
          const initialRootState = store.getState();

          store.dispatch(
            completeFricheAccidents({
              hasRecentAccidents: true,
              accidentsDeaths: 1,
              accidentsSevereInjuries: 2,
              accidentsMinorInjuries: 3,
            }),
          );

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            hasRecentAccidents: true,
            accidentsDeaths: 1,
            accidentsSevereInjuries: 2,
            accidentsMinorInjuries: 3,
          });
          expectNewCurrentStep(initialRootState, newState, "MANAGEMENT_INTRODUCTION");
        });
        it("goes to MANAGEMENT_INTRODUCTION step and sets accidents data when step is completed and friche has no accident", () => {
          const store = initStoreWithState({ stepsHistory: ["FRICHE_ACCIDENTS"] });
          const initialRootState = store.getState();

          store.dispatch(completeFricheAccidents({ hasRecentAccidents: false }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { hasRecentAccidents: false });
          expectNewCurrentStep(initialRootState, newState, "MANAGEMENT_INTRODUCTION");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset friche accidents", () => {
          const store = initStoreWithState({
            stepsHistory: ["IS_FRICHE", "ADDRESS", "FRICHE_ACCIDENTS"],
            siteData: {
              isFriche: true,
              hasRecentAccidents: true,
              accidentsDeaths: 1,
              accidentsSevereInjuries: 2,
              accidentsMinorInjuries: 0,
            },
          });
          const initialRootState = store.getState();

          store.dispatch(revertFricheAccidentsStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            hasRecentAccidents: undefined,
            accidentsDeaths: undefined,
            accidentsSevereInjuries: undefined,
            accidentsMinorInjuries: undefined,
          });
          expectStepReverted(initialRootState, newState);
        });
      });
    });
    describe("MANAGEMENT_INTRODUCTION", () => {
      describe("complete", () => {
        it("goes to OWNER step when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["MANAGEMENT_INTRODUCTION"] });
          const initialRootState = store.getState();

          store.dispatch(completeManagementIntroduction());

          const newState = store.getState();
          expectSiteDataUnchanged(initialRootState, newState);
          expectNewCurrentStep(initialRootState, newState, "OWNER");
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
          const initialRootState = store.getState();

          store.dispatch(completeOwner({ owner: siteWithExhaustiveData.owner }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { owner: siteWithExhaustiveData.owner });
          expectNewCurrentStep(initialRootState, newState, "IS_FRICHE_LEASED");
        });
        it("goes to IS_SITE_OPERATED step and sets owner when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["OWNER"] });
          const initialRootState = store.getState();

          store.dispatch(completeOwner({ owner: siteWithExhaustiveData.owner }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { owner: siteWithExhaustiveData.owner });
          expectNewCurrentStep(initialRootState, newState, "IS_SITE_OPERATED");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset owner", () => {
          const store = initStoreWithState({
            stepsHistory: ["IS_FRICHE", "ADDRESS", "OWNER"],
            siteData: {
              isFriche: true,
              owner: siteWithExhaustiveData.owner,
            },
          });
          const initialRootState = store.getState();

          store.dispatch(revertOwnerStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { owner: undefined });
          expectStepReverted(initialRootState, newState);
        });
      });
    });
    describe("IS_FRICHE_LEASED", () => {
      describe("complete", () => {
        it("goes to TENANT step and sets isFricheLeased when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["IS_FRICHE_LEASED"] });
          const initialRootState = store.getState();

          store.dispatch(completeIsFricheLeased({ isFricheLeased: true }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { isFricheLeased: true });
          expectNewCurrentStep(initialRootState, newState, "TENANT");
        });
        it("goes to YEARLY_EXPENSES step when step is completed and not leased", () => {
          const store = initStoreWithState({ stepsHistory: ["IS_FRICHE_LEASED"] });
          const initialRootState = store.getState();

          store.dispatch(completeIsFricheLeased({ isFricheLeased: false }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { isFricheLeased: false });
          expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset isFricheLeased", () => {
          const store = initStoreWithState({
            stepsHistory: ["IS_FRICHE", "ADDRESS", "OWNER", "IS_FRICHE_LEASED"],
            siteData: {
              isFriche: true,
              tenant: siteWithExhaustiveData.tenant,
            },
          });
          const initialRootState = store.getState();

          store.dispatch(revertIsFricheLeasedStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            isFricheLeased: undefined,
          });
          expectStepReverted(initialRootState, newState);
        });
      });
    });
    describe("IS_SITE_OPERATED", () => {
      describe("complete", () => {
        it("goes to OPERATOR step and sets isSiteOperated when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["IS_SITE_OPERATED"] });
          const initialRootState = store.getState();

          store.dispatch(completeIsSiteOperated({ isSiteOperated: true }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { isSiteOperated: true });
          expectNewCurrentStep(initialRootState, newState, "OPERATOR");
        });
        it("goes to YEARLY_EXPENSES step when step is completed and no tenant", () => {
          const store = initStoreWithState({ stepsHistory: ["IS_SITE_OPERATED"] });
          const initialRootState = store.getState();

          store.dispatch(completeIsSiteOperated({ isSiteOperated: false }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            isSiteOperated: false,
          });
          expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset isSiteOperated", () => {
          const store = initStoreWithState({
            stepsHistory: ["IS_FRICHE", "ADDRESS", "OWNER", "IS_SITE_OPERATED"],
            siteData: {
              tenant: siteWithExhaustiveData.tenant,
            },
          });
          const initialRootState = store.getState();

          store.dispatch(revertIsSiteOperatedStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            isSiteOperated: undefined,
          });
          expectStepReverted(initialRootState, newState);
        });
      });
    });
    describe("OPERATOR", () => {
      describe("complete", () => {
        it("goes to YEARLY_EXPENSES step and sets tenant when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["OPERATOR"] });
          const initialRootState = store.getState();

          store.dispatch(completeOperator({ tenant: siteWithExhaustiveData.tenant }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { tenant: siteWithExhaustiveData.tenant });
          expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
        });
        it("goes to YEARLY_EXPENSES step when step is completed with tenant", () => {
          const store = initStoreWithState({ stepsHistory: ["OPERATOR"] });
          const initialRootState = store.getState();

          store.dispatch(completeOperator({ tenant: undefined }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { tenant: undefined });
          expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset tenant", () => {
          const store = initStoreWithState({
            stepsHistory: ["IS_FRICHE", "ADDRESS", "OWNER", "IS_SITE_OPERATED", "OPERATOR"],
            siteData: {
              tenant: siteWithExhaustiveData.tenant,
            },
          });
          const initialRootState = store.getState();

          store.dispatch(revertOperatorStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            tenant: undefined,
          });
          expectStepReverted(initialRootState, newState);
        });
      });
    });

    describe("TENANT", () => {
      describe("complete", () => {
        it("goes to YEARLY_EXPENSES step and sets tenant when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["TENANT"] });
          const initialRootState = store.getState();

          store.dispatch(completeTenant({ tenant: siteWithExhaustiveData.tenant }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { tenant: siteWithExhaustiveData.tenant });
          expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
        });
        it("goes to YEARLY_EXPENSES step when step is completed and no tenant", () => {
          const store = initStoreWithState({ stepsHistory: ["TENANT"] });
          const initialRootState = store.getState();

          store.dispatch(completeTenant({ tenant: undefined }));

          const newState = store.getState();
          expectSiteDataUnchanged(initialRootState, newState);
          expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset tenant", () => {
          const store = initStoreWithState({
            stepsHistory: ["IS_FRICHE", "ADDRESS", "OWNER", "TENANT"],
            siteData: {
              isFriche: true,
              tenant: siteWithExhaustiveData.tenant,
            },
          });
          const initialRootState = store.getState();

          store.dispatch(revertTenantStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            tenant: undefined,
          });
          expectStepReverted(initialRootState, newState);
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
          const initialRootState = store.getState();

          store.dispatch(completeYearlyExpenses(siteWithExhaustiveData.yearlyExpenses));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            yearlyExpenses: siteWithExhaustiveData.yearlyExpenses,
          });
          expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES_SUMMARY");
        });
        it("goes to YEARLY_INCOME step if site is worked and sets yearly expenses when step is completed", () => {
          const store = initStoreWithState({
            stepsHistory: ["YEARLY_EXPENSES"],
            siteData: { isSiteOperated: true },
          });
          const initialRootState = store.getState();

          store.dispatch(completeYearlyExpenses(siteWithExhaustiveData.yearlyExpenses));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            yearlyExpenses: siteWithExhaustiveData.yearlyExpenses,
          });
          expectNewCurrentStep(initialRootState, newState, "YEARLY_INCOME");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset yearly expenses", () => {
          const store = initStoreWithState({
            stepsHistory: ["IS_FRICHE", "ADDRESS", "YEARLY_EXPENSES"],
            siteData: { isFriche: true, yearlyExpenses: siteWithExhaustiveData.yearlyExpenses },
          });
          const initialRootState = store.getState();

          store.dispatch(revertYearlyExpensesStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            yearlyExpenses: [],
          });
          expectStepReverted(initialRootState, newState);
        });
      });
    });
    describe("YEARLY_EXPENSES_SUMMARY", () => {
      describe("complete", () => {
        it("goes to NAMING_INTRODUCTION step when step is completed and site is a friche", () => {
          const store = initStoreWithState({
            stepsHistory: ["YEARLY_EXPENSES_SUMMARY"],
            siteData: { isFriche: true },
          });
          const initialRootState = store.getState();

          store.dispatch(completeYearlyExpensesSummary());

          const newState = store.getState();
          expectSiteDataUnchanged(initialRootState, newState);
          expectNewCurrentStep(initialRootState, newState, "NAMING_INTRODUCTION");
        });
      });
    });
    describe("YEARLY_INCOME", () => {
      it("goes to YEARLY_EXPENSES_SUMMARY step and sets yearly income when step is completed", () => {
        const store = initStoreWithState({ stepsHistory: ["YEARLY_INCOME"] });
        const initialRootState = store.getState();

        store.dispatch(completeYearlyIncome(siteWithExhaustiveData.yearlyIncomes));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          yearlyIncomes: siteWithExhaustiveData.yearlyIncomes,
        });
        expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES_SUMMARY");
      });
      describe("revert", () => {
        it("goes to previous step and unset yearly income", () => {
          const store = initStoreWithState({
            stepsHistory: ["IS_FRICHE", "ADDRESS", "YEARLY_INCOME"],
            siteData: { isFriche: true, yearlyIncomes: siteWithExhaustiveData.yearlyIncomes },
          });
          const initialRootState = store.getState();

          store.dispatch(revertYearlyIncomeStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            yearlyIncomes: [],
          });
          expectStepReverted(initialRootState, newState);
        });
      });
    });
    describe("NAMING_INTRODUCTION", () => {
      describe("complete", () => {
        it("goes to NAMING step when completed", () => {
          const store = initStoreWithState({ stepsHistory: ["NAMING_INTRODUCTION"] });
          const initialRootState = store.getState();

          store.dispatch(namingIntroductionStepCompleted());

          const newState = store.getState();
          expectSiteDataUnchanged(initialRootState, newState);
          expectNewCurrentStep(initialRootState, newState, "NAMING");
        });
      });
    });
    describe("NAMING", () => {
      describe("complete", () => {
        it("goes to FINAL_SUMMARY step and sets name and description when step is completed", () => {
          const store = initStoreWithState({ stepsHistory: ["NAMING"] });
          const initialRootState = store.getState();

          const { name, description } = siteWithExhaustiveData;
          store.dispatch(completeNaming({ name, description }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            name,
            description,
          });
          expectNewCurrentStep(initialRootState, newState, "FINAL_SUMMARY");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset naming", () => {
          const store = initStoreWithState({
            stepsHistory: ["IS_FRICHE", "ADDRESS", "NAMING"],
            siteData: { isFriche: true, name: "site 1", description: "blabla" },
          });
          const initialRootState = store.getState();

          store.dispatch(revertNamingStep());

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            name: undefined,
            description: undefined,
          });
          expectStepReverted(initialRootState, newState);
        });
      });
    });
  });
});
