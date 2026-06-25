import { describe, expect, it } from "vitest";

import { UrbanProjectScheduleProjectionHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/schedule/schedule-projection/scheduleProjection.handler";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Involves reinstatement", () => {
  it("should navigate to SOILS_DECONTAMINATION_INTRODUCTION when involvesReinstatement is true", () => {
    const store = new StoreBuilder().build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: true },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
  });

  it("should navigate to SITE_RESALE_INTRODUCTION when involvesReinstatement is false", () => {
    const store = new StoreBuilder().build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: false },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
  });

  it("should delete reinstatement-related steps when switching from true to false", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: true },
        },
        URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
          completed: true,
          payload: { decontaminationPlan: "partial" },
        },
        URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
          completed: true,
          payload: { decontaminatedSurfaceArea: 500 },
        },
        URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: {
          completed: true,
          payload: {
            reinstatementContractOwner: { name: "Test", structureType: "company" },
          },
        },
        URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
          completed: true,
          payload: { reinstatementExpenses: [{ purpose: "remediation", amount: 10000 }] },
        },
      })
      .build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: false },
      }),
    );
    store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

    const steps = store.getState().projectCreation.urbanProject.steps;

    expect(steps.URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION).toBeUndefined();
    expect(steps.URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA).toBeUndefined();
    expect(steps.URBAN_PROJECT_EXPENSES_REINSTATEMENT).toBeUndefined();
    expect(steps.URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
  });

  it("should compute installationSchedule without reinstatement when involvesReinstatement is false on a FRICHE", () => {
    const defaults = UrbanProjectScheduleProjectionHandler.getDefaultAnswers({
      stepsState: {
        URBAN_PROJECT_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: false },
        },
      },
      siteData: { nature: "FRICHE" } as never,
    });

    expect(defaults?.reinstatementSchedule).toBeUndefined();

    // When involvesReinstatement is false on a FRICHE, installation starts 1 year from now
    const expectedYear = new Date().getFullYear() + 1;
    const installationStartYear = new Date(
      defaults?.installationSchedule?.startDate ?? "",
    ).getFullYear();
    expect(installationStartYear).toBe(expectedYear);
  });
});
