import { relatedSiteData } from "@/features/create-project/core/__tests__/siteData.mock";
import { StoreBuilder } from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import { selectPVScheduleProjectionViewData } from "@/features/create-project/core/renewable-energy/renewableEnergyProject.selectors";

describe("selectPVScheduleProjectionViewData - default schedule", () => {
  it("omits reinstatement from default schedule on a friche that opted out of reinstatement", () => {
    const store = new StoreBuilder()
      .withSiteData({ ...relatedSiteData, nature: "FRICHE" })
      .withSteps({
        RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: false },
        },
      })
      .build();

    const { initialValues, hasReinstatement } = selectPVScheduleProjectionViewData(
      store.getState(),
    );

    expect(hasReinstatement).toBe(false);
    expect(initialValues.reinstatement).toBeUndefined();
  });

  it("computes firstYearOfOperation without a reinstatement phase on a friche that opted out", () => {
    const store = new StoreBuilder()
      .withSiteData({ ...relatedSiteData, nature: "FRICHE" })
      .withSteps({
        RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: false },
        },
      })
      .build();

    const { initialValues } = selectPVScheduleProjectionViewData(store.getState());

    // No reinstatement phase: installation starts now, ends +1yr
    const currentYear = new Date().getFullYear();
    expect(initialValues.installation.startDate.getFullYear()).toBe(currentYear);
    expect(initialValues.firstYearOfOperations).toBe(currentYear + 1);
  });

  it("keeps reinstatement in default schedule on a friche that opted into reinstatement", () => {
    const store = new StoreBuilder()
      .withSiteData({ ...relatedSiteData, nature: "FRICHE" })
      .withSteps({
        RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: true },
        },
      })
      .build();

    const { initialValues, hasReinstatement } = selectPVScheduleProjectionViewData(
      store.getState(),
    );

    expect(hasReinstatement).toBe(true);
    expect(initialValues.reinstatement).toBeDefined();
  });
});
