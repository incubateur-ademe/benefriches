import { describe, it } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Decontamination plan selection", () => {
  it("should complete step with none and automaticaly completed next surface step with 0", () => {
    const store = createTestStore();

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: {
          decontaminationPlan: "none",
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
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
    const store = createTestStore();

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: {
          decontaminationPlan: "unknown",
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
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
    const store = createTestStore();

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: {
          decontaminationPlan: "partial",
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
        completed: true,
        payload: { decontaminationPlan: "partial" },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
  });

  it("should replace step with none and automaticaly completed next surface step with 0", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
          completed: true,
          payload: { decontaminationPlan: "unknown" },
        },
        URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
          completed: true,
          payload: { decontaminatedSurfaceArea: 500 },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: {
          decontaminationPlan: "none",
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
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
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
          completed: true,
          payload: { decontaminationPlan: "none" },
        },
        URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
          completed: true,
          payload: { decontaminatedSurfaceArea: 0 },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        answers: {
          decontaminationPlan: "unknown",
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
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
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
      steps: {
        URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
          completed: true,
          payload: { decontaminationPlan: "unknown" },
        },
        URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
          completed: true,
          payload: { decontaminatedSurfaceArea: 500 },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
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
});
