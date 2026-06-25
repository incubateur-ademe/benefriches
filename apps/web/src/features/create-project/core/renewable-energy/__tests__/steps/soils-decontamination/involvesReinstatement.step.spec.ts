import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import { stepCompletionRequested } from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVScheduleProjectionViewData } from "@/features/create-project/core/renewable-energy/step-handlers/schedule/schedule-projection/scheduleProjection.selector";

describe("Renewable energy creation - Steps - involves reinstatement", () => {
  describe("completion", () => {
    it("should navigate to soils decontamination introduction when answer is true", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
          answers: { involvesReinstatement: true },
        }),
      );
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION");
    });

    it("should navigate to soils decontamination introduction when answer is false", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
          answers: { involvesReinstatement: false },
        }),
      );
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION");
    });
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

    it("should preserve decontamination steps in sequence regardless of involvesReinstatement", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
          answers: { involvesReinstatement: false },
        }),
      );
      const { stepsSequence } = store.getState().projectCreation.renewableEnergyProject;
      expect(stepsSequence).toContain("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION");
      expect(stepsSequence).toContain("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION");
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
