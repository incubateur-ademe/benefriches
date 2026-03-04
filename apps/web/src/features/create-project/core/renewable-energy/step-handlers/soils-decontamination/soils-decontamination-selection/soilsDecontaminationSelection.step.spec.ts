import { relatedSiteData } from "@/features/create-project/core/__tests__/siteData.mock";
import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - soils decontamination selection", () => {
  describe("completion", () => {
    it("should navigate to decontamination surface area when plan is partial", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
          answers: { decontaminationPlan: "partial" },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION"
        ],
      ).toEqual({
        completed: true,
        payload: { decontaminationPlan: "partial" },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA");
    });

    it("should navigate to soils transformation introduction when plan is none", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
          answers: { decontaminationPlan: "none" },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION"
        ],
      ).toEqual({
        completed: true,
        payload: { decontaminationPlan: "none", decontaminatedSurfaceArea: 0 },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
    });

    it("should navigate to soils transformation introduction when plan is unknown", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
          answers: { decontaminationPlan: "unknown" },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION"
        ],
      ).toEqual({
        completed: true,
        payload: { decontaminationPlan: "unknown", decontaminatedSurfaceArea: 0 },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
    });

    it("should set decontaminatedSurfaceArea to 0 when plan is none", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
          answers: { decontaminationPlan: "none" },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps
          .RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION?.payload,
      ).toMatchObject({ decontaminationPlan: "none", decontaminatedSurfaceArea: 0 });
    });

    it("should compute 25% of contaminated surface when plan is unknown", () => {
      const store = new StoreBuilder()
        .withSiteData({
          ...relatedSiteData,
          hasContaminatedSoils: true,
          contaminatedSoilSurface: 2000,
        })
        .build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
          answers: { decontaminationPlan: "unknown" },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps
          .RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION?.payload,
      ).toMatchObject({ decontaminationPlan: "unknown", decontaminatedSurfaceArea: 500 });
    });
  });

  describe("back navigation", () => {
    it("should navigate back to decontamination introduction", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION",
          "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
        ])
        .build();
      store.dispatch(navigateToPrevious());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION");
    });
  });
});
