/* eslint-disable jest/expect-expect */
import "../urbanProject.actions";
import {
  buildingsFloorSurfaceAreaCompleted,
  buildingsFloorSurfaceAreaReverted,
  buildingsIntroductionCompleted,
  buildingsIntroductionReverted,
  buildingsUseIntroductionCompleted,
  buildingsUseIntroductionReverted,
  buildingsUseSelectionCompleted,
  buildingsUseSelectionReverted,
  buildingsUseSurfaceAreasCompleted,
  buildingsUseSurfaceAreasReverted,
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
    it("goes to BUILDINGS_USE_SELECTION step when step is completed", () => {
      const store = new StoreBuilder().withStepsHistory(["BUILDINGS_USE_INTRODUCTION"]).build();
      const initialRootState = store.getState();

      store.dispatch(buildingsUseIntroductionCompleted());

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "BUILDINGS_USE_SELECTION",
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
  describe("BUILDINGS_USE_SELECTION step", () => {
    it("goes to BUILDINGS_USE_SURFACE_AREA step and sets buildings uses when step is completed", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_INTRODUCTION", "BUILDINGS_USE_SELECTION"])
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsUseSelectionCompleted(["RESIDENTIAL", "ECONOMIC_ACTIVITY"]));

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "BUILDINGS_USE_SURFACE_AREA",
        creationDataDiff: {
          buildingsUses: ["RESIDENTIAL", "ECONOMIC_ACTIVITY"],
        },
      });
    });
    it("goes to previous step when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_INTRODUCTION", "BUILDINGS_USE_SELECTION"])
        .withCreationData({ buildingsUses: ["RESIDENTIAL", "MULTI_STORY_PARKING"] })
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsUseSelectionReverted());

      const newState = store.getState();
      expectRevertedState(initialRootState, newState, {
        creationDataDiff: { buildingsUses: undefined },
      });
    });
  });
  describe("BUILDINGS_USE_SURFACE_AREAs step", () => {
    it("sets buildings use surface areas and goes to BUILDINGS_ECONOMIC_ACTIVITY_SELECTION when step is completed and buildings have economic activity", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_SELECTION", "BUILDINGS_USE_SURFACE_AREA"])
        .withCreationData({ buildingsUses: ["RESIDENTIAL", "ECONOMIC_ACTIVITY"] })
        .build();
      const initialRootState = store.getState();

      store.dispatch(
        buildingsUseSurfaceAreasCompleted({
          RESIDENTIAL: 2000,
          ECONOMIC_ACTIVITY: 5000,
        }),
      );

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "BUILDINGS_ECONOMIC_ACTIVITY_SELECTION",
        creationDataDiff: {
          buildingsUsesDistribution: {
            RESIDENTIAL: 2000,
            ECONOMIC_ACTIVITY: 5000,
          },
        },
      });
    });
    it("sets buildings use surface areas and goes to BUILDINGS_EQUIPMENT_INTRODUCTION when step is completed and buildings have NO economic activity", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_SELECTION", "BUILDINGS_USE_SURFACE_AREA"])
        .withCreationData({ buildingsUses: ["RESIDENTIAL", "ECONOMIC_ACTIVITY"] })
        .build();
      const initialRootState = store.getState();

      store.dispatch(
        buildingsUseSurfaceAreasCompleted({
          RESIDENTIAL: 2000,
          MULTI_STORY_PARKING: 5000,
        }),
      );

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "BUILDINGS_EQUIPMENT_INTRODUCTION",
        creationDataDiff: {
          buildingsUsesDistribution: {
            RESIDENTIAL: 2000,
            MULTI_STORY_PARKING: 5000,
          },
        },
      });
    });
    it("goes to previous step and unsets buildings use surface areas when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_SELECTION", "BUILDINGS_USE_SURFACE_AREA"])
        .withCreationData({
          buildingsUses: ["RESIDENTIAL", "ECONOMIC_ACTIVITY"],
          buildingsUsesDistribution: {
            ECONOMIC_ACTIVITY: 12000,
          },
        })
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsUseSurfaceAreasReverted());

      const newState = store.getState();
      expectRevertedState(initialRootState, newState, {
        creationDataDiff: { buildingsUsesDistribution: undefined },
      });
    });
  });
});
