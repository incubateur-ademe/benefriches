/* eslint-disable jest/expect-expect */
import "../urbanProject.actions";
import {
  buildingsFloorSurfaceAreaCompleted,
  buildingsFloorSurfaceAreaReverted,
  buildingsIntroductionCompleted,
  buildingsIntroductionReverted,
  buildingsUseIntroductionCompleted,
  buildingsUseIntroductionReverted,
  buildingsUseCategorySelectionCompleted,
  buildingsUseCategorySelectionReverted,
  buildingsUseCategorySurfaceAreasCompleted,
  buildingsUseCategorySurfaceAreasReverted,
  buildingsEconomicActivitySelectionCompleted,
  buildingsEconomicActivitySelectionReverted,
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
    it("goes to BUILDINGS_ECONOMIC_ACTIVITY_SELECTION step and sets buildings uses when step is completed with only ECONOMIC_ACTIVITY category", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_INTRODUCTION", "BUILDINGS_USE_SELECTION"])
        .withCreationData({ buildingsFloorSurfaceArea: 10000 })
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsUseCategorySelectionCompleted(["ECONOMIC_ACTIVITY"]));

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "BUILDINGS_ECONOMIC_ACTIVITY_SELECTION",
        creationDataDiff: {
          buildingsUseCategories: ["ECONOMIC_ACTIVITY"],
          buildingsUseCategoriesDistribution: { ECONOMIC_ACTIVITY: 10000 },
        },
      });
    });
    it("goes to STAKEHOLDERS_INTRODUCTION step and sets buildings uses when step is completed with only RESIDENTIAL category", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_INTRODUCTION", "BUILDINGS_USE_SELECTION"])
        .withCreationData({ buildingsFloorSurfaceArea: 10000 })

        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsUseCategorySelectionCompleted(["RESIDENTIAL"]));

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "STAKEHOLDERS_INTRODUCTION",
        creationDataDiff: {
          buildingsUseCategories: ["RESIDENTIAL"],
          buildingsUses: ["RESIDENTIAL"],
          buildingsUsesDistribution: { RESIDENTIAL: 10000 },
          buildingsUseCategoriesDistribution: { RESIDENTIAL: 10000 },
        },
      });
    });
    it("goes to BUILDINGS_USE_SURFACE_AREA step and sets buildings uses when step is completed", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_INTRODUCTION", "BUILDINGS_USE_SELECTION"])
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsUseCategorySelectionCompleted(["RESIDENTIAL", "ECONOMIC_ACTIVITY"]));

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "BUILDINGS_USE_SURFACE_AREA",
        creationDataDiff: {
          buildingsUseCategories: ["RESIDENTIAL", "ECONOMIC_ACTIVITY"],
          buildingsUses: ["RESIDENTIAL"],
        },
      });
    });
    it("goes to previous step when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_INTRODUCTION", "BUILDINGS_USE_SELECTION"])
        .withCreationData({
          buildingsUseCategories: ["RESIDENTIAL", "MULTI_STORY_PARKING"],
          buildingsUses: ["RESIDENTIAL", "MULTI_STORY_PARKING"],
        })
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsUseCategorySelectionReverted());

      const newState = store.getState();
      expectRevertedState(initialRootState, newState, {
        creationDataDiff: { buildingsUses: undefined, buildingsUseCategories: undefined },
      });
    });
    it("goes to previous step and revert buildingsUses, buildingsUseCategories and buildingsUsesDistribution when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_INTRODUCTION", "BUILDINGS_USE_SELECTION"])
        .withCreationData({
          buildingsUseCategories: ["RESIDENTIAL"],
          buildingsUses: ["RESIDENTIAL"],
          buildingsUsesDistribution: { RESIDENTIAL: 10000 },
          buildingsUseCategoriesDistribution: { RESIDENTIAL: 10000 },
          buildingsFloorSurfaceArea: 10000,
        })
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsUseCategorySelectionReverted());

      const newState = store.getState();
      expectRevertedState(initialRootState, newState, {
        creationDataDiff: {
          buildingsUses: undefined,
          buildingsUseCategories: undefined,
          buildingsUsesDistribution: undefined,
          buildingsUseCategoriesDistribution: undefined,
        },
      });
    });
  });
  describe("BUILDINGS_USE_SURFACE_AREAs step", () => {
    it("sets buildings use surface areas and goes to BUILDINGS_ECONOMIC_ACTIVITY_SELECTION when step is completed and buildings have economic activity", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_SELECTION", "BUILDINGS_USE_SURFACE_AREA"])
        .withCreationData({
          buildingsUseCategories: ["RESIDENTIAL", "ECONOMIC_ACTIVITY"],
          buildingsUses: ["RESIDENTIAL"],
        })
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
        currentStep: "BUILDINGS_ECONOMIC_ACTIVITY_SELECTION",
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
        .withStepsHistory(["BUILDINGS_USE_SELECTION", "BUILDINGS_USE_SURFACE_AREA"])
        .withCreationData({
          buildingsUseCategories: ["RESIDENTIAL", "ECONOMIC_ACTIVITY"],
          buildingsUses: ["RESIDENTIAL"],
        })
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
        .withStepsHistory(["BUILDINGS_USE_SELECTION", "BUILDINGS_USE_SURFACE_AREA"])
        .withCreationData({
          buildingsUseCategories: ["RESIDENTIAL", "ECONOMIC_ACTIVITY"],
          buildingsUses: ["RESIDENTIAL"],
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
  describe("BUILDINGS_ECONOMIC_ACTIVITY_SELECTION step", () => {
    it("goes to STAKEHOLDERS_INTRODUCTION step and sets buildings economic activity selection when step is completed with only one category", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_ECONOMIC_ACTIVITY_SELECTION"])
        .withCreationData({
          buildingsFloorSurfaceArea: 10000,
          buildingsUseCategories: ["ECONOMIC_ACTIVITY", "RESIDENTIAL"],
          buildingsUseCategoriesDistribution: { ECONOMIC_ACTIVITY: 5000, RESIDENTIAL: 5000 },
          buildingsUses: ["RESIDENTIAL"],
          buildingsUsesDistribution: { RESIDENTIAL: 5000 },
        })
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsEconomicActivitySelectionCompleted(["GROUND_FLOOR_RETAIL"]));

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "STAKEHOLDERS_INTRODUCTION",
        creationDataDiff: {
          buildingsEconomicActivityUses: ["GROUND_FLOOR_RETAIL"],
          buildingsUses: ["RESIDENTIAL", "GROUND_FLOOR_RETAIL"],
          buildingsUsesDistribution: { GROUND_FLOOR_RETAIL: 5000, RESIDENTIAL: 5000 },
        },
      });
    });
    it("goes to BUILDINGS_USE_SURFACE_AREA step and sets buildings economic activity uses when step is completed", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_ECONOMIC_ACTIVITY_SELECTION"])
        .withCreationData({
          buildingsFloorSurfaceArea: 10000,
          buildingsUseCategories: ["ECONOMIC_ACTIVITY", "RESIDENTIAL"],
          buildingsUseCategoriesDistribution: { ECONOMIC_ACTIVITY: 5000, RESIDENTIAL: 5000 },
          buildingsUses: ["RESIDENTIAL"],
          buildingsUsesDistribution: { RESIDENTIAL: 5000 },
        })
        .build();
      const initialRootState = store.getState();

      store.dispatch(
        buildingsEconomicActivitySelectionCompleted([
          "GROUND_FLOOR_RETAIL",
          "SHIPPING_OR_INDUSTRIAL_BUILDINGS",
        ]),
      );

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA",
        creationDataDiff: {
          buildingsEconomicActivityUses: [
            "GROUND_FLOOR_RETAIL",
            "SHIPPING_OR_INDUSTRIAL_BUILDINGS",
          ],
          buildingsUseCategories: ["ECONOMIC_ACTIVITY", "RESIDENTIAL"],
          buildingsUses: ["RESIDENTIAL", "GROUND_FLOOR_RETAIL", "SHIPPING_OR_INDUSTRIAL_BUILDINGS"],
        },
      });
    });
    it("goes to previous step when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_SURFACE_AREA", "BUILDINGS_ECONOMIC_ACTIVITY_SELECTION"])
        .withCreationData({
          buildingsUseCategories: ["RESIDENTIAL", "MULTI_STORY_PARKING", "ECONOMIC_ACTIVITY"],
          buildingsUses: ["RESIDENTIAL", "MULTI_STORY_PARKING"],
        })
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsEconomicActivitySelectionReverted());

      const newState = store.getState();
      expectRevertedState(initialRootState, newState, {
        creationDataDiff: {
          buildingsEconomicActivityUses: undefined,
          buildingsUses: ["RESIDENTIAL", "MULTI_STORY_PARKING"],
        },
      });
    });
    it("goes to previous step and revert buildingsEconomicActivityUses and buildingsEconomicActivityDistribution when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["BUILDINGS_USE_SURFACE_AREA", "BUILDINGS_ECONOMIC_ACTIVITY_SELECTION"])
        .withCreationData({
          buildingsEconomicActivityUses: ["GROUND_FLOOR_RETAIL"],
          buildingsUses: ["GROUND_FLOOR_RETAIL", "RESIDENTIAL"],
          buildingsUsesDistribution: { GROUND_FLOOR_RETAIL: 5000, RESIDENTIAL: 5000 },
        })
        .build();
      const initialRootState = store.getState();

      store.dispatch(buildingsEconomicActivitySelectionReverted());

      const newState = store.getState();
      expectRevertedState(initialRootState, newState, {
        creationDataDiff: {
          buildingsEconomicActivityUses: undefined,
          buildingsUses: ["RESIDENTIAL"],
          buildingsUsesDistribution: { RESIDENTIAL: 5000 },
        },
      });
    });
  });
  describe("BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA step", () => {
    it("sets buildings  economic activity use surface areas and goes to STAKEHOLDERS_INTRODUCTION when step is completed", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "BUILDINGS_ECONOMIC_ACTIVITY_SELECTION",
          "BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA",
        ])
        .withCreationData({
          buildingsEconomicActivityUses: [
            "GROUND_FLOOR_RETAIL",
            "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS",
          ],
          buildingsUses: [
            "GROUND_FLOOR_RETAIL",
            "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS",
            "RESIDENTIAL",
          ],
          buildingsUsesDistribution: { RESIDENTIAL: 5000 },
          buildingsUseCategoriesDistribution: { RESIDENTIAL: 5000, ECONOMIC_ACTIVITY: 5000 },
          buildingsFloorSurfaceArea: 10000,
          buildingsUseCategories: ["ECONOMIC_ACTIVITY", "RESIDENTIAL"],
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
          "BUILDINGS_ECONOMIC_ACTIVITY_SELECTION",
          "BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA",
        ])
        .withCreationData({
          buildingsEconomicActivityUses: [
            "GROUND_FLOOR_RETAIL",
            "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS",
          ],
          buildingsUses: [
            "GROUND_FLOOR_RETAIL",
            "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS",
            "RESIDENTIAL",
          ],
          buildingsUsesDistribution: {
            RESIDENTIAL: 5000,
            GROUND_FLOOR_RETAIL: 2000,
            OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS: 3000,
          },
          buildingsUseCategoriesDistribution: { RESIDENTIAL: 5000, ECONOMIC_ACTIVITY: 5000 },
          buildingsFloorSurfaceArea: 10000,
          buildingsUseCategories: ["ECONOMIC_ACTIVITY", "RESIDENTIAL"],
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
