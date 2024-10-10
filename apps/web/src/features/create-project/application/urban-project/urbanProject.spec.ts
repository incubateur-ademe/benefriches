/* eslint-disable jest/expect-expect */
import { UrbanSpaceCategory } from "shared";

import { createStore, RootState } from "@/app/application/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState } from "../createProject.reducer";
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
  spacesDevelopmentPlanIntroductionCompleted,
  spacesDevelopmentPlanIntroductionReverted,
  spacesIntroductionCompleted,
  spacesIntroductionReverted,
  spacesSelectionCompleted,
  spacesSelectionReverted,
  spacesSurfaceAreaCompleted,
  spacesSurfaceAreaReverted,
} from "./urbanProject.actions";
import { UrbanProjectCreationStep } from "./urbanProject.reducer";

const expectCurrentStep = (state: RootState, step: UrbanProjectCreationStep) => {
  expect(state.projectCreation.urbanProject.stepsHistory).toEqual([step]);
};

type UpdatedStateAssertionInput = {
  creationDataDiff?: Partial<RootState["projectCreation"]["urbanProject"]["creationData"]>;
  currentStep: UrbanProjectCreationStep;
  spacesCategoriesToComplete?: RootState["projectCreation"]["urbanProject"]["spacesCategoriesToComplete"];
};
const expectUpdatedState = (
  initialState: RootState,
  updatedState: RootState,
  { creationDataDiff = {}, spacesCategoriesToComplete, currentStep }: UpdatedStateAssertionInput,
) => {
  const initialUrbanProjectState = initialState.projectCreation.urbanProject;
  const updatedUrbanProjectState = updatedState.projectCreation.urbanProject;
  expect(updatedUrbanProjectState).toEqual({
    ...initialUrbanProjectState,
    stepsHistory: [...initialState.projectCreation.urbanProject.stepsHistory, currentStep],
    spacesCategoriesToComplete:
      spacesCategoriesToComplete ?? initialUrbanProjectState.spacesCategoriesToComplete,
    creationData: {
      ...initialUrbanProjectState.creationData,
      ...creationDataDiff,
    },
  });
};

const expectRevertedState = (
  initialState: RootState,
  updatedState: RootState,
  {
    creationDataDiff = {},
    spacesCategoriesToComplete,
  }: Omit<UpdatedStateAssertionInput, "currentStep">,
) => {
  const initialUrbanProjectState = initialState.projectCreation.urbanProject;
  const updatedUrbanProjectState = updatedState.projectCreation.urbanProject;
  expect(updatedUrbanProjectState).toEqual({
    ...initialUrbanProjectState,
    stepsHistory: initialState.projectCreation.urbanProject.stepsHistory.slice(0, -1),
    spacesCategoriesToComplete:
      spacesCategoriesToComplete ?? initialUrbanProjectState.spacesCategoriesToComplete,
    creationData: {
      ...initialUrbanProjectState.creationData,
      ...creationDataDiff,
    },
  });
};

const initStoreWithState = (projectCreationState: Partial<RootState["projectCreation"]>) => {
  return createStore(getTestAppDependencies(), {
    projectCreation: {
      ...getInitialState(),
      ...projectCreationState,
    },
  });
};

describe("Urban project creation", () => {
  describe("Custom creation mode", () => {
    type CustomInitialStateParams = {
      stepsHistory?: UrbanProjectCreationStep[];
      creationData?: RootState["projectCreation"]["urbanProject"]["creationData"];
      spacesCategoriesToComplete?: UrbanSpaceCategory[];
    };
    const buildInitialState = ({
      stepsHistory = [],
      creationData = {},
      spacesCategoriesToComplete = [],
    }: CustomInitialStateParams) => {
      return initStoreWithState({
        urbanProject: {
          createMode: "custom",
          saveState: "idle",
          stepsHistory,
          creationData,
          spacesCategoriesToComplete: spacesCategoriesToComplete,
        },
      });
    };
    describe("SPACES_CATEGORIES_INTRODUCTION step", () => {
      it("goes to SPACES_CATEGORIES_SELECTION step when step is completed", () => {
        const store = buildInitialState({ stepsHistory: ["SPACES_CATEGORIES_INTRODUCTION"] });
        const initialRootState = store.getState();

        store.dispatch(spacesIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SPACES_CATEGORIES_SELECTION",
        });
      });

      it("goes to CREATE_MODE_SELECTION step and unsets create mode when step is reverted", () => {
        const store = buildInitialState({ stepsHistory: ["SPACES_CATEGORIES_INTRODUCTION"] });

        store.dispatch(spacesIntroductionReverted());

        const newState = store.getState();
        expectCurrentStep(newState, "CREATE_MODE_SELECTION");
        expect(newState.projectCreation.urbanProject.createMode).toBeUndefined();
      });
    });
    describe("SPACES_CATEGORIES_SELECTION step", () => {
      it("goes to SPACES_CATEGORIES_SURFACE_AREA step and sets space categories when step is completed", () => {
        const store = buildInitialState({
          stepsHistory: ["SPACES_CATEGORIES_INTRODUCTION", "SPACES_CATEGORIES_SELECTION"],
        });
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
        const store = buildInitialState({
          stepsHistory: ["SPACES_CATEGORIES_INTRODUCTION", "SPACES_CATEGORIES_SELECTION"],
          creationData: {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
          },
        });
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
        const store = buildInitialState({
          stepsHistory: ["SPACES_CATEGORIES_SELECTION", "SPACES_CATEGORIES_SURFACE_AREA"],
        });
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
        const store = buildInitialState({
          stepsHistory: ["SPACES_CATEGORIES_SELECTION", "SPACES_CATEGORIES_SURFACE_AREA"],
          creationData: {
            spacesCategoriesDistribution: {
              LIVING_AND_ACTIVITY_SPACES: 8000,
              GREEN_SPACES: 2000,
            },
          },
        });
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
        const store = buildInitialState({
          stepsHistory: ["SPACES_CATEGORIES_SURFACE_AREA", "SPACES_DEVELOPMENT_PLAN_INTRODUCTION"],
          spacesCategoriesToComplete: ["GREEN_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
          creationData: {
            spacesCategories: ["GREEN_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          },
        });
        const initialRootState = store.getState();

        store.dispatch(spacesDevelopmentPlanIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "GREEN_SPACES_INTRODUCTION",
          spacesCategoriesToComplete: ["LIVING_AND_ACTIVITY_SPACES"],
        });
      });
      it("goes to LIVING_AND_ACTIVITY_SPACES_INTRODUCTION when step is completed and project has living and activity spaces first in list", () => {
        const store = buildInitialState({
          stepsHistory: ["SPACES_CATEGORIES_SURFACE_AREA", "SPACES_DEVELOPMENT_PLAN_INTRODUCTION"],
          spacesCategoriesToComplete: ["LIVING_AND_ACTIVITY_SPACES", "PUBLIC_SPACES"],
          creationData: {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "PUBLIC_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          },
        });
        const initialRootState = store.getState();

        store.dispatch(spacesDevelopmentPlanIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION",
          spacesCategoriesToComplete: ["PUBLIC_SPACES"],
        });
      });
      it("goes to previous step when step is reverted", () => {
        const store = buildInitialState({
          stepsHistory: ["SPACES_CATEGORIES_SELECTION", "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION"],
          creationData: {
            greenSpaces: ["LAWNS_AND_BUSHES", "TREE_FILLED_SPACE"],
          },
        });
        const initialRootState = store.getState();

        store.dispatch(spacesDevelopmentPlanIntroductionReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {});
      });
    });
    describe("GREEN_SPACES_INTRODUCTION step", () => {
      it("goes to GREEN_SPACES_SELECTION when step is completed", () => {
        const store = buildInitialState({
          stepsHistory: ["GREEN_SPACES_INTRODUCTION"],
          creationData: {
            spacesCategories: ["GREEN_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          },
        });
        const initialRootState = store.getState();

        store.dispatch(greenSpacesIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "GREEN_SPACES_SELECTION",
        });
      });
      it("goes to previous step and add GREEN_SPACES to space categories to complete when step is reverted", () => {
        const store = buildInitialState({
          spacesCategoriesToComplete: ["LIVING_AND_ACTIVITY_SPACES"],
          stepsHistory: ["SPACES_CATEGORIES_SELECTION", "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION"],
          creationData: {
            greenSpaces: ["LAWNS_AND_BUSHES", "TREE_FILLED_SPACE"],
          },
        });
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
        const store = buildInitialState({
          stepsHistory: ["GREEN_SPACES_SELECTION"],
          creationData: {
            spacesCategories: ["GREEN_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          },
        });
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
        const store = buildInitialState({
          stepsHistory: ["GREEN_SPACES_INTRODUCTION", "GREEN_SPACES_SELECTION"],
          creationData: {
            greenSpaces: ["LAWNS_AND_BUSHES", "TREE_FILLED_SPACE"],
          },
        });
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
        const store = buildInitialState({
          stepsHistory: ["GREEN_SPACES_SELECTION", "GREEN_SPACES_SURFACE_AREA_DISTRIBUTION"],
          spacesCategoriesToComplete: ["LIVING_AND_ACTIVITY_SPACES"],
          creationData: {
            spacesCategories: ["GREEN_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          },
        });
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
        const store = buildInitialState({
          stepsHistory: ["GREEN_SPACES_SELECTION", "GREEN_SPACES_SURFACE_AREA_DISTRIBUTION"],
          spacesCategoriesToComplete: [],
          creationData: {
            spacesCategories: ["GREEN_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          },
        });
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
          currentStep: "SPACES_DEVELOPMENT_PLAN_SUMMARY",
          creationDataDiff: {
            greenSpacesDistribution: { LAWNS_AND_BUSHES: 1400, TREE_FILLED_SPACE: 600 },
          },
        });
      });
      it("goes to previous step and unset green spaces distribution step is reverted", () => {
        const store = buildInitialState({
          stepsHistory: ["GREEN_SPACES_INTRODUCTION", "GREEN_SPACES_SELECTION"],
          spacesCategoriesToComplete: ["LIVING_AND_ACTIVITY_SPACES"],
          creationData: {
            greenSpaces: ["LAWNS_AND_BUSHES", "TREE_FILLED_SPACE"],
            greenSpacesDistribution: { LAWNS_AND_BUSHES: 1400, TREE_FILLED_SPACE: 600 },
          },
        });
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
        const store = buildInitialState({
          stepsHistory: ["LIVING_AND_ACTIVITY_SPACES_INTRODUCTION"],
          creationData: {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          },
        });
        const initialRootState = store.getState();

        store.dispatch(livingAndActivitySpacesIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "LIVING_AND_ACTIVITY_SPACES_SELECTION",
        });
      });
      it("goes to previous step and add LIVING_AND_ACTIVITY_SPACES to space categories to complete when step is reverted", () => {
        const store = buildInitialState({
          spacesCategoriesToComplete: ["GREEN_SPACES"],
          stepsHistory: ["SPACES_CATEGORIES_SELECTION", "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION"],
          creationData: {
            greenSpaces: ["LAWNS_AND_BUSHES", "TREE_FILLED_SPACE"],
          },
        });
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
        const store = buildInitialState({
          stepsHistory: ["LIVING_AND_ACTIVITY_SPACES_SELECTION"],
          creationData: {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, LIVING_AND_ACTIVITY_SPACES: 8000 },
          },
        });
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
        const store = buildInitialState({
          spacesCategoriesToComplete: ["GREEN_SPACES"],
          stepsHistory: ["SPACES_CATEGORIES_SELECTION", "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION"],
          creationData: {
            livingAndActivitySpaces: [
              "BUILDINGS",
              "PAVED_ALLEY_OR_PARKING_LOT",
              "GARDEN_AND_GRASS_ALLEYS",
            ],
          },
        });
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
        const store = buildInitialState({
          stepsHistory: [
            "LIVING_AND_ACTIVITY_SPACES_SELECTION",
            "LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION",
          ],
          spacesCategoriesToComplete: ["PUBLIC_SPACES", "GREEN_SPACES"],
          creationData: {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "PUBLIC_SPACES", "GREEN_SPACES"],
            spacesCategoriesDistribution: {
              GREEN_SPACES: 1000,
              PUBLIC_SPACES: 1000,
              LIVING_AND_ACTIVITY_SPACES: 8000,
            },
          },
        });
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
        const store = buildInitialState({
          stepsHistory: [
            "LIVING_AND_ACTIVITY_SPACES_SELECTION",
            "LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION",
          ],
          spacesCategoriesToComplete: [],
          creationData: {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { LIVING_AND_ACTIVITY_SPACES: 8000 },
          },
        });
        const initialRootState = store.getState();

        store.dispatch(
          livingAndActivitySpacesDistributionCompleted({
            BUILDINGS: 5000,
            GRAVEL_ALLEY_OR_PARKING_LOT: 3000,
          }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SPACES_DEVELOPMENT_PLAN_SUMMARY",
          creationDataDiff: {
            livingAndActivitySpacesDistribution: {
              BUILDINGS: 5000,
              GRAVEL_ALLEY_OR_PARKING_LOT: 3000,
            },
          },
        });
      });
      it("goes to previous step and unset green spaces step is reverted", () => {
        const store = buildInitialState({
          stepsHistory: [
            "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION",
            "LIVING_AND_ACTIVITY_SPACES_SELECTION",
            "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION",
          ],
          creationData: {
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
          },
        });
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
        const store = buildInitialState({
          stepsHistory: ["PUBLIC_SPACES_INTRODUCTION"],
          creationData: {
            spacesCategories: ["PUBLIC_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { LIVING_AND_ACTIVITY_SPACES: 2000, PUBLIC_SPACES: 8000 },
          },
        });
        const initialRootState = store.getState();

        store.dispatch(publicSpacesIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "PUBLIC_SPACES_SELECTION",
        });
      });
      it("goes to previous step and add PUBLIC_SPACES to space categories to complete when step is reverted", () => {
        const store = buildInitialState({
          spacesCategoriesToComplete: ["LIVING_AND_ACTIVITY_SPACES"],
          stepsHistory: ["GREEN_SPACES_SURFACE_AREA_DISTRIBUTION", "PUBLIC_SPACES_INTRODUCTION"],
        });
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
        const store = buildInitialState({
          stepsHistory: ["PUBLIC_SPACES_SELECTION"],
          creationData: {
            spacesCategories: ["PUBLIC_SPACES", "LIVING_AND_ACTIVITY_SPACES"],
            spacesCategoriesDistribution: { LIVING_AND_ACTIVITY_SPACES: 2000, PUBLIC_SPACES: 8000 },
          },
        });
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
        const store = buildInitialState({
          spacesCategoriesToComplete: ["GREEN_SPACES"],
          stepsHistory: ["PUBLIC_SPACES_INTRODUCTION", "PUBLIC_SPACES_SELECTION"],
          creationData: {
            publicSpaces: ["IMPERMEABLE_SURFACE", "GRASS_COVERED_SURFACE"],
          },
        });
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
        const store = buildInitialState({
          stepsHistory: ["PUBLIC_SPACES_SELECTION", "PUBLIC_SPACES_DISTRIBUTION"],
          spacesCategoriesToComplete: ["GREEN_SPACES"],
          creationData: {
            spacesCategories: ["PUBLIC_SPACES", "GREEN_SPACES"],
            spacesCategoriesDistribution: {
              GREEN_SPACES: 1000,
              PUBLIC_SPACES: 1200,
            },
            publicSpaces: ["IMPERMEABLE_SURFACE", "GRASS_COVERED_SURFACE"],
          },
        });
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
        const store = buildInitialState({
          stepsHistory: ["PUBLIC_SPACES_SELECTION", "PUBLIC_SPACES_DISTRIBUTION"],
          spacesCategoriesToComplete: [],
          creationData: {
            spacesCategories: ["PUBLIC_SPACES"],
            spacesCategoriesDistribution: {
              PUBLIC_SPACES: 1200,
            },
            publicSpaces: ["IMPERMEABLE_SURFACE", "GRASS_COVERED_SURFACE"],
          },
        });
        const initialRootState = store.getState();

        store.dispatch(
          publicSpacesDistributionCompleted({
            GRASS_COVERED_SURFACE: 900,
            PERMEABLE_SURFACE: 300,
          }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SPACES_DEVELOPMENT_PLAN_SUMMARY",
          creationDataDiff: {
            publicSpacesDistribution: {
              GRASS_COVERED_SURFACE: 900,
              PERMEABLE_SURFACE: 300,
            },
          },
        });
      });
      it("goes to previous step and unset public spaces when step is reverted", () => {
        const store = buildInitialState({
          stepsHistory: ["PUBLIC_SPACES_SELECTION", "PUBLIC_SPACES_DISTRIBUTION"],
          creationData: {
            spacesCategories: ["PUBLIC_SPACES", "GREEN_SPACES"],
            spacesCategoriesDistribution: { GREEN_SPACES: 2000, PUBLIC_SPACES: 1200 },
            publicSpaces: ["GRASS_COVERED_SURFACE", "PERMEABLE_SURFACE"],
            publicSpacesDistribution: {
              GRASS_COVERED_SURFACE: 900,
              PERMEABLE_SURFACE: 300,
            },
          },
        });
        const initialRootState = store.getState();

        store.dispatch(publicSpacesDistributionReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: { publicSpacesDistribution: undefined },
        });
      });
    });
  });
});
