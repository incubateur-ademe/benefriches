/* eslint-disable jest/expect-expect */
import { createStore, RootState } from "@/app/application/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState } from "../createProject.reducer";
import {
  spacesIntroductionCompleted,
  spacesIntroductionReverted,
  spacesSelectionCompleted,
  spacesSelectionReverted,
  spacesSurfaceAreaCompleted,
  spacesSurfaceAreaReverted,
} from "./urbanProject.actions";
import { UrbanProjectCreationStep } from "./urbanProject.reducer";

const expectNewCurrentStep = (
  initialState: RootState,
  newState: RootState,
  expectedNewCurrentStep: UrbanProjectCreationStep,
) => {
  expect(newState.projectCreation.urbanProject.stepsHistory).toEqual([
    ...initialState.projectCreation.urbanProject.stepsHistory,
    expectedNewCurrentStep,
  ]);
};

const expectCurrentStep = (state: RootState, step: UrbanProjectCreationStep) => {
  expect(state.projectCreation.urbanProject.stepsHistory).toEqual([step]);
};

const expectStepReverted = (initialState: RootState, newState: RootState) => {
  expect(newState.projectCreation.urbanProject.stepsHistory).toEqual(
    initialState.projectCreation.urbanProject.stepsHistory.slice(0, -1),
  );
};

const expectProjectDataDiff = (
  initialState: RootState,
  newState: RootState,
  creationDataDiff: Partial<RootState["projectCreation"]["urbanProject"]["creationData"]>,
) => {
  expect(newState.projectCreation.urbanProject.creationData).toEqual({
    ...initialState.projectCreation.urbanProject.creationData,
    ...creationDataDiff,
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
    describe("SPACES_CATEGORIES_INTRODUCTION step", () => {
      it("goes to SPACES_CATEGORIES_SELECTION step when step is completed", () => {
        const store = initStoreWithState({
          urbanProject: {
            createMode: "custom",
            saveState: "idle",
            stepsHistory: ["SPACES_CATEGORIES_INTRODUCTION"],
            creationData: {},
          },
        });
        const initialRootState = store.getState();

        store.dispatch(spacesIntroductionCompleted());

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "SPACES_CATEGORIES_SELECTION");
      });

      it("goes to CREATE_MODE_SELECTION step and unsets create mode when step is reverted", () => {
        const store = initStoreWithState({
          urbanProject: {
            createMode: "custom",
            saveState: "idle",
            stepsHistory: ["SPACES_CATEGORIES_INTRODUCTION"],
            creationData: {},
          },
        });
        store.dispatch(spacesIntroductionReverted());

        const newState = store.getState();
        expectCurrentStep(newState, "CREATE_MODE_SELECTION");
        expect(newState.projectCreation.urbanProject.createMode).toBeUndefined();
      });
    });
    describe("SPACES_CATEGORIES_SELECTION step", () => {
      it("goes to SPACES_CATEGORIES_SURFACE_AREA step and sets space categories when step is completed", () => {
        const store = initStoreWithState({
          urbanProject: {
            createMode: "custom",
            saveState: "idle",
            stepsHistory: ["SPACES_CATEGORIES_INTRODUCTION", "SPACES_CATEGORIES_SELECTION"],
            creationData: {},
          },
        });
        const initialRootState = store.getState();

        store.dispatch(
          spacesSelectionCompleted({
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES", "URBAN_POND_OR_LAKE"],
          }),
        );

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "SPACES_CATEGORIES_SURFACE_AREA");
        expectProjectDataDiff(initialRootState, newState, {
          spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES", "URBAN_POND_OR_LAKE"],
        });
      });
      it("goes to previous step and unset space categories when step is reverted", () => {
        const store = initStoreWithState({
          urbanProject: {
            createMode: "custom",
            saveState: "idle",
            stepsHistory: ["SPACES_CATEGORIES_INTRODUCTION", "SPACES_CATEGORIES_SELECTION"],
            creationData: {
              spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
            },
          },
        });
        const initialRootState = store.getState();

        store.dispatch(spacesSelectionReverted());

        const newState = store.getState();
        expectStepReverted(initialRootState, newState);
        expectProjectDataDiff(initialRootState, newState, {
          spacesCategories: undefined,
        });
      });
    });
    describe("SPACES_CATEGORIES_SURFACE_AREA step", () => {
      it("sets space categories surface area distribution when step is completed", () => {
        const store = initStoreWithState({
          urbanProject: {
            createMode: "custom",
            saveState: "idle",
            stepsHistory: ["SPACES_CATEGORIES_SELECTION", "SPACES_CATEGORIES_SURFACE_AREA"],
            creationData: {},
          },
        });
        const initialRootState = store.getState();

        store.dispatch(
          spacesSurfaceAreaCompleted({
            surfaceAreaDistribution: { LIVING_AND_ACTIVITY_SPACES: 8000, GREEN_SPACES: 2000 },
          }),
        );

        const newState = store.getState();
        expectProjectDataDiff(initialRootState, newState, {
          spacesCategoriesDistribution: { LIVING_AND_ACTIVITY_SPACES: 8000, GREEN_SPACES: 2000 },
        });
      });
      it("goes to previous step and unset space categories surface area distribution when step is reverted", () => {
        const store = initStoreWithState({
          urbanProject: {
            createMode: "custom",
            saveState: "idle",
            stepsHistory: ["SPACES_CATEGORIES_SELECTION", "SPACES_CATEGORIES_SURFACE_AREA"],
            creationData: {
              spacesCategoriesDistribution: {
                LIVING_AND_ACTIVITY_SPACES: 8000,
                GREEN_SPACES: 2000,
              },
            },
          },
        });
        const initialRootState = store.getState();

        store.dispatch(spacesSurfaceAreaReverted());

        const newState = store.getState();
        expectStepReverted(initialRootState, newState);
        expectProjectDataDiff(initialRootState, newState, {
          spacesCategoriesDistribution: undefined,
        });
      });
    });
  });
});
