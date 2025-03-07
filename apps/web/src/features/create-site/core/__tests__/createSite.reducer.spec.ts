import {
  agriculturalOperationActivityReverted,
  isFricheReverted,
  naturalAreaTypeReverted,
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
  siteNatureReverted,
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
  namingIntroductionStepCompleted,
  isFricheCompleted,
  introductionStepCompleted,
  createModeSelectionCompleted,
  siteNatureCompleted,
  agriculturalOperationActivityCompleted,
  naturalAreaTypeCompleted,
} from "../createSite.reducer";
import { siteWithExhaustiveData } from "../siteData.mock";
import {
  expectNewCurrentStep,
  expectSiteDataDiff,
  expectSiteDataUnchanged,
  expectStepReverted,
  StoreBuilder,
} from "./testUtils";

describe("Create site reducer", () => {
  describe("Data creation steps", () => {
    describe("INTRODUCTION", () => {
      it("goes to IS_FRICHE step when step completed", () => {
        const store = new StoreBuilder().withStepsHistory(["INTRODUCTION"]).build();
        const initialRootState = store.getState();

        store.dispatch(introductionStepCompleted());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "IS_FRICHE");
      });
    });
    describe("IS_FRICHE", () => {
      it("goes to SITE_NATURE step when step is completed and site is not a friche", () => {
        const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "IS_FRICHE"]).build();
        const initialRootState = store.getState();

        store.dispatch(isFricheCompleted({ isFriche: false }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { isFriche: false });
        expectNewCurrentStep(initialRootState, newState, "SITE_NATURE");
      });
      it("goes to CREATE_MODE_SELECTION step and sets site nature to friche when step is completed and site is a friche", () => {
        const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "IS_FRICHE"]).build();
        const initialRootState = store.getState();

        store.dispatch(isFricheCompleted({ isFriche: true }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { isFriche: true, nature: "FRICHE" });
        expectNewCurrentStep(initialRootState, newState, "CREATE_MODE_SELECTION");
      });
      it("goes to previous step and unsets isFriche when step is reverted", () => {
        const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "IS_FRICHE"]).build();
        const initialRootState = store.getState();

        store.dispatch(isFricheReverted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { isFriche: undefined });
        expectStepReverted(initialRootState, newState);
      });
    });
    describe("SITE_NATURE", () => {
      it("goes to CREATE_MODE_SELECTION step when completed", () => {
        const store = new StoreBuilder().withStepsHistory(["SITE_NATURE"]).build();
        const initialRootState = store.getState();

        store.dispatch(siteNatureCompleted({ nature: "AGRICULTURAL_OPERATION" }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { nature: "AGRICULTURAL_OPERATION" });
        expectNewCurrentStep(initialRootState, newState, "CREATE_MODE_SELECTION");
      });
      it("goes to previous step and unsets site nature when step is reverted", () => {
        const store = new StoreBuilder()
          .withCreationData({
            nature: "NATURAL_AREA",
          })
          .withStepsHistory(["IS_FRICHE", "SITE_NATURE"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(siteNatureReverted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { nature: undefined });
        expectStepReverted(initialRootState, newState);
      });
    });
    describe("CREATE_MODE_SELECTION", () => {
      it("goes to FRICHE_ACTIVITY step when 'custom' mode is selected and site is a friche", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["INTRODUCTION", "CREATE_MODE_SELECTION"])
          .withCreationData({
            isFriche: true,
            nature: "FRICHE",
          })
          .build();

        const initialRootState = store.getState();

        store.dispatch(createModeSelectionCompleted({ createMode: "custom" }));

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "FRICHE_ACTIVITY");
      });
      it("goes to ADDRESS step when 'custom' mode is selected and site is NOT a friche", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["INTRODUCTION", "CREATE_MODE_SELECTION"])
          .withCreationData({
            isFriche: false,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(createModeSelectionCompleted({ createMode: "custom" }));

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "ADDRESS");
      });
      it("goes to AGRICULTURAL_OPERATION_ACTIVITY step when 'express' mode is selected and site is agricultural operation", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["INTRODUCTION", "CREATE_MODE_SELECTION"])
          .withCreationData({
            isFriche: false,
            nature: "AGRICULTURAL_OPERATION",
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(createModeSelectionCompleted({ createMode: "express" }));

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "AGRICULTURAL_OPERATION_ACTIVITY");
      });
      it("goes to NATURAL_AREA_TYPE step when 'express' mode is selected and site is natural area", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["INTRODUCTION", "CREATE_MODE_SELECTION"])
          .withCreationData({
            isFriche: false,
            nature: "NATURAL_AREA",
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(createModeSelectionCompleted({ createMode: "express" }));

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "NATURAL_AREA_TYPE");
      });
      it("goes to ADDRESS step when 'express' mode is selected and site is FRICHE or NATURAL_AREA", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["INTRODUCTION", "CREATE_MODE_SELECTION"])
          .withCreationData({ nature: "FRICHE", isFriche: true })
          .build();
        const initialRootState = store.getState();

        store.dispatch(createModeSelectionCompleted({ createMode: "express" }));

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "ADDRESS");
      });
    });
    describe("AGRICULTURAL_OPERATION_ACTIVITY", () => {
      it("goes to ADDRESS step when completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["AGRICULTURAL_OPERATION_ACTIVITY"])
          .withCreationData({
            isFriche: false,
            nature: "AGRICULTURAL_OPERATION",
          })
          .build();

        const initialRootState = store.getState();

        store.dispatch(
          agriculturalOperationActivityCompleted({ activity: "LARGE_VEGETABLE_CULTIVATION" }),
        );

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "ADDRESS");
        expectSiteDataDiff(initialRootState, newState, {
          agriculturalOperationActivity: "LARGE_VEGETABLE_CULTIVATION",
        });
      });
      it("goes to previous step and unsets agricultural operation activity when reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["CREATE_MODE_SELECTION", "AGRICULTURAL_OPERATION_ACTIVITY"])
          .withCreationData({
            isFriche: false,
            nature: "AGRICULTURAL_OPERATION",
            agriculturalOperationActivity: "CATTLE_FARMING",
          })
          .build();

        const initialRootState = store.getState();

        store.dispatch(agriculturalOperationActivityReverted());

        const newState = store.getState();
        expectStepReverted(initialRootState, newState);
        expectSiteDataDiff(initialRootState, newState, {
          agriculturalOperationActivity: undefined,
        });
      });
    });
    describe("NATURAL_AREA_TYPE", () => {
      it("goes to ADDRESS step when completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["NATURAL_AREA_TYPE"])
          .withCreationData({
            isFriche: false,
            nature: "NATURAL_AREA",
          })
          .build();

        const initialRootState = store.getState();

        store.dispatch(naturalAreaTypeCompleted({ naturalAreaType: "PRAIRIE" }));

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "ADDRESS");
        expectSiteDataDiff(initialRootState, newState, {
          naturalAreaType: "PRAIRIE",
        });
      });
      it("goes to previous step and unsets agricultural operation activity when reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["CREATE_MODE_SELECTION", "NATURAL_AREA_TYPE"])
          .withCreationData({
            isFriche: false,
            nature: "AGRICULTURAL_OPERATION",
            naturalAreaType: "PRAIRIE",
          })
          .build();

        const initialRootState = store.getState();

        store.dispatch(naturalAreaTypeReverted());

        const newState = store.getState();
        expectStepReverted(initialRootState, newState);
        expectSiteDataDiff(initialRootState, newState, {
          naturalAreaType: undefined,
        });
      });
    });
    describe("FRICHE_ACTIVITY", () => {
      describe("complete", () => {
        it("goes to ADDRESS step and sets friche activity when step is completed", () => {
          const store = new StoreBuilder().withStepsHistory(["FRICHE_ACTIVITY"]).build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["IS_FRICHE", "FRICHE_ACTIVITY"])
            .withCreationData({
              isFriche: true,
              fricheActivity: "BUILDING",
            })
            .build();
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
          const store = new StoreBuilder().withStepsHistory(["ADDRESS"]).build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["IS_FRICHE", "ADDRESS"])
            .withCreationData({ isFriche: true, address: siteWithExhaustiveData.address })
            .build();
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
          const store = new StoreBuilder().withStepsHistory(["SOILS_INTRODUCTION"]).build();
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
            const store = new StoreBuilder()
              .withCreateMode("custom")
              .withStepsHistory(["SURFACE_AREA"])
              .build();
            const initialRootState = store.getState();

            store.dispatch(completeSiteSurfaceArea({ surfaceArea: 143000 }));

            const newState = store.getState();
            expectSiteDataDiff(initialRootState, newState, { surfaceArea: 143000 });
            expectNewCurrentStep(initialRootState, newState, "SOILS_SELECTION");
          });
          describe("revert", () => {
            it("goes to previous step and unset surface area", () => {
              const store = new StoreBuilder()
                .withStepsHistory(["IS_FRICHE", "ADDRESS", "SOILS_SELECTION"])
                .withCreationData({ isFriche: true, surfaceArea: 12000 })
                .build();
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
            const store = new StoreBuilder()
              .withStepsHistory(["SURFACE_AREA"])
              .withCreateMode("express")
              .build();
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
          const store = new StoreBuilder().withStepsHistory(["SOILS_SELECTION"]).build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["IS_FRICHE", "ADDRESS", "SOILS_SELECTION"])
            .withCreationData({ isFriche: true, soils: siteWithExhaustiveData.soils })
            .build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE"])
            .withCreationData({
              surfaceArea: 100000,
              soils: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "BUILDINGS", "FOREST_CONIFER"],
            })
            .build();

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
        const store = new StoreBuilder()
          .withStepsHistory(["SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE"])
          .withCreationData({
            surfaceArea: 100000,
            soils: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "BUILDINGS", "FOREST_CONIFER"],
          })
          .build();

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
          const store = new StoreBuilder()
            .withStepsHistory([
              "IS_FRICHE",
              "ADDRESS",
              "SOILS_SELECTION",
              "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
            ])
            .withCreationData({
              isFriche: true,
              soils: siteWithExhaustiveData.soils,
              soilsDistribution: siteWithExhaustiveData.soilsDistribution,
              soilsDistributionEntryMode: siteWithExhaustiveData.soilsDistributionEntryMode,
            })
            .build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["SOILS_SURFACE_AREAS_DISTRIBUTION"])
            .build();
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
          const store = new StoreBuilder()
            .withStepsHistory([
              "IS_FRICHE",
              "ADDRESS",
              "SOILS_SELECTION",
              "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
              "SOILS_SURFACE_AREAS_DISTRIBUTION",
            ])
            .withCreationData({
              isFriche: true,
              soils: siteWithExhaustiveData.soils,
              soilsDistribution: siteWithExhaustiveData.soilsDistribution,
            })
            .build();
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
          const store = new StoreBuilder().withStepsHistory(["SOILS_SUMMARY"]).build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["SOILS_CARBON_STORAGE"])
            .withCreationData({ isFriche: true })
            .build();
          const initialRootState = store.getState();

          store.dispatch(completeSoilsCarbonStorage());

          const newState = store.getState();
          expectSiteDataUnchanged(initialRootState, newState);
          expectNewCurrentStep(initialRootState, newState, "SOILS_CONTAMINATION_INTRODUCTION");
        });
        it("goes to MANAGEMENT_INTRODUCTION step when step is completed and site is not a friche", () => {
          const store = new StoreBuilder()
            .withStepsHistory(["SOILS_CARBON_STORAGE"])
            .withCreationData({ isFriche: false })
            .build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["SOILS_CONTAMINATION_INTRODUCTION"])
            .build();
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
          const store = new StoreBuilder().withStepsHistory(["SOILS_CONTAMINATION"]).build();
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
          const store = new StoreBuilder()
            .withStepsHistory([
              "IS_FRICHE",
              "ADDRESS",
              "SOILS_SELECTION",
              "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
              "SOILS_SURFACE_AREAS_DISTRIBUTION",
              "SOILS_CONTAMINATION",
            ])
            .withCreationData({
              isFriche: true,
              soils: siteWithExhaustiveData.soils,
              hasContaminatedSoils: true,
              contaminatedSoilSurface: 12000,
            })
            .build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["FRICHE_ACCIDENTS_INTRODUCTION"])
            .build();
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
          const store = new StoreBuilder().withStepsHistory(["FRICHE_ACCIDENTS"]).build();
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
          const store = new StoreBuilder().withStepsHistory(["FRICHE_ACCIDENTS"]).build();
          const initialRootState = store.getState();

          store.dispatch(completeFricheAccidents({ hasRecentAccidents: false }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { hasRecentAccidents: false });
          expectNewCurrentStep(initialRootState, newState, "MANAGEMENT_INTRODUCTION");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset friche accidents", () => {
          const store = new StoreBuilder()
            .withStepsHistory(["IS_FRICHE", "ADDRESS", "FRICHE_ACCIDENTS"])
            .withCreationData({
              isFriche: true,
              hasRecentAccidents: true,
              accidentsDeaths: 1,
              accidentsSevereInjuries: 2,
              accidentsMinorInjuries: 0,
            })
            .build();
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
          const store = new StoreBuilder().withStepsHistory(["MANAGEMENT_INTRODUCTION"]).build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["OWNER"])
            .withCreationData({ isFriche: true })
            .build();
          const initialRootState = store.getState();

          store.dispatch(completeOwner({ owner: siteWithExhaustiveData.owner }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { owner: siteWithExhaustiveData.owner });
          expectNewCurrentStep(initialRootState, newState, "IS_FRICHE_LEASED");
        });
        it("goes to IS_SITE_OPERATED step and sets owner when step is completed", () => {
          const store = new StoreBuilder().withStepsHistory(["OWNER"]).build();
          const initialRootState = store.getState();

          store.dispatch(completeOwner({ owner: siteWithExhaustiveData.owner }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { owner: siteWithExhaustiveData.owner });
          expectNewCurrentStep(initialRootState, newState, "IS_SITE_OPERATED");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset owner", () => {
          const store = new StoreBuilder()
            .withStepsHistory(["IS_FRICHE", "ADDRESS", "OWNER"])
            .withCreationData({
              isFriche: true,
              owner: siteWithExhaustiveData.owner,
            })
            .build();
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
          const store = new StoreBuilder().withStepsHistory(["IS_FRICHE_LEASED"]).build();
          const initialRootState = store.getState();

          store.dispatch(completeIsFricheLeased({ isFricheLeased: true }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { isFricheLeased: true });
          expectNewCurrentStep(initialRootState, newState, "TENANT");
        });
        it("goes to YEARLY_EXPENSES step when step is completed and not leased", () => {
          const store = new StoreBuilder().withStepsHistory(["IS_FRICHE_LEASED"]).build();
          const initialRootState = store.getState();

          store.dispatch(completeIsFricheLeased({ isFricheLeased: false }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { isFricheLeased: false });
          expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset isFricheLeased", () => {
          const store = new StoreBuilder()
            .withStepsHistory(["IS_FRICHE", "ADDRESS", "OWNER", "IS_FRICHE_LEASED"])
            .withCreationData({
              isFriche: true,
              tenant: siteWithExhaustiveData.tenant,
            })
            .build();
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
          const store = new StoreBuilder().withStepsHistory(["IS_SITE_OPERATED"]).build();
          const initialRootState = store.getState();

          store.dispatch(completeIsSiteOperated({ isSiteOperated: true }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { isSiteOperated: true });
          expectNewCurrentStep(initialRootState, newState, "OPERATOR");
        });
        it("goes to YEARLY_EXPENSES step when step is completed and no tenant", () => {
          const store = new StoreBuilder().withStepsHistory(["IS_SITE_OPERATED"]).build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["IS_FRICHE", "ADDRESS", "OWNER", "IS_SITE_OPERATED"])
            .withCreationData({
              tenant: siteWithExhaustiveData.tenant,
            })
            .build();
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
          const store = new StoreBuilder().withStepsHistory(["OPERATOR"]).build();
          const initialRootState = store.getState();

          store.dispatch(completeOperator({ tenant: siteWithExhaustiveData.tenant }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { tenant: siteWithExhaustiveData.tenant });
          expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
        });
        it("goes to YEARLY_EXPENSES step when step is completed with tenant", () => {
          const store = new StoreBuilder().withStepsHistory(["OPERATOR"]).build();
          const initialRootState = store.getState();

          store.dispatch(completeOperator({ tenant: undefined }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { tenant: undefined });
          expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset tenant", () => {
          const store = new StoreBuilder()
            .withStepsHistory(["IS_FRICHE", "ADDRESS", "OWNER", "IS_SITE_OPERATED", "OPERATOR"])
            .withCreationData({
              tenant: siteWithExhaustiveData.tenant,
            })
            .build();
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
          const store = new StoreBuilder().withStepsHistory(["TENANT"]).build();
          const initialRootState = store.getState();

          store.dispatch(completeTenant({ tenant: siteWithExhaustiveData.tenant }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { tenant: siteWithExhaustiveData.tenant });
          expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
        });
        it("goes to YEARLY_EXPENSES step when step is completed and no tenant", () => {
          const store = new StoreBuilder().withStepsHistory(["TENANT"]).build();
          const initialRootState = store.getState();

          store.dispatch(completeTenant({ tenant: undefined }));

          const newState = store.getState();
          expectSiteDataUnchanged(initialRootState, newState);
          expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES");
        });
      });
      describe("revert", () => {
        it("goes to previous step and unset tenant", () => {
          const store = new StoreBuilder()
            .withStepsHistory(["IS_FRICHE", "ADDRESS", "OWNER", "TENANT"])
            .withCreationData({
              isFriche: true,
              tenant: siteWithExhaustiveData.tenant,
            })
            .build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["YEARLY_EXPENSES"])
            .withCreationData({ isFriche: true })
            .build();
          const initialRootState = store.getState();

          store.dispatch(completeYearlyExpenses(siteWithExhaustiveData.yearlyExpenses));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, {
            yearlyExpenses: siteWithExhaustiveData.yearlyExpenses,
          });
          expectNewCurrentStep(initialRootState, newState, "YEARLY_EXPENSES_SUMMARY");
        });
        it("goes to YEARLY_INCOME step if site is worked and sets yearly expenses when step is completed", () => {
          const store = new StoreBuilder()
            .withStepsHistory(["YEARLY_EXPENSES"])
            .withCreationData({ isSiteOperated: true })
            .build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["IS_FRICHE", "ADDRESS", "YEARLY_EXPENSES"])
            .withCreationData({
              isFriche: true,
              yearlyExpenses: siteWithExhaustiveData.yearlyExpenses,
            })
            .build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["YEARLY_EXPENSES_SUMMARY"])
            .withCreationData({ isFriche: true })
            .build();
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
        const store = new StoreBuilder().withStepsHistory(["YEARLY_INCOME"]).build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["IS_FRICHE", "ADDRESS", "YEARLY_INCOME"])
            .withCreationData({
              isFriche: true,
              yearlyIncomes: siteWithExhaustiveData.yearlyIncomes,
            })
            .build();
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
          const store = new StoreBuilder().withStepsHistory(["NAMING_INTRODUCTION"]).build();
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
          const store = new StoreBuilder().withStepsHistory(["NAMING"]).build();
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
          const store = new StoreBuilder()
            .withStepsHistory(["IS_FRICHE", "ADDRESS", "NAMING"])
            .withCreationData({ isFriche: true, name: "site 1", description: "blabla" })
            .build();
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
