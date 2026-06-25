import { describe, expect, it } from "vitest";

import { creationProjectFormSelectors } from "../../../urbanProject.selectors";
import { StoreBuilder } from "../../_testStoreHelpers";

describe("selectScheduleProjectionViewData", () => {
  it("returns step answers", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_SCHEDULE_PROJECTION: {
          completed: true,
          payload: {
            installationSchedule: { startDate: "2025-01-01", endDate: "2026-01-01" },
            firstYearOfOperation: 2027,
          },
        },
      })
      .build();

    const rootState = store.getState();
    const result = creationProjectFormSelectors.selectScheduleProjectionViewData(rootState);

    expect(result.stepAnswers?.installationSchedule).toEqual({
      startDate: "2025-01-01",
      endDate: "2026-01-01",
    });
    expect(result.stepAnswers?.firstYearOfOperation).toBe(2027);
  });

  it("returns undefined step answers when no steps completed", () => {
    const store = new StoreBuilder().withSteps({}).build();
    const rootState = store.getState();
    const result = creationProjectFormSelectors.selectScheduleProjectionViewData(rootState);

    expect(result.stepAnswers).toBeUndefined();
  });

  it("returns hasReinstatement false when involvesReinstatement step is answered false", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: false },
        },
      })
      .build();

    const rootState = store.getState();
    const result = creationProjectFormSelectors.selectScheduleProjectionViewData(rootState);

    expect(result.hasReinstatement).toBe(false);
  });

  it("returns hasReinstatement true when involvesReinstatement step is answered true", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: true },
        },
      })
      .build();

    const rootState = store.getState();
    const result = creationProjectFormSelectors.selectScheduleProjectionViewData(rootState);

    expect(result.hasReinstatement).toBe(true);
  });
});
