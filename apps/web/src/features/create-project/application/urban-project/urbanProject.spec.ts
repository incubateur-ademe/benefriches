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
  });
});
