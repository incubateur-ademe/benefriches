import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - VACANT_COMMERCIAL_PREMISES_FOOTPRINT step", () => {
  describe("completion", () => {
    it("should navigate to floor area step when footprint is non-zero", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT")
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
          answers: { surfaceArea: 500 },
        }),
      );

      expect(
        store.getState().siteCreation.urbanZone.steps[
          "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT"
        ],
      ).toEqual({
        completed: true,
        payload: { surfaceArea: 500 },
      });
      expect(getCurrentStep(store)).toBe("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA");
    });

    it("should skip floor area and navigate directly to full-time jobs step when footprint is 0", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT")
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
          answers: { surfaceArea: 0 },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to manager step", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "URBAN_ZONE_MANAGER",
          "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
        ])
        .build();

      store.dispatch(previousStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_MANAGER");
    });
  });
});

describe("Urban zone - VACANT_COMMERCIAL_PREMISES_FLOOR_AREA step", () => {
  describe("completion", () => {
    it("should navigate to full-time jobs step when footprint is less than total site surface", () => {
      const store = new StoreBuilder()
        .withSiteData({ surfaceArea: 10_000 })
        .withUrbanZoneSteps({
          URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
            completed: true,
            payload: { surfaceArea: 500 },
          },
        })
        .withCurrentStep("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA")
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
          answers: { surfaceArea: 1200 },
        }),
      );

      expect(
        store.getState().siteCreation.urbanZone.steps[
          "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA"
        ],
      ).toEqual({
        completed: true,
        payload: { surfaceArea: 1200 },
      });
      expect(getCurrentStep(store)).toBe("URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT");
    });

    it("should skip full-time jobs and navigate to expenses introduction when footprint equals total site surface", () => {
      const store = new StoreBuilder()
        .withSiteData({ surfaceArea: 10_000 })
        .withUrbanZoneSteps({
          URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
            completed: true,
            payload: { surfaceArea: 10_000 },
          },
        })
        .withCurrentStep("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA")
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
          answers: { surfaceArea: 5000 },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to footprint step", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
          "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
        ])
        .build();

      store.dispatch(previousStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT");
    });
  });
});

describe("Urban zone - FULL_TIME_JOBS_EQUIVALENT step", () => {
  describe("completion", () => {
    it("should store full-time jobs data and navigate to expenses introduction", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT")
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
          answers: { fullTimeJobs: 42 },
        }),
      );

      expect(
        store.getState().siteCreation.urbanZone.steps["URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT"],
      ).toEqual({
        completed: true,
        payload: { fullTimeJobs: 42 },
      });
      expect(getCurrentStep(store)).toBe("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to floor area step when footprint was non-zero", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
          "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
        ])
        .build();

      store.dispatch(previousStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA");
    });

    it("should navigate back to footprint step (not floor area) when footprint was 0", () => {
      const store = new StoreBuilder()
        .withUrbanZoneSteps({
          URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
            completed: true,
            payload: { surfaceArea: 0 },
          },
        })
        .withCurrentStep("URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT")
        .build();

      store.dispatch(previousStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT");
    });
  });
});
