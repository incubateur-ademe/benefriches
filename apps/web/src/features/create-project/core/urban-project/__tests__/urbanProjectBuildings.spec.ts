/* eslint-disable jest/expect-expect */
import "../actions/urbanProject.actions";
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
} from "../actions/urbanProject.actions";
import { selectBuildingsEconomicActivitySurfaceDistributionWithUnit } from "../selectors/urbanProject.selectors";
import { expectRevertedState, expectUpdatedState, StoreBuilder } from "./testUtils";

describe("Urban project custom creation : buildings steps", () => {
  describe("actions", () => {
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
          .withStepsHistory([
            "BUILDINGS_USE_INTRODUCTION",
            "BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
          ])
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
          .withStepsHistory([
            "BUILDINGS_USE_INTRODUCTION",
            "BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
          ])
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
          .withStepsHistory([
            "BUILDINGS_USE_INTRODUCTION",
            "BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
          ])
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
  describe("selectors", () => {
    describe("selectBuildingsEconomicActivitySurfaceDistribution", () => {
      it("should return empty surface area distribution when no buildings use", () => {
        const store = new StoreBuilder()
          .withCreationData({
            buildingsUsesDistribution: undefined,
          })
          .withAppSettingInputMode("squareMeters")
          .build();

        const result = selectBuildingsEconomicActivitySurfaceDistributionWithUnit(store.getState());

        expect(result).toEqual({
          unit: "squareMeters",
          value: {},
        });
      });
      it("should return empty surface area distribution when no economic activity use", () => {
        const store = new StoreBuilder()
          .withAppSettingInputMode("squareMeters")
          .withCreationData({
            buildingsUsesDistribution: {
              RESIDENTIAL: 5000,
              MULTI_STORY_PARKING: 1000,
              SOCIO_CULTURAL_PLACE: 3500,
            },
          })
          .build();

        const result = selectBuildingsEconomicActivitySurfaceDistributionWithUnit(store.getState());

        expect(result).toEqual({
          unit: "squareMeters",
          value: {},
        });
      });
      it("returns surface area distribution with only economic activity floor use in square meters", () => {
        const store = new StoreBuilder()
          .withAppSettingInputMode("squareMeters")
          .withCreationData({
            buildingsUsesDistribution: {
              GROUND_FLOOR_RETAIL: 2000,
              RESIDENTIAL: 5000,
              SHIPPING_OR_INDUSTRIAL_BUILDINGS: 1000,
              OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS: 3000,
              SPORTS_FACILITIES: 1200,
              MULTI_STORY_PARKING: 50000,
            },
          })
          .build();

        const result = selectBuildingsEconomicActivitySurfaceDistributionWithUnit(store.getState());

        expect(result).toEqual({
          unit: "squareMeters",
          value: {
            GROUND_FLOOR_RETAIL: 2000,
            SHIPPING_OR_INDUSTRIAL_BUILDINGS: 1000,
            OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS: 3000,
          },
        });
      });
      it("returns surface area distribution with only economic activity floor use in percentage", () => {
        const store = new StoreBuilder()
          .withAppSettingInputMode("percentage")
          .withCreationData({
            buildingsUsesDistribution: {
              GROUND_FLOOR_RETAIL: 2000,
              RESIDENTIAL: 5000,
              SHIPPING_OR_INDUSTRIAL_BUILDINGS: 1000,
            },
          })
          .build();

        const result = selectBuildingsEconomicActivitySurfaceDistributionWithUnit(store.getState());

        expect(result).toEqual({
          unit: "percentage",
          value: {
            GROUND_FLOOR_RETAIL: 66.7,
            SHIPPING_OR_INDUSTRIAL_BUILDINGS: 33.3,
          },
        });
      });
    });
  });
});
