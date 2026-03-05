import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - schedule projection", () => {
  describe("completion", () => {
    it("should complete step with only firstYearOfOperation and navigate to project phase", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION",
          answers: {
            firstYearOfOperation: 2031,
          },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_SCHEDULE_PROJECTION"
        ],
      ).toEqual({
        completed: true,
        payload: { firstYearOfOperation: 2031 },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PROJECT_PHASE");
    });

    it("should complete step with full schedule data and navigate to project phase", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION",
          answers: {
            firstYearOfOperation: 2031,
            photovoltaicInstallationSchedule: {
              startDate: "2029-01-01",
              endDate: "2030-06-30",
            },
            reinstatementSchedule: {
              startDate: "2028-03-01",
              endDate: "2028-12-31",
            },
          },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_SCHEDULE_PROJECTION"
        ],
      ).toEqual({
        completed: true,
        payload: {
          firstYearOfOperation: 2031,
          photovoltaicInstallationSchedule: {
            startDate: "2029-01-01",
            endDate: "2030-06-30",
          },
          reinstatementSchedule: {
            startDate: "2028-03-01",
            endDate: "2028-12-31",
          },
        },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PROJECT_PHASE");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to financial assistance", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
          "RENEWABLE_ENERGY_SCHEDULE_PROJECTION",
        ])
        .build();
      store.dispatch(previousStepRequested());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE");
    });
  });
});
