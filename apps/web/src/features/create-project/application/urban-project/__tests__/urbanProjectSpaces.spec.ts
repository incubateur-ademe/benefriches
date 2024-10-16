/* eslint-disable jest/expect-expect */
import {
  greenSpacesDistributionCompleted,
  greenSpacesDistributionReverted,
  greenSpacesIntroductionCompleted,
  greenSpacesIntroductionReverted,
  greenSpacesSelectionCompleted,
  greenSpacesSelectionReverted,
  livingAndActivitySpacesDistributionCompleted,
  livingAndActivitySpacesDistributionReverted,
  livingAndActivitySpacesIntroductionCompleted,
  livingAndActivitySpacesIntroductionReverted,
  livingAndActivitySpacesSelectionCompleted,
  livingAndActivitySpacesSelectionReverted,
  publicSpacesDistributionCompleted,
  publicSpacesDistributionReverted,
  publicSpacesIntroductionCompleted,
  publicSpacesIntroductionReverted,
  publicSpacesSelectionCompleted,
  publicSpacesSelectionReverted,
  soilsCarbonStorageCompleted,
  spacesDevelopmentPlanIntroductionCompleted,
  spacesDevelopmentPlanIntroductionReverted,
  spacesIntroductionCompleted,
  spacesIntroductionReverted,
  spacesSelectionCompleted,
  spacesSelectionReverted,
  spacesSurfaceAreaCompleted,
  spacesSurfaceAreaReverted,
} from "../urbanProject.actions";
import {
  expectCurrentStep,
  expectUpdatedState,
  expectRevertedState,
  StoreBuilder,
} from "./testUtils";

describe("Urban project creation : introduction and spaces steps", () => {
  describe("Custom creation mode", () => {
    describe("SPACES_CATEGORIES_INTRODUCTION step", () => {
      it("goes to SPACES_CATEGORIES_SELECTION step when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SPACES_CATEGORIES_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(spacesIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SPACES_CATEGORIES_SELECTION",
        });
      });

      it("goes to CREATE_MODE_SELECTION step and unsets create mode when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SPACES_CATEGORIES_INTRODUCTION"])
          .build();

        store.dispatch(spacesIntroductionReverted());

        const newState = store.getState();
        expectCurrentStep(newState, "CREATE_MODE_SELECTION");
        expect(newState.projectCreation.urbanProject.createMode).toBeUndefined();
      });
    });
    describe("SPACES_CATEGORIES_SELECTION step", () => {
      it("goes to SPACES_CATEGORIES_SURFACE_AREA step and sets space categories when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SPACES_CATEGORIES_INTRODUCTION", "SPACES_CATEGORIES_SELECTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          spacesSelectionCompleted({
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES", "URBAN_POND_OR_LAKE"],
          }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SPACES_CATEGORIES_SURFACE_AREA",
          spacesCategoriesToComplete: [
            "LIVING_AND_ACTIVITY_SPACES",
            "GREEN_SPACES",
            "URBAN_POND_OR_LAKE",
          ],
          creationDataDiff: {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES", "URBAN_POND_OR_LAKE"],
          },
        });
      });
      it("goes to previous step and unset space categories when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SPACES_CATEGORIES_INTRODUCTION", "SPACES_CATEGORIES_SELECTION"])
          .withCreationData({
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(spacesSelectionReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            spacesCategories: undefined,
          },
        });
      });
    });
    describe("SPACES_CATEGORIES_SURFACE_AREA step", () => {
      it("goes to SPACES_DEVELOPMENT_PLAN_INTRODUCTION and sets space categories surface area distribution when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SPACES_CATEGORIES_SELECTION", "SPACES_CATEGORIES_SURFACE_AREA"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          spacesSurfaceAreaCompleted({
            surfaceAreaDistribution: { LIVING_AND_ACTIVITY_SPACES: 8000, GREEN_SPACES: 2000 },
          }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
          creationDataDiff: {
            spacesCategoriesDistribution: { LIVING_AND_ACTIVITY_SPACES: 8000, GREEN_SPACES: 2000 },
          },
        });
      });
      it("goes to previous step and unset space categories surface area distribution when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SPACES_CATEGORIES_SELECTION", "SPACES_CATEGORIES_SURFACE_AREA"])
          .withCreationData({
            spacesCategoriesDistribution: {
              LIVING_AND_ACTIVITY_SPACES: 8000,
              GREEN_SPACES: 2000,
            },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(spacesSurfaceAreaReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            spacesCategoriesDistribution: undefined,
          },
        });
      });
    });
    describe("SPACES_DEVELOPMENT_PLAN_INTRODUCTION step", () => {
      it("goes to GREEN_SPACES_INTRODUCTION when step is completed and project has green spaces first in list", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "SPACES_CATEGORIES_SURFACE_AREA",
            "SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
          ])
          .withSpacesCategoriesToComplete(["GREEN_SPACES", "LIVING_AND_ACTIVITY_SPACES"])
          .withCreationData({
            spacesCategories: ["GREEN_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(spacesDevelopmentPlanIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "GREEN_SPACES_INTRODUCTION",
          spacesCategoriesToComplete: ["LIVING_AND_ACTIVITY_SPACES"],
        });
      });
      it("goes to LIVING_AND_ACTIVITY_SPACES_INTRODUCTION when step is completed and project has living and activity spaces first in list", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "SPACES_CATEGORIES_SURFACE_AREA",
            "SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
          ])
          .withSpacesCategoriesToComplete(["LIVING_AND_ACTIVITY_SPACES", "PUBLIC_SPACES"])
          .withCreationData({
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "PUBLIC_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(spacesDevelopmentPlanIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION",
          spacesCategoriesToComplete: ["PUBLIC_SPACES"],
        });
      });
      it("goes to previous step when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "SPACES_CATEGORIES_SELECTION",
            "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION",
          ])
          .withCreationData({
            greenSpaces: ["LAWNS_AND_BUSHES", "TREE_FILLED_SPACE"],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(spacesDevelopmentPlanIntroductionReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {});
      });
    });
    describe("GREEN_SPACES_INTRODUCTION step", () => {
      it("goes to GREEN_SPACES_SELECTION when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["GREEN_SPACES_INTRODUCTION"])
          .withCreationData({
            spacesCategories: ["GREEN_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(greenSpacesIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "GREEN_SPACES_SELECTION",
        });
      });
      it("goes to previous step and add GREEN_SPACES to space categories to complete when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "SPACES_CATEGORIES_SELECTION",
            "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION",
          ])
          .withSpacesCategoriesToComplete(["LIVING_AND_ACTIVITY_SPACES"])
          .withCreationData({
            greenSpaces: ["LAWNS_AND_BUSHES", "TREE_FILLED_SPACE"],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(greenSpacesIntroductionReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          spacesCategoriesToComplete: ["GREEN_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
        });
      });
    });
    describe("GREEN_SPACES_SELECTION step", () => {
      it("goes to GREEN_SPACES_SURFACE_AREA_DISTRIBUTION and sets green spaces when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["GREEN_SPACES_SELECTION"])
          .withCreationData({
            spacesCategories: ["GREEN_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          greenSpacesSelectionCompleted({ greenSpaces: ["LAWNS_AND_BUSHES", "TREE_FILLED_SPACE"] }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
          creationDataDiff: { greenSpaces: ["LAWNS_AND_BUSHES", "TREE_FILLED_SPACE"] },
        });
      });
      it("goes to previous step and unset green spaces step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["GREEN_SPACES_INTRODUCTION", "GREEN_SPACES_SELECTION"])
          .withCreationData({
            greenSpaces: ["LAWNS_AND_BUSHES", "TREE_FILLED_SPACE"],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(greenSpacesSelectionReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: { greenSpaces: undefined },
        });
      });
    });
    describe("GREEN_SPACES_SURFACE_AREA_DISTRIBUTION step", () => {
      it("sets green spaces surface areas and goes to next spaces category introduction step when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["GREEN_SPACES_SELECTION", "GREEN_SPACES_SURFACE_AREA_DISTRIBUTION"])
          .withSpacesCategoriesToComplete(["LIVING_AND_ACTIVITY_SPACES"])
          .withCreationData({
            spacesCategories: ["GREEN_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          greenSpacesDistributionCompleted({
            surfaceAreaDistribution: {
              LAWNS_AND_BUSHES: 1400,
              TREE_FILLED_SPACE: 600,
            },
          }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION",
          spacesCategoriesToComplete: [],
          creationDataDiff: {
            greenSpacesDistribution: { LAWNS_AND_BUSHES: 1400, TREE_FILLED_SPACE: 600 },
          },
        });
      });
      it("sets green spaces surface areas and goes to spaces summary step when step is completed and no more space category to complete", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["GREEN_SPACES_SELECTION", "GREEN_SPACES_SURFACE_AREA_DISTRIBUTION"])
          .withCreationData({
            spacesCategories: ["GREEN_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          greenSpacesDistributionCompleted({
            surfaceAreaDistribution: {
              LAWNS_AND_BUSHES: 1400,
              TREE_FILLED_SPACE: 600,
            },
          }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SPACES_SOILS_SUMMARY",
          creationDataDiff: {
            greenSpacesDistribution: { LAWNS_AND_BUSHES: 1400, TREE_FILLED_SPACE: 600 },
          },
        });
      });
      it("goes to previous step and unset green spaces distribution step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["GREEN_SPACES_INTRODUCTION", "GREEN_SPACES_SELECTION"])
          .withSpacesCategoriesToComplete(["LIVING_AND_ACTIVITY_SPACES"])
          .withCreationData({
            greenSpaces: ["LAWNS_AND_BUSHES", "TREE_FILLED_SPACE"],
            greenSpacesDistribution: { LAWNS_AND_BUSHES: 1400, TREE_FILLED_SPACE: 600 },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(greenSpacesDistributionReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: { greenSpacesDistribution: undefined },
        });
      });
    });
    describe("LIVING_AND_ACTIVITY_SPACES_INTRODUCTION step", () => {
      it("goes to LIVING_AND_ACTIVITY_SPACES_SELECTION when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["LIVING_AND_ACTIVITY_SPACES_INTRODUCTION"])
          .withCreationData({
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(livingAndActivitySpacesIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "LIVING_AND_ACTIVITY_SPACES_SELECTION",
        });
      });
      it("goes to previous step and add LIVING_AND_ACTIVITY_SPACES to space categories to complete when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "SPACES_CATEGORIES_SELECTION",
            "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION",
          ])
          .withSpacesCategoriesToComplete(["GREEN_SPACES"])
          .withCreationData({
            greenSpaces: ["LAWNS_AND_BUSHES", "TREE_FILLED_SPACE"],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(livingAndActivitySpacesIntroductionReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          spacesCategoriesToComplete: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
        });
      });
    });
    describe("LIVING_AND_ACTIVITY_SPACES_SELECTION step", () => {
      it("goes to LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION and sets living/activity spaces when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["LIVING_AND_ACTIVITY_SPACES_SELECTION"])
          .withCreationData({
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          livingAndActivitySpacesSelectionCompleted([
            "BUILDINGS",
            "PAVED_ALLEY_OR_PARKING_LOT",
            "GARDEN_AND_GRASS_ALLEYS",
          ]),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION",
          creationDataDiff: {
            livingAndActivitySpaces: [
              "BUILDINGS",
              "PAVED_ALLEY_OR_PARKING_LOT",
              "GARDEN_AND_GRASS_ALLEYS",
            ],
          },
        });
      });
      it("goes to previous step and unset living/activity spaces when step is reverted", () => {
        const store = new StoreBuilder()
          .withSpacesCategoriesToComplete(["GREEN_SPACES"])
          .withStepsHistory([
            "SPACES_CATEGORIES_SELECTION",
            "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION",
          ])
          .withCreationData({
            livingAndActivitySpaces: [
              "BUILDINGS",
              "PAVED_ALLEY_OR_PARKING_LOT",
              "GARDEN_AND_GRASS_ALLEYS",
            ],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(livingAndActivitySpacesSelectionReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: { livingAndActivitySpaces: undefined },
        });
      });
    });
    describe("LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION step", () => {
      it("sets living/activity spaces surface areas and goes to next spaces category introduction step when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "LIVING_AND_ACTIVITY_SPACES_SELECTION",
            "LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION",
          ])
          .withSpacesCategoriesToComplete(["PUBLIC_SPACES", "GREEN_SPACES"])
          .withCreationData({
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "PUBLIC_SPACES", "GREEN_SPACES"],
            spacesCategoriesDistribution: {
              GREEN_SPACES: 1000,
              PUBLIC_SPACES: 1000,
              LIVING_AND_ACTIVITY_SPACES: 8000,
            },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          livingAndActivitySpacesDistributionCompleted({
            BUILDINGS: 5000,
            GRAVEL_ALLEY_OR_PARKING_LOT: 3000,
          }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "PUBLIC_SPACES_INTRODUCTION",
          spacesCategoriesToComplete: ["GREEN_SPACES"],
          creationDataDiff: {
            livingAndActivitySpacesDistribution: {
              BUILDINGS: 5000,
              GRAVEL_ALLEY_OR_PARKING_LOT: 3000,
            },
          },
        });
      });
      it("sets living/activity spaces surface areas and goes to spaces summary step when step is completed and no more space category to complete", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "LIVING_AND_ACTIVITY_SPACES_SELECTION",
            "LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION",
          ])
          .withCreationData({
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { LIVING_AND_ACTIVITY_SPACES: 8000 },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          livingAndActivitySpacesDistributionCompleted({
            BUILDINGS: 5000,
            GRAVEL_ALLEY_OR_PARKING_LOT: 3000,
          }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SPACES_SOILS_SUMMARY",
          creationDataDiff: {
            livingAndActivitySpacesDistribution: {
              BUILDINGS: 5000,
              GRAVEL_ALLEY_OR_PARKING_LOT: 3000,
            },
          },
        });
      });
      it("goes to previous step and unset green spaces step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION",
            "LIVING_AND_ACTIVITY_SPACES_SELECTION",
            "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION",
          ])
          .withCreationData({
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
            livingAndActivitySpaces: [
              "BUILDINGS",
              "PAVED_ALLEY_OR_PARKING_LOT",
              "GARDEN_AND_GRASS_ALLEYS",
            ],
            livingAndActivitySpacesDistribution: {
              BUILDINGS: 2000,
              PAVED_ALLEY_OR_PARKING_LOT: 3000,
              GARDEN_AND_GRASS_ALLEYS: 3000,
            },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(livingAndActivitySpacesDistributionReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: { livingAndActivitySpacesDistribution: undefined },
        });
      });
    });
    describe("PUBLIC_SPACES_INTRODUCTION step", () => {
      it("goes to PUBLIC_SPACES_SELECTION when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["PUBLIC_SPACES_INTRODUCTION"])
          .withCreationData({
            spacesCategories: ["PUBLIC_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { LIVING_AND_ACTIVITY_SPACES: 2000, PUBLIC_SPACES: 8000 },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(publicSpacesIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "PUBLIC_SPACES_SELECTION",
        });
      });
      it("goes to previous step and add PUBLIC_SPACES to space categories to complete when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
            "PUBLIC_SPACES_INTRODUCTION",
          ])
          .withSpacesCategoriesToComplete(["LIVING_AND_ACTIVITY_SPACES"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(publicSpacesIntroductionReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          spacesCategoriesToComplete: ["PUBLIC_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
        });
      });
    });
    describe("PUBLIC_SPACES_SELECTION step", () => {
      it("goes to PUBLIC_SPACES_DISTRIBUTION and sets public spaces when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["PUBLIC_SPACES_SELECTION"])
          .withCreationData({
            spacesCategories: ["PUBLIC_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { LIVING_AND_ACTIVITY_SPACES: 2000, PUBLIC_SPACES: 8000 },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          publicSpacesSelectionCompleted(["IMPERMEABLE_SURFACE", "GRASS_COVERED_SURFACE"]),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "PUBLIC_SPACES_DISTRIBUTION",
          creationDataDiff: {
            publicSpaces: ["IMPERMEABLE_SURFACE", "GRASS_COVERED_SURFACE"],
          },
        });
      });
      it("goes to previous step and unset public spaces when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["PUBLIC_SPACES_INTRODUCTION", "PUBLIC_SPACES_SELECTION"])
          .withSpacesCategoriesToComplete(["GREEN_SPACES"])
          .withCreationData({
            publicSpaces: ["IMPERMEABLE_SURFACE", "GRASS_COVERED_SURFACE"],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(publicSpacesSelectionReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: { publicSpaces: undefined },
        });
      });
    });
    describe("PUBLIC_SPACES_DISTRIBUTION step", () => {
      it("sets public spaces surface areas and goes to next spaces category introduction step when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["PUBLIC_SPACES_SELECTION", "PUBLIC_SPACES_DISTRIBUTION"])
          .withSpacesCategoriesToComplete(["GREEN_SPACES"])
          .withCreationData({
            spacesCategories: ["PUBLIC_SPACES", "GREEN_SPACES"],
            spacesCategoriesDistribution: {
              GREEN_SPACES: 1000,
              PUBLIC_SPACES: 1200,
            },
            publicSpaces: ["IMPERMEABLE_SURFACE", "GRASS_COVERED_SURFACE"],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          publicSpacesDistributionCompleted({
            GRASS_COVERED_SURFACE: 900,
            PERMEABLE_SURFACE: 300,
          }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "GREEN_SPACES_INTRODUCTION",
          spacesCategoriesToComplete: [],
          creationDataDiff: {
            publicSpacesDistribution: {
              GRASS_COVERED_SURFACE: 900,
              PERMEABLE_SURFACE: 300,
            },
          },
        });
      });
      it("sets public spaces surface areas and goes to spaces summary step when step is completed and no more space category to complete", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["PUBLIC_SPACES_SELECTION", "PUBLIC_SPACES_DISTRIBUTION"])
          .withCreationData({
            spacesCategories: ["PUBLIC_SPACES"],
            spacesCategoriesDistribution: {
              PUBLIC_SPACES: 1200,
            },
            publicSpaces: ["IMPERMEABLE_SURFACE", "GRASS_COVERED_SURFACE"],
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          publicSpacesDistributionCompleted({
            GRASS_COVERED_SURFACE: 900,
            PERMEABLE_SURFACE: 300,
          }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SPACES_SOILS_SUMMARY",
          creationDataDiff: {
            publicSpacesDistribution: {
              GRASS_COVERED_SURFACE: 900,
              PERMEABLE_SURFACE: 300,
            },
          },
        });
      });
      it("goes to previous step and unset public spaces when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["PUBLIC_SPACES_SELECTION", "PUBLIC_SPACES_DISTRIBUTION"])
          .withCreationData({
            spacesCategories: ["PUBLIC_SPACES", "GREEN_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, PUBLIC_SPACES: 1200 },
            publicSpaces: ["GRASS_COVERED_SURFACE", "PERMEABLE_SURFACE"],
            publicSpacesDistribution: {
              GRASS_COVERED_SURFACE: 900,
              PERMEABLE_SURFACE: 300,
            },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(publicSpacesDistributionReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: { publicSpacesDistribution: undefined },
        });
      });
    });
    describe("SOILS_CARBON_SUMMARY", () => {
      it("goes to SOILS_DECONTAMINATION_INTRODUCTION when site has contaminated soils and step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SOILS_CARBON_SUMMARY"])
          .withSiteData({ contaminatedSoilSurface: 150 })
          .build();
        const initialRootState = store.getState();

        store.dispatch(soilsCarbonStorageCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SOILS_DECONTAMINATION_INTRODUCTION",
        });
      });
      it("goes to BUILDINGS_INTRODUCTION when site has no contamination and step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["SOILS_CARBON_SUMMARY"]).build();
        const initialRootState = store.getState();

        store.dispatch(soilsCarbonStorageCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "BUILDINGS_INTRODUCTION",
        });
      });
    });
  });
});
