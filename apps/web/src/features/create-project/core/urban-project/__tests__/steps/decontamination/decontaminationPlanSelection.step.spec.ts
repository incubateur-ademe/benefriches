import { describe, expect, it } from "vitest";

import { getProjectData } from "../../../helpers/readers/projectDataReaders";
import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import type { UrbanProjectStepsState } from "../../../urbanProject.state";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const { stepCompletionRequested, stepCompletionConfirmed } = creationProjectFormUrbanActions;

const getData = (store: ReturnType<StoreBuilder["build"]>) =>
  getProjectData(store.getState().projectCreation.urbanProject.form.steps);

describe("Urban project creation - Steps - Decontamination plan selection", () => {
  it("auto-fills the decontaminated surface to 0 and skips the surface step for 'none'", () => {
    const store = new StoreBuilder().build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: { decontaminationPlan: "none" },
      }),
    );

    expect(getData(store).decontaminatedSoilSurface).toBe(0);
    expect(getCurrentStep(store)).not.toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
  });

  it("auto-fills the decontaminated surface to the 25% default and skips the surface step for 'unknown'", () => {
    // mockSiteData contaminatedSoilSurface is 2000, so 25% default is 500
    const store = new StoreBuilder().build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: { decontaminationPlan: "unknown" },
      }),
    );

    expect(getData(store).decontaminatedSoilSurface).toBe(500);
    expect(getCurrentStep(store)).not.toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
  });

  it("routes to the surface step without auto-filling for 'partial'", () => {
    const store = new StoreBuilder().build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: { decontaminationPlan: "partial" },
      }),
    );

    expect(getData(store).decontaminatedSoilSurface).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
  });

  it("recomputes the auto-filled surface to 0 when replacing 'unknown' with 'none'", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
          completed: true,
          payload: { decontaminationPlan: "unknown" },
        },
        URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
          completed: true,
          payload: { decontaminatedSurfaceArea: 500 },
        },
      })
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: { decontaminationPlan: "none" },
      }),
    );

    expect(getData(store).decontaminatedSoilSurface).toBe(0);
    expect(getCurrentStep(store)).not.toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
  });

  it("recomputes the auto-filled surface to the 25% default when replacing 'none' with 'unknown'", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
          completed: true,
          payload: { decontaminationPlan: "none" },
        },
        URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
          completed: true,
          payload: { decontaminatedSurfaceArea: 0 },
        },
      })
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: { decontaminationPlan: "unknown" },
      }),
    );

    expect(getData(store).decontaminatedSoilSurface).toBe(500);
    expect(getCurrentStep(store)).not.toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
  });

  it("holds navigation for confirmation, then routes to the surface step clearing the auto-filled value, when switching 'unknown' to 'partial'", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION")
      .withSteps({
        URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
          completed: true,
          payload: { decontaminationPlan: "unknown" },
        },
        URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
          completed: true,
          payload: { decontaminatedSurfaceArea: 500 },
        },
      })
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: { decontaminationPlan: "partial" },
      }),
    );

    // Confirmation pending: navigation is held at the selection step
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION");

    store.dispatch(stepCompletionConfirmed());

    expect(
      store.getState().projectCreation.urbanProject.form.pendingStepCompletion,
    ).toBeUndefined();
    expect(getData(store).decontaminatedSoilSurface).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
  });

  describe("Cascading to reinstatement expenses on plan change", () => {
    it("recomputes system-generated reinstatement expenses when decontamination changes", () => {
      // payload equals defaultValues => system-generated, eligible for recompute
      const initialSteps: UrbanProjectStepsState = {
        URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
          completed: true,
          payload: {
            reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }],
          },
          defaultValues: {
            reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }],
          },
        },
        URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
          completed: true,
          payload: { decontaminationPlan: "partial" },
        },
      };

      const store = new StoreBuilder().withSteps(initialSteps).build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          answers: { decontaminationPlan: "none" },
        }),
      );
      store.dispatch(stepCompletionConfirmed());

      const remediation = getData(store).reinstatementCosts?.find(
        (expense) => expense.purpose === "remediation",
      );
      expect(remediation?.amount).toBe(0);
    });

    it("preserves user-entered reinstatement expenses when decontamination changes", () => {
      // payload differs from defaultValues => user-edited, must be preserved
      const initialSteps: UrbanProjectStepsState = {
        URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
          completed: true,
          payload: {
            reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }],
          },
          defaultValues: {
            reinstatementExpenses: [{ purpose: "remediation", amount: 50000 }],
          },
        },
        URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
          completed: true,
          payload: { decontaminationPlan: "partial" },
        },
      };

      const store = new StoreBuilder().withSteps(initialSteps).build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          answers: { decontaminationPlan: "none" },
        }),
      );
      store.dispatch(stepCompletionConfirmed());

      const remediation = getData(store).reinstatementCosts?.find(
        (expense) => expense.purpose === "remediation",
      );
      expect(remediation?.amount).toBe(100000);
    });
  });
});
