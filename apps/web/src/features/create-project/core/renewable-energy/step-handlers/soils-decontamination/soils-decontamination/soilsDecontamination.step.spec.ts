import { describe, expect, it } from "vitest";

import { relatedSiteData } from "@/features/create-project/core/__tests__/siteData.mock";
import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import { getProjectData } from "@/features/create-project/core/renewable-energy/helpers/readers/projectDataReaders";
import {
  previousStepRequested,
  stepCompletionConfirmed,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

const getData = (store: ReturnType<StoreBuilder["build"]>) =>
  getProjectData(store.getState().projectCreation.renewableEnergyProject.steps);

const getRemediationAmount = (store: ReturnType<StoreBuilder["build"]>) =>
  getData(store).reinstatementCosts?.find((expense) => expense.purpose === "remediation")?.amount;

// 2000 m2 of contaminated soils: the 25% default is 500 m2.
const CONTAMINATED_SITE = {
  ...relatedSiteData,
  hasContaminatedSoils: true,
  contaminatedSoilSurface: 2000,
};

describe("Renewable energy creation - Steps - soils decontamination", () => {
  describe("resolved decontaminated surface", () => {
    it("stores 0 m2 and goes to the soils transformation introduction for 'none'", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("RENEWABLE_ENERGY_SOILS_DECONTAMINATION")
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "none" },
        }),
      );

      expect(getData(store).decontaminatedSoilSurface).toBe(0);
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
    });

    it("stores the 25% default and goes to the soils transformation introduction for 'unknown'", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("RENEWABLE_ENERGY_SOILS_DECONTAMINATION")
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "unknown" },
        }),
      );

      expect(getData(store).decontaminatedSoilSurface).toBe(500);
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
    });

    it("stores the entered surface and goes to the soils transformation introduction for 'partial'", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("RENEWABLE_ENERGY_SOILS_DECONTAMINATION")
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "partial", decontaminatedSurfaceArea: 1200 },
        }),
      );

      expect(getData(store).decontaminatedSoilSurface).toBe(1200);
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
    });

    it("replaces a previously entered surface with 0 m2 when switching 'partial' to 'none'", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("RENEWABLE_ENERGY_SOILS_DECONTAMINATION")
        .withSteps({
          RENEWABLE_ENERGY_SOILS_DECONTAMINATION: {
            completed: true,
            payload: { decontaminationPlan: "partial", decontaminatedSurfaceArea: 1200 },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",
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
        .withCurrentStep("RENEWABLE_ENERGY_SOILS_DECONTAMINATION")
        .build();

      store.dispatch(previousStepRequested());

      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION");
    });
  });

  describe("cascading to reinstatement expenses", () => {
    // payload equals defaultValues => system-generated, eligible for recompute
    const generatedReinstatementExpenses: RenewableEnergyStepsState["RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT"] =
      {
        completed: true,
        payload: { reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }] },
        defaultValues: { reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }] },
      };

    it("recomputes generated reinstatement expenses when the resolved surface changes", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("RENEWABLE_ENERGY_SOILS_DECONTAMINATION")
        .withSteps({
          RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
            completed: true,
            payload: { involvesReinstatement: true },
          },
          RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT: generatedReinstatementExpenses,
          RENEWABLE_ENERGY_SOILS_DECONTAMINATION: {
            completed: true,
            payload: { decontaminationPlan: "partial", decontaminatedSurfaceArea: 1200 },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "unknown" },
        }),
      );
      store.dispatch(stepCompletionConfirmed());

      // 500 m2 (25% of 2000 m2) x 66 €/m2
      expect(getRemediationAmount(store)).toBe(33000);
    });

    it("does not touch reinstatement expenses when the plan changes but the resolved surface does not", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("RENEWABLE_ENERGY_SOILS_DECONTAMINATION")
        .withSteps({
          RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
            completed: true,
            payload: { involvesReinstatement: true },
          },
          RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT: generatedReinstatementExpenses,
          RENEWABLE_ENERGY_SOILS_DECONTAMINATION: {
            completed: true,
            payload: { decontaminationPlan: "unknown", decontaminatedSurfaceArea: 500 },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "partial", decontaminatedSurfaceArea: 500 },
        }),
      );

      // No confirmation is pending: the step is applied straight away.
      expect(
        store.getState().projectCreation.renewableEnergyProject.pendingStepCompletion,
      ).toBeUndefined();
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
      expect(getRemediationAmount(store)).toBe(100000);
    });

    it("keeps a user-edited expense across two consecutive surface changes", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("RENEWABLE_ENERGY_SOILS_DECONTAMINATION")
        .withSteps({
          RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
            completed: true,
            payload: { involvesReinstatement: true },
          },
          // remediation is generated, demolition was edited by the user
          RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT: {
            completed: true,
            payload: {
              reinstatementExpenses: [
                { purpose: "demolition", amount: 12345 },
                { purpose: "remediation", amount: 100000 },
              ],
            },
            defaultValues: {
              reinstatementExpenses: [
                { purpose: "demolition", amount: 0 },
                { purpose: "remediation", amount: 100000 },
              ],
            },
          },
          RENEWABLE_ENERGY_SOILS_DECONTAMINATION: {
            completed: true,
            payload: { decontaminationPlan: "partial", decontaminatedSurfaceArea: 1200 },
          },
        })
        .build();
      const getDemolitionAmount = () =>
        getData(store).reinstatementCosts?.find((expense) => expense.purpose === "demolition")
          ?.amount;

      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "unknown" },
        }),
      );
      store.dispatch(stepCompletionConfirmed());

      // 500 m2 (25% of 2000 m2) x 66 €/m2
      expect(getRemediationAmount(store)).toBe(33000);
      expect(getDemolitionAmount()).toBe(12345);

      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "partial", decontaminatedSurfaceArea: 1000 },
        }),
      );
      store.dispatch(stepCompletionConfirmed());

      // 1000 m2 x 66 €/m2
      expect(getRemediationAmount(store)).toBe(66000);
      expect(getDemolitionAmount()).toBe(12345);
    });

    it("preserves user-entered reinstatement expenses when the resolved surface changes", () => {
      const store = new StoreBuilder()
        .withSiteData(CONTAMINATED_SITE)
        .withCurrentStep("RENEWABLE_ENERGY_SOILS_DECONTAMINATION")
        .withSteps({
          RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
            completed: true,
            payload: { involvesReinstatement: true },
          },
          // payload differs from defaultValues => user-edited, must be preserved
          RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT: {
            completed: true,
            payload: { reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }] },
            defaultValues: { reinstatementExpenses: [{ purpose: "remediation", amount: 50000 }] },
          },
          RENEWABLE_ENERGY_SOILS_DECONTAMINATION: {
            completed: true,
            payload: { decontaminationPlan: "partial", decontaminatedSurfaceArea: 1200 },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",
          answers: { decontaminationPlan: "none" },
        }),
      );

      // Nothing generated is left to recompute: the step is applied straight away.
      expect(
        store.getState().projectCreation.renewableEnergyProject.pendingStepCompletion,
      ).toBeUndefined();
      expect(getRemediationAmount(store)).toBe(100000);
    });
  });
});
