import { relatedSiteData } from "@/features/create-project/core/__tests__/siteData.mock";
import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import { stepCompletionRequested } from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVScheduleProjectionViewData } from "@/features/create-project/core/renewable-energy/renewableEnergyProject.selectors";

describe("Renewable energy creation - Steps - involves reinstatement", () => {
  describe("completion", () => {
    for (const involvesReinstatement of [true, false]) {
      it(`should navigate to soils decontamination introduction when site has contaminated soils (answer ${involvesReinstatement})`, () => {
        const store = new StoreBuilder()
          .withSiteData({
            ...relatedSiteData,
            nature: "FRICHE",
            hasContaminatedSoils: true,
            contaminatedSoilSurface: 2000,
          })
          .build();
        store.dispatch(
          stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
            answers: { involvesReinstatement },
          }),
        );
        expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION");
      });

      it(`should navigate to soils transformation introduction when site has no contaminated soils (answer ${involvesReinstatement})`, () => {
        const store = new StoreBuilder()
          .withSiteData({
            ...relatedSiteData,
            nature: "FRICHE",
            hasContaminatedSoils: false,
            contaminatedSoilSurface: undefined,
          })
          .build();
        store.dispatch(
          stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
            answers: { involvesReinstatement },
          }),
        );
        expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
      });
    }
  });

  describe("dependency rules", () => {
    it("should exclude reinstatement steps from sequence when involvesReinstatement is false", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
          answers: { involvesReinstatement: false },
        }),
      );
      const { stepsSequence } = store.getState().projectCreation.renewableEnergyProject;
      expect(stepsSequence).not.toContain(
        "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      );
      expect(stepsSequence).not.toContain("RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT");
    });

    it("should include reinstatement steps in sequence when involvesReinstatement is true", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
          answers: { involvesReinstatement: true },
        }),
      );
      const { stepsSequence } = store.getState().projectCreation.renewableEnergyProject;
      expect(stepsSequence).toContain("RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER");
      expect(stepsSequence).toContain("RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT");
    });

    it("should preserve decontamination steps in sequence regardless of involvesReinstatement when site has contaminated soils", () => {
      const store = new StoreBuilder()
        .withSiteData({
          ...relatedSiteData,
          hasContaminatedSoils: true,
          contaminatedSoilSurface: 2000,
        })
        .build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
          answers: { involvesReinstatement: false },
        }),
      );
      const { stepsSequence } = store.getState().projectCreation.renewableEnergyProject;
      expect(stepsSequence).toContain("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION");
      expect(stepsSequence).toContain("RENEWABLE_ENERGY_SOILS_DECONTAMINATION");
    });
  });

  describe("schedule view data", () => {
    it("should set hasReinstatement to false when involvesReinstatement is false, even on a FRICHE", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
            completed: true,
            payload: { involvesReinstatement: false },
          },
        })
        .build();
      const viewData = selectPVScheduleProjectionViewData(store.getState());
      expect(viewData.hasReinstatement).toBe(false);
    });

    it("should set hasReinstatement to true when involvesReinstatement is true", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
            completed: true,
            payload: { involvesReinstatement: true },
          },
        })
        .build();
      const viewData = selectPVScheduleProjectionViewData(store.getState());
      expect(viewData.hasReinstatement).toBe(true);
    });
  });
});
