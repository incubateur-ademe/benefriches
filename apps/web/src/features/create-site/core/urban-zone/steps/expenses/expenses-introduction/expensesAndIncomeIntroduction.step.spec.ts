import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - EXPENSES_AND_INCOME_INTRODUCTION step", () => {
  describe("forward navigation", () => {
    it("should navigate to vacant premises expenses when manager is activity park manager and has vacant premises", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION")
        .withUrbanZoneSteps({
          URBAN_ZONE_MANAGER: {
            completed: true,
            payload: { structureType: "activity_park_manager" },
          },
          URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
            completed: true,
            payload: { surfaceArea: 500 },
          },
        })
        .withSiteData({ surfaceArea: 10_000 })
        .build();

      store.dispatch(nextStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_VACANT_PREMISES_EXPENSES");
    });

    it("should navigate to zone management expenses when manager is activity park manager, no vacant premises but has activity", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION")
        .withUrbanZoneSteps({
          URBAN_ZONE_MANAGER: {
            completed: true,
            payload: { structureType: "activity_park_manager" },
          },
          URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
            completed: true,
            payload: { surfaceArea: 0 },
          },
        })
        .withSiteData({ surfaceArea: 10_000 })
        .build();

      store.dispatch(nextStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES");
    });

    it("should navigate to vacant premises expenses when manager is activity park manager, site entirely vacant (has vacant premises even if no activity)", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION")
        .withUrbanZoneSteps({
          URBAN_ZONE_MANAGER: {
            completed: true,
            payload: { structureType: "activity_park_manager" },
          },
          URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
            completed: true,
            payload: { surfaceArea: 10_000 },
          },
        })
        .withSiteData({ surfaceArea: 10_000 })
        .build();

      store.dispatch(nextStepRequested());

      // hasVacantPremises = true (footprint > 0), so we go to VACANT_PREMISES_EXPENSES
      expect(getCurrentStep(store)).toBe("URBAN_ZONE_VACANT_PREMISES_EXPENSES");
    });

    it("should navigate to expenses summary when manager is activity park manager, no vacant premises and no activity", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION")
        .withUrbanZoneSteps({
          URBAN_ZONE_MANAGER: {
            completed: true,
            payload: { structureType: "activity_park_manager" },
          },
          URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
            completed: true,
            payload: { surfaceArea: 0 },
          },
        })
        .withSiteData({ surfaceArea: 0 })
        .build();

      store.dispatch(nextStepRequested());

      // footprint = 0 => hasVacantPremises = false; footprint >= totalArea => hasActivity = false
      expect(getCurrentStep(store)).toBe("URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY");
    });

    it("should navigate to local authority expenses when manager is local authority", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION")
        .withUrbanZoneSteps({
          URBAN_ZONE_MANAGER: {
            completed: true,
            payload: { structureType: "local_authority" },
          },
        })
        .build();

      store.dispatch(nextStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to full time jobs when footprint is non-zero and less than site area", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
          "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION",
        ])
        .withUrbanZoneSteps({
          URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
            completed: true,
            payload: { surfaceArea: 500 },
          },
        })
        .withSiteData({ surfaceArea: 10_000 })
        .build();

      store.dispatch(previousStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT");
    });

    it("should navigate back to vacant floor area when footprint equals total site area", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
          "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION",
        ])
        .withUrbanZoneSteps({
          URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
            completed: true,
            payload: { surfaceArea: 10_000 },
          },
        })
        .withSiteData({ surfaceArea: 10_000 })
        .build();

      store.dispatch(previousStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA");
    });
  });
});
