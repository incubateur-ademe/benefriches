import { describe, it, expect, beforeEach, vi } from "vitest";

import { creationProjectFormUrbanActions } from "../urbanProject.actions";
import { getCurrentStep, StoreBuilder } from "./_testStoreHelpers";

const mockedEnvVarsModule = vi.hoisted(() => ({
  BENEFRICHES_ENV: {
    urbanProjectBuildingsReuseChapterEnabled: false,
  },
}));

vi.mock("@/app/envVars", () => mockedEnvVarsModule);

const { nextStepRequested, stepCompletionRequested } = creationProjectFormUrbanActions;

describe("urbanProject.reducer - stepCompletionRequested without validation", () => {
  let store: ReturnType<StoreBuilder["build"]>;

  beforeEach(() => {
    store = new StoreBuilder().build();
  });

  describe("Complete workflow from start to finish", () => {
    it("should navigate through all steps correctly", () => {
      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_INTRODUCTION");
      store.dispatch(nextStepRequested());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_SELECTION");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_USES_SELECTION",
          answers: {
            usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES", "OTHER_PUBLIC_SPACES"],
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA",
          answers: {
            publicGreenSpacesSurfaceArea: 3000,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");
      store.dispatch(nextStepRequested());

      // Étape ---- (site has natural soils + PUBLIC_GREEN_SPACES selected)
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION");
      store.dispatch(nextStepRequested());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
          answers: {
            publicGreenSpacesSoilsDistribution: {
              PRAIRIE_GRASS: 1500,
              ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1500,
            },
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SELECTION");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SPACES_SELECTION",
          answers: {
            spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS", "MINERAL_SOIL"],
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SURFACE_AREA");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA",
          answers: {
            spacesSurfaceAreaDistribution: {
              BUILDINGS: 2000,
              IMPERMEABLE_SOILS: 3000,
              MINERAL_SOIL: 2000,
            },
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SOILS_SUMMARY");
      store.dispatch(nextStepRequested());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_CARBON_SUMMARY");
      store.dispatch(nextStepRequested());

      // Étape ---- (willHaveBuildings → buildings intro)
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
      store.dispatch(nextStepRequested());

      // Étape ---- (willHaveBuildings → uses floor surface area)
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: {
            usesFloorSurfaceAreaDistribution: {
              RESIDENTIAL: 2500,
            },
          },
        }),
      );

      // Étape ---- (hasContaminatedSoils → decontamination)
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
      store.dispatch(nextStepRequested());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          answers: {
            decontaminationPlan: "partial",
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
          answers: {
            decontaminatedSurfaceArea: 1500,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
      store.dispatch(nextStepRequested());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_SELECTION");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
          answers: { siteResaleSelection: "yes" },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
          answers: {
            buildingsResalePlannedAfterDevelopment: true,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
      store.dispatch(nextStepRequested());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
          answers: {
            projectDeveloper: {
              name: "Promoteur Test",
              structureType: "company",
            },
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
          answers: {
            developerWillBeBuildingsConstructor: true,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
          answers: {
            reinstatementContractOwner: {
              name: "Entreprise de Remise en État",
              structureType: "company",
            },
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
      store.dispatch(nextStepRequested());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: {
            sitePurchaseSellingPrice: 500000,
            sitePurchasePropertyTransferDuties: 50000,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_REINSTATEMENT");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
          answers: {
            reinstatementExpenses: [
              { purpose: "demolition", amount: 100000 },
              { purpose: "remediation", amount: 200000 },
            ],
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INSTALLATION");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION",
          answers: {
            installationExpenses: [
              { purpose: "development_works", amount: 800000 },
              { purpose: "technical_studies", amount: 50000 },
            ],
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe(
        "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
      );
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
          answers: {
            technicalStudiesAndFees: 30000,
            buildingsConstructionWorks: 400000,
            otherConstructionExpenses: 20000,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
      store.dispatch(nextStepRequested());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
          answers: {
            siteResaleExpectedSellingPrice: 1000000,
            siteResaleExpectedPropertyTransferDuties: 80000,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
          answers: {
            buildingsResaleSellingPrice: 2000000,
            buildingsResalePropertyTransferDuties: 150000,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
          answers: {
            financialAssistanceRevenues: [{ source: "public_subsidies", amount: 200000 }],
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SCHEDULE_PROJECTION");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION",
          answers: {
            reinstatementSchedule: {
              startDate: "2024-01-01",
              endDate: "2024-06-30",
            },
            installationSchedule: {
              startDate: "2024-07-01",
              endDate: "2025-12-31",
            },
            firstYearOfOperation: 2026,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_NAMING");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_NAMING",
          answers: {
            name: "Projet Urbain Test",
            description: "Description du projet de test",
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_FINAL_SUMMARY");
      store.dispatch(nextStepRequested());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_CREATION_RESULT");

      expect(Object.keys(store.getState().projectCreation.urbanProject.steps).length).toEqual(34);
    });

    it('should handle decontamination plan "none" correctly', () => {
      store.dispatch(nextStepRequested()); // → USES_INTRODUCTION
      store.dispatch(nextStepRequested()); // → USES_SELECTION

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_USES_SELECTION",
          answers: {
            usesSelection: ["RESIDENTIAL"],
          },
        }),
      );

      // No PUBLIC_GREEN_SPACES → goes to SPACES_INTRODUCTION
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");
      store.dispatch(nextStepRequested()); // → SPACES_SELECTION (no PUBLIC_GREEN_SPACES)

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SELECTION");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SPACES_SELECTION",
          answers: { spacesSelection: ["BUILDINGS"] },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SURFACE_AREA");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA",
          answers: { spacesSurfaceAreaDistribution: { BUILDINGS: 2000 } },
        }),
      );

      store.dispatch(nextStepRequested()); // soils summary
      store.dispatch(nextStepRequested()); // carbon summary → buildings intro (willHaveBuildings)
      store.dispatch(nextStepRequested()); // buildings intro → uses floor surface area

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 2000 } },
        }),
      );

      // hasContaminatedSoils → decontamination intro
      store.dispatch(nextStepRequested()); // decontamination intro → selection

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION");
      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          answers: {
            decontaminationPlan: "none",
          },
        }),
      );

      const currentState = store.getState().projectCreation;

      // "none" shortcuts past surface area step → goes to site resale
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");

      expect(
        currentState.urbanProject.steps.URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA,
      ).toBeDefined();
      expect(
        currentState.urbanProject.steps.URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA?.payload
          ?.decontaminatedSurfaceArea,
      ).toBe(0);
    });
  });

  describe("stakeholders adjacent navigation", () => {
    beforeEach(() => {
      mockedEnvVarsModule.BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled = true;
    });

    it("routes from project developer to buildings developer when new buildings will be constructed", () => {
      const store = new StoreBuilder()
        .withSiteData({
          nature: "AGRICULTURAL_OPERATION",
        } as never)
        .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER")
        .withSteps({
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: {
                BUILDINGS: 3000,
              },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: {
              buildingsFootprintToReuse: 1000,
            },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
          answers: {
            projectDeveloper: {
              name: "Promoteur Test",
              structureType: "company",
            },
          },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER");
    });
  });

  describe("buildings chapter exit routing", () => {
    beforeEach(() => {
      mockedEnvVarsModule.BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled = true;
    });

    it("routes from the last buildings step to site resale when the site is not contaminated", () => {
      const store = new StoreBuilder()
        .withSiteData({
          hasContaminatedSoils: false,
        } as never)
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA")
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
          },
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: { buildingsFootprintToReuse: 2000 },
          },
          URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
            completed: true,
            payload: {
              existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1600, OFFICES: 400 },
            },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: { newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 800, OFFICES: 200 } },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    });

    it("routes from the last buildings step to decontamination when the site is contaminated", () => {
      const store = new StoreBuilder()
        .withSiteData({
          hasContaminatedSoils: true,
        } as never)
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA")
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
          },
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: { buildingsFootprintToReuse: 1500 },
          },
          URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
            completed: true,
            payload: {
              existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1000, OFFICES: 500 },
            },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: { newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1400, OFFICES: 100 } },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
    });
  });
});
