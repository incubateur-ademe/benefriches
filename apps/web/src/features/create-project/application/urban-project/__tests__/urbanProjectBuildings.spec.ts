/* eslint-disable jest/expect-expect */
import "../urbanProject.actions";
import {
  buildingsFloorSurfaceAreaCompleted,
  buildingsFloorSurfaceAreaReverted,
  buildingsIntroductionCompleted,
  buildingsIntroductionReverted,
  buildingsUseIntroductionCompleted,
  buildingsUseIntroductionReverted,
  buildingsUseCategorySurfaceAreasCompleted,
  buildingsUseCategorySurfaceAreasReverted,
  buildingsEconomicActivitySurfaceAreasCompleted,
  buildingsEconomicActivitySurfaceAreasReverted,
} from "../urbanProject.actions";
import { expectRevertedState, expectUpdatedState, StoreBuilder } from "./testUtils";

describe("Urban project custom creation : buildings steps", () => {
  describe("BUILDINGS_INTRODUCTION step", () => {
    it("goes to BUILDINGS_FLOOR_SURFACE_AREA step when step is completed", () => {
      const store = new StoreBuilder().withStepsHistory(["BUILDINGS_INTRODUCTION"]).build();
      const initialRootState = store.getState();

      store.dispatch(buildingsIntroductionCompleted());

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "BUILDINGS_FLOOR_SURFACE_AREA",
      });
    });

    it("goes to previous step when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["SOILS_CARBON_SUMMARY", "BUILDINGS_INTRODUCTION"])
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsIntroductionReverted());

      const newState = store.getState();
      expectRevertedState(initialRootState, newState, {});
    });
  });
  describe("BUILDINGS_FLOOR_SURFACE_AREA step", () => {
    it("goes to BUILDINGS_USE_INTRODUCTION step and sets floor surface area when step is completed", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_INTRODUCTION", "BUILDINGS_FLOOR_SURFACE_AREA"])
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsFloorSurfaceAreaCompleted(32000));

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "BUILDINGS_USE_INTRODUCTION",
        creationDataDiff: {
          buildingsFloorSurfaceArea: 32000,
        },
      });
    });
    it("goes to previous step and unset floor surface area when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_INTRODUCTION", "BUILDINGS_FLOOR_SURFACE_AREA"])
        .withCreationData({ buildingsFloorSurfaceArea: 100 })
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsFloorSurfaceAreaReverted());

      const newState = store.getState();
      expectRevertedState(initialRootState, newState, {
        creationDataDiff: { buildingsFloorSurfaceArea: undefined },
      });
    });
  });
  describe("BUILDINGS_USE_INTRODUCTION step", () => {
    it("goes to BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION step when step is completed", () => {
      const store = new StoreBuilder().withStepsHistory(["BUILDINGS_USE_INTRODUCTION"]).build();
      const initialRootState = store.getState();

      store.dispatch(buildingsUseIntroductionCompleted());

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
      });
    });
    it("goes to previous step when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_FLOOR_SURFACE_AREA", "BUILDINGS_USE_INTRODUCTION"])
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsUseIntroductionReverted());

      const newState = store.getState();
      expectRevertedState(initialRootState, newState, {});
    });
  });
  describe("BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION step", () => {
    it("sets buildings use surface areas and goes to BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA when step is completed and buildings have economic activity", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_INTRODUCTION", "BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION"])
        .build();
      const initialRootState = store.getState();

      store.dispatch(
        buildingsUseCategorySurfaceAreasCompleted({
          RESIDENTIAL: 2000,
          ECONOMIC_ACTIVITY: 5000,
        }),
      );

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA",
        creationDataDiff: {
          buildingsUsesDistribution: {
            RESIDENTIAL: 2000,
          },
          buildingsUseCategoriesDistribution: {
            RESIDENTIAL: 2000,
            ECONOMIC_ACTIVITY: 5000,
          },
        },
      });
    });
    it("sets buildings use surface areas and goes to STAKEHOLDERS_INTRODUCTION when step is completed and buildings have NO economic activity", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_INTRODUCTION", "BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION"])
        .build();
      const initialRootState = store.getState();

      store.dispatch(
        buildingsUseCategorySurfaceAreasCompleted({
          RESIDENTIAL: 2000,
          MULTI_STORY_PARKING: 5000,
        }),
      );

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "STAKEHOLDERS_INTRODUCTION",
        creationDataDiff: {
          buildingsUsesDistribution: {
            RESIDENTIAL: 2000,
            MULTI_STORY_PARKING: 5000,
          },
          buildingsUseCategoriesDistribution: {
            RESIDENTIAL: 2000,
            MULTI_STORY_PARKING: 5000,
          },
        },
      });
    });
    it("goes to previous step and unsets buildings use surface areas when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_INTRODUCTION", "BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION"])
        .withCreationData({
          buildingsUsesDistribution: {
            RESIDENTIAL: 40000,
          },
          buildingsUseCategoriesDistribution: {
            RESIDENTIAL: 40000,
            ECONOMIC_ACTIVITY: 12000,
          },
        })
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsUseCategorySurfaceAreasReverted());

      const newState = store.getState();
      expectRevertedState(initialRootState, newState, {
        creationDataDiff: {
          buildingsUsesDistribution: undefined,
          buildingsUseCategoriesDistribution: undefined,
        },
      });
    });
  });
  describe("BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA step", () => {
    it("sets buildings economic activity use surface areas and goes to STAKEHOLDERS_INTRODUCTION when step is completed", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
          "BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA",
        ])
        .withCreationData({
          buildingsEconomicActivityUses: [
            "GROUND_FLOOR_RETAIL",
            "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS",
          ],
          buildingsUsesDistribution: { RESIDENTIAL: 5000 },
          buildingsUseCategoriesDistribution: { RESIDENTIAL: 5000, ECONOMIC_ACTIVITY: 5000 },
          buildingsFloorSurfaceArea: 10000,
        })
        .build();
      const initialRootState = store.getState();

      store.dispatch(
        buildingsEconomicActivitySurfaceAreasCompleted({
          GROUND_FLOOR_RETAIL: 2000,
          OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS: 3000,
        }),
      );

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "STAKEHOLDERS_INTRODUCTION",
        creationDataDiff: {
          buildingsUsesDistribution: {
            RESIDENTIAL: 5000,
            GROUND_FLOOR_RETAIL: 2000,
            OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS: 3000,
          },
        },
      });
    });
    it("goes to previous step and unsets buildings use surface areas when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
          "BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA",
        ])
        .withCreationData({
          buildingsEconomicActivityUses: [
            "GROUND_FLOOR_RETAIL",
            "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS",
          ],
          buildingsUsesDistribution: {
            RESIDENTIAL: 5000,
            GROUND_FLOOR_RETAIL: 2000,
            OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS: 3000,
          },
          buildingsUseCategoriesDistribution: { RESIDENTIAL: 5000, ECONOMIC_ACTIVITY: 5000 },
          buildingsFloorSurfaceArea: 10000,
        })
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsEconomicActivitySurfaceAreasReverted());

      const newState = store.getState();
      expectRevertedState(initialRootState, newState, {
        creationDataDiff: {
          buildingsUsesDistribution: { RESIDENTIAL: 5000 },
        },
      });
    });
  });
});
