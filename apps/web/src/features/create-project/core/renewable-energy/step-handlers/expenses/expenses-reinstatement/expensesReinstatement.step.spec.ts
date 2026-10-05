import { relatedSiteData } from "@/features/create-project/core/__tests__/siteData.mock";
import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
  stepNavigationRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVReinstatementExpensesViewData } from "@/features/create-project/core/renewable-energy/renewableEnergyProject.selectors";

describe("Renewable energy creation - Steps - expenses reinstatement", () => {
  it("should complete step and navigate to photovoltaic panels installation", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
        answers: { reinstatementExpenses: [{ amount: 34500, purpose: "demolition" }] },
      }),
    );
    expect(
      store.getState().projectCreation.renewableEnergyProject.steps[
        "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT"
      ],
    ).toEqual({
      completed: true,
      payload: { reinstatementExpenses: [{ amount: 34500, purpose: "demolition" }] },
    });
    expect(getCurrentStep(store)).toBe(
      "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
    );
  });

  it("should navigate back to expenses introduction when no site purchase", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION",
        "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
      ])
      .withSteps({
        RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE: {
          completed: true,
          payload: { willSiteBePurchased: false },
        },
      })
      .build();
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_INTRODUCTION");
  });

  it("should navigate back to site purchase amounts when site was purchased", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
        "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
      ])
      .withSteps({
        RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE: {
          completed: true,
          payload: { willSiteBePurchased: true },
        },
      })
      .build();
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS");
  });

  it("generates the decontamination expense from 25% of the contaminated soils when the decontamination answer is 'Ne sait pas'", () => {
    const siteSoilsDistribution = { BUILDINGS: 1000, MINERAL_SOIL: 9000 };
    const store = new StoreBuilder()
      .withSiteData({
        ...relatedSiteData,
        soilsDistribution: siteSoilsDistribution,
        hasContaminatedSoils: true,
        contaminatedSoilSurface: 2000,
      })
      .withCurrentStep("RENEWABLE_ENERGY_SOILS_DECONTAMINATION")
      .withSteps({
        RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: true },
        },
        // Same soils as the site: only demolition, asbestos removal and remediation cost.
        RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION: {
          completed: true,
          payload: {
            soilsTransformationProject: "preserveCurrentSoils",
            soilsDistribution: siteSoilsDistribution,
          },
        },
      })
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",
        answers: { decontaminationPlan: "unknown" },
      }),
    );
    store.dispatch(stepNavigationRequested({ stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT" }));

    expect(selectPVReinstatementExpensesViewData(store.getState())).toEqual({
      decontaminatedSurfaceArea: 500,
      reinstatementExpenses: [
        { purpose: "asbestos_removal", amount: 75000 },
        { purpose: "deimpermeabilization", amount: 0 },
        { purpose: "demolition", amount: 75000 },
        { purpose: "sustainable_soils_reinstatement", amount: 0 },
        // 500 m2 (25% of 2000 m2) x 66 €/m2
        { purpose: "remediation", amount: 33000 },
      ],
    });
  });
});
