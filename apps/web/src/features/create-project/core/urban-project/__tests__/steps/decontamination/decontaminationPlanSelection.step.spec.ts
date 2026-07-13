import { describe, it } from "vitest";

import { WizardFormState } from "@/shared/core/wizard-form/wizardForm.reducer";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Decontamination plan selection", () => {
  it("should complete step with none and automaticaly completed next surface step with 0", () => {
    const store = new StoreBuilder().build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: {
          decontaminationPlan: "none",
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      WizardFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
        completed: true,
        payload: { decontaminationPlan: "none" },
      },
      URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
        completed: true,
        payload: { decontaminatedSurfaceArea: 0 },
      },
    });
    expect(getCurrentStep(store)).not.toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
  });

  it("should complete step with unknown and automaticaly completed next surface step with 25%", () => {
    const store = new StoreBuilder().build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: {
          decontaminationPlan: "unknown",
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      WizardFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
        completed: true,
        payload: { decontaminationPlan: "unknown" },
      },
      URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
        completed: true,
        payload: { decontaminatedSurfaceArea: 500 },
      },
    });
    expect(getCurrentStep(store)).not.toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
  });

  it("should complete step with partial and go to next surface step", () => {
    const store = new StoreBuilder().build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: {
          decontaminationPlan: "partial",
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      WizardFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
        completed: true,
        payload: { decontaminationPlan: "partial" },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
  });

  it("should replace step with none and automaticaly completed next surface step with 0", () => {
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
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: {
          decontaminationPlan: "none",
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      WizardFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
        completed: true,
        payload: { decontaminationPlan: "none" },
      },
      URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
        completed: true,
        payload: { decontaminatedSurfaceArea: 0 },
      },
    });
    expect(getCurrentStep(store)).not.toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
  });

  it("should replace step with unknown and automaticaly completed next surface step with 25%", () => {
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
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: {
          decontaminationPlan: "unknown",
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      WizardFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
        completed: true,
        payload: { decontaminationPlan: "unknown" },
      },
      URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
        completed: true,
        payload: { decontaminatedSurfaceArea: 500 },
      },
    });
    expect(getCurrentStep(store)).not.toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
  });

  it("should display alert with pendingStepCompletion", () => {
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
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: {
          decontaminationPlan: "partial",
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.pendingStepCompletion).toEqual({
      showAlert: true,
      changes: {
        navigationTarget: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
        cascadingChanges: [
          { stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA", action: "delete" },
        ],
        payload: {
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          answers: { decontaminationPlan: "partial" },
        },
      },
    });
    expect(getCurrentStep(store)).not.toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
  });

  describe("Cascading to reinstatement expenses on plan change", () => {
    it("should recompute system-generated reinstatement expenses when changing decontamination settings", () => {
      const initialSteps = {
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
          payload: {
            decontaminationPlan: "partial",
          },
        },
      } satisfies WizardFormState["urbanProject"]["steps"];

      const store = new StoreBuilder().withSteps(initialSteps).build();

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          answers: { decontaminationPlan: "none" },
        }),
      );
      store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

      const stepsState = store.getState().projectCreation.urbanProject.steps;

      expect(stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.completed).toEqual(true);
      expect(stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.payload).toEqual(
        stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.defaultValues,
      );
      expect(
        stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.payload?.reinstatementExpenses?.find(
          (expense) => expense.purpose === "remediation",
        )?.amount,
      ).toEqual(0);
    });

    it("should not recompute user-entered reinstatement expenses when changing decontamination settings", () => {
      const initialSteps = {
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
          payload: {
            decontaminationPlan: "partial",
          },
        },
      } satisfies WizardFormState["urbanProject"]["steps"];

      const store = new StoreBuilder().withSteps(initialSteps).build();

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          answers: { decontaminationPlan: "none" },
        }),
      );
      store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

      const stepsState = store.getState().projectCreation.urbanProject.steps;

      expect(stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.completed).toEqual(true);
      expect(stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.payload).toEqual(
        initialSteps.URBAN_PROJECT_EXPENSES_REINSTATEMENT.payload,
      );
    });
  });
});
