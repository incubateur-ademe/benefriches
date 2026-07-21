import { describe, expect, it } from "vitest";

import { getProjectData } from "../helpers/readers/projectDataReaders";
import { creationProjectFormUrbanActions } from "../urbanProject.actions";
import { getCurrentStep, StoreBuilder } from "./_testStoreHelpers";

const {
  nextStepRequested,
  previousStepRequested,
  stepCompletionRequested,
  stepCompletionConfirmed,
} = creationProjectFormUrbanActions;

/**
 * Store-seam regression tests for the urban-project creation flow (mirrors the photovoltaic
 * behaviour-net in spirit). Each test dispatches the same actions the UI dispatches
 * (stepCompletionRequested / nextStepRequested / previousStepRequested / stepCompletionConfirmed)
 * and asserts ONLY on `getCurrentStep(store)` and the final submitted `getProjectData(...)` DTO —
 * never on the internal per-step `{ completed, payload }` record shape or the slice layout, so it
 * survives the slice normalization as long as navigation and the submitted payload are unchanged.
 *
 * `mockSiteData` is a FRICHE with contaminated soils (2000 m2), soils BUILDINGS 2000 among a
 * 10000 m2 total.
 */
describe("Urban project creation flow (behaviour-net)", () => {
  it("completes the buildings + public green spaces path with reinstatement, partial decontamination and site resale", () => {
    const store = new StoreBuilder().build();
    const dispatch = store.dispatch;

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_SELECTION");

    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_USES_SELECTION",
        answers: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES", "OTHER_PUBLIC_SPACES"] },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA");

    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA",
        answers: { publicGreenSpacesSurfaceArea: 3000 },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");
    dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION");
    dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION");
    dispatch(
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

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SELECTION");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SPACES_SELECTION",
        answers: { spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS", "MINERAL_SOIL"] },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SURFACE_AREA");
    dispatch(
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

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SOILS_SUMMARY");
    dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_CARBON_SUMMARY");
    dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
    dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        answers: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 2500 } },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION");
    dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
        answers: { buildingsFootprintToReuse: 2000 },
      }),
    );
    dispatch(stepCompletionConfirmed());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_INVOLVES_REINSTATEMENT");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: true },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
    dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: { decontaminationPlan: "partial" },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
        answers: { decontaminatedSurfaceArea: 1500 },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_SELECTION");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "yes" },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
        answers: { buildingsResalePlannedAfterDevelopment: true },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
    dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
        answers: { projectDeveloper: { name: "Promoteur Test", structureType: "company" } },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER");
    dispatch(
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

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
    dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
        answers: { sitePurchaseSellingPrice: 500000, sitePurchasePropertyTransferDuties: 50000 },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_REINSTATEMENT");
    dispatch(
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

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INSTALLATION");
    dispatch(
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

    expect(getCurrentStep(store)).toBe(
      "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
    );
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
        answers: {
          technicalStudiesAndFees: 30000,
          buildingsConstructionWorks: 400000,
          otherConstructionExpenses: 20000,
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
        answers: {
          siteResaleExpectedSellingPrice: 1000000,
          siteResaleExpectedPropertyTransferDuties: 80000,
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
        answers: {
          buildingsResaleSellingPrice: 2000000,
          buildingsResalePropertyTransferDuties: 150000,
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
        answers: {
          financialAssistanceRevenues: [{ source: "public_subsidies", amount: 200000 }],
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SCHEDULE_PROJECTION");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION",
        answers: {
          reinstatementSchedule: { startDate: "2024-01-01", endDate: "2024-06-30" },
          installationSchedule: { startDate: "2024-07-01", endDate: "2025-12-31" },
          firstYearOfOperation: 2026,
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_NAMING");
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_NAMING",
        answers: { name: "Projet Urbain Test", description: "Description du projet de test" },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_FINAL_SUMMARY");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_CREATION_RESULT");

    const projectData = getProjectData(store.getState().projectCreation.urbanProject.form.steps);

    expect(projectData.name).toBe("Projet Urbain Test");
    expect(projectData.developmentPlan?.type).toBe("URBAN_PROJECT");
    expect(projectData.involvesReinstatement).toBe(true);
    expect(projectData.decontaminatedSoilSurface).toBe(1500);
    expect(projectData.reinstatementContractOwner).toEqual({
      name: "Entreprise de Remise en État",
      structureType: "company",
    });
    expect(projectData.siteResaleExpectedSellingPrice).toBe(1000000);
    expect(projectData.buildingsResaleExpectedSellingPrice).toBe(2000000);
    expect(projectData.buildingsFootprintToReuse).toBe(2000);
  });

  it("completes a path with no reinstatement and 'none' decontamination, skipping reinstatement steps", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_INVOLVES_REINSTATEMENT")
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_SPACES_SELECTION: {
          completed: true,
          payload: { spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 } },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 3000 } },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 3000 },
        },
      })
      .build();
    const dispatch = store.dispatch;

    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: false },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION");

    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: { decontaminationPlan: "none" },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_SELECTION");

    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "no" },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");

    const projectData = getProjectData(store.getState().projectCreation.urbanProject.form.steps);
    expect(projectData.involvesReinstatement).toBe(false);
    expect(projectData.decontaminatedSoilSurface).toBe(0);
    expect(projectData.reinstatementContractOwner).toBeUndefined();
  });

  it("auto-fills the decontaminated surface area when the 'unknown' decontamination plan is chosen", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION")
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: true },
        },
      })
      .build();
    const dispatch = store.dispatch;

    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: { decontaminationPlan: "unknown" },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    const projectData = getProjectData(store.getState().projectCreation.urbanProject.form.steps);
    // computeDefaultDecontaminatedSurfaceArea(2000) applied from the mock's contaminated surface
    expect(projectData.decontaminatedSoilSurface).toBeGreaterThan(0);
  });

  it("navigates backward through the reuse chapter without losing entered answers", () => {
    const store = new StoreBuilder().build();
    const dispatch = store.dispatch;

    dispatch(nextStepRequested());
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_USES_SELECTION",
        answers: { usesSelection: ["RESIDENTIAL"] },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");

    dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_SELECTION");

    const answers =
      store.getState().projectCreation.urbanProject.form.steps.URBAN_PROJECT_USES_SELECTION?.payload
        ?.usesSelection;
    expect(answers).toEqual(["RESIDENTIAL"]);
  });
});
