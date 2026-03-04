import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import { navigateToPrevious } from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - final summary", () => {
  // FINAL_SUMMARY is a terminal info step with no getNextStepId.
  // Saving the project is triggered externally (not via navigateToNext).

  it("should navigate back to naming", () => {
    const store = new StoreBuilder()
      .withStepsSequence(["RENEWABLE_ENERGY_NAMING", "RENEWABLE_ENERGY_FINAL_SUMMARY"])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_NAMING");
  });
});
