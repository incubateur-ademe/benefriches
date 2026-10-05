import { describe, expect, it } from "vitest";

import { getProjectData } from "../../../helpers/readers/projectDataReaders";
import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import type { UrbanProjectStepsState } from "../../../urbanProject.state";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const { stepCompletionRequested, stepCompletionConfirmed, previousStepRequested } =
  creationProjectFormUrbanActions;

const getData = (store: ReturnType<StoreBuilder["build"]>) =>
  getProjectData(store.getState().projectCreation.urbanProject.form.steps);

const getRemediationAmount = (store: ReturnType<StoreBuilder["build"]>) =>
  getData(store).reinstatementCosts?.find((expense) => expense.purpose === "remediation")?.amount;

// 2000 m2 of contaminated soils: the 25% default is 500 m2.
const CONTAMINATED_SITE = { hasContaminatedSoils: true, contaminatedSoilSurface: 2000 };

describe("Urban project creation - Steps - Soils decontamination", () => {
  describe("resolved decontaminated surface", () => {
    it("stores 0 m2 and goes to the site resale introduction for 'none'", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION")
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "none" },
        }),
      );

      expect(getData(store).decontaminatedSoilSurface).toBe(0);
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    });

    it("stores the 25% default and goes to the site resale introduction for 'unknown'", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION")
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "unknown" },
        }),
      );

      expect(getData(store).decontaminatedSoilSurface).toBe(500);
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    });

    it("stores the entered surface and goes to the site resale introduction for 'partial'", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION")
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "partial", decontaminatedSurfaceArea: 1200 },
        }),
      );

      expect(getData(store).decontaminatedSoilSurface).toBe(1200);
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    });

    it("replaces a previously entered surface with 0 m2 when switching 'partial' to 'none'", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION")
        .withSteps({
          URBAN_PROJECT_SOILS_DECONTAMINATION: {
            completed: true,
            payload: { decontaminationPlan: "partial", decontaminatedSurfaceArea: 1200 },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "none" },
        }),
      );

      expect(getData(store).decontaminatedSoilSurface).toBe(0);
    });
  });

  describe("navigation", () => {
    it("goes back to the decontamination introduction", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION")
        .build();

      store.dispatch(previousStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
    });
  });

  describe("cascading to reinstatement expenses", () => {
    // payload equals defaultValues => system-generated, eligible for recompute
    const generatedReinstatementExpenses: UrbanProjectStepsState["URBAN_PROJECT_EXPENSES_REINSTATEMENT"] =
      {
        completed: true,
        payload: { reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }] },
        defaultValues: { reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }] },
      };

    it("recomputes generated reinstatement expenses when the resolved surface changes", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION")
        .withSteps({
          URBAN_PROJECT_EXPENSES_REINSTATEMENT: generatedReinstatementExpenses,
          URBAN_PROJECT_SOILS_DECONTAMINATION: {
            completed: true,
            payload: { decontaminationPlan: "partial", decontaminatedSurfaceArea: 1200 },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "none" },
        }),
      );
      store.dispatch(stepCompletionConfirmed());

      expect(getRemediationAmount(store)).toBe(0);
    });

    it("does not touch reinstatement expenses when the plan changes but the resolved surface does not", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION")
        .withSteps({
          URBAN_PROJECT_EXPENSES_REINSTATEMENT: generatedReinstatementExpenses,
          URBAN_PROJECT_SOILS_DECONTAMINATION: {
            completed: true,
            payload: { decontaminationPlan: "unknown", decontaminatedSurfaceArea: 500 },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "partial", decontaminatedSurfaceArea: 500 },
        }),
      );

      // No confirmation is pending: the step is applied straight away.
      expect(
        store.getState().projectCreation.urbanProject.form.pendingStepCompletion,
      ).toBeUndefined();
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
      expect(getRemediationAmount(store)).toBe(100000);
    });

    it("preserves user-entered reinstatement expenses when the resolved surface changes", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION")
        .withSteps({
          // payload differs from defaultValues => user-edited, must be preserved
          URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
            completed: true,
            payload: { reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }] },
            defaultValues: { reinstatementExpenses: [{ purpose: "remediation", amount: 50000 }] },
          },
          URBAN_PROJECT_SOILS_DECONTAMINATION: {
            completed: true,
            payload: { decontaminationPlan: "partial", decontaminatedSurfaceArea: 1200 },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "none" },
        }),
      );
      store.dispatch(stepCompletionConfirmed());

      expect(getRemediationAmount(store)).toBe(100000);
    });
  });
});
