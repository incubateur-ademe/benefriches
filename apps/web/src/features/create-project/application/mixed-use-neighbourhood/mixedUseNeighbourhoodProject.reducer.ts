import { ProjectCreationState } from "../createProject.reducer";
import {
  createModeSelected,
  createModeStepReverted,
  MixedUseNeighbourhoodAction,
} from "./mixedUseNeighbourhoodProject.actions";

export type MixedUseNeighbourhoodState = {
  createMode: "express" | "custom" | undefined;
  stepsHistory: MixedUseNeighbourhoodCreationStep[];
};

export type MixedUseNeighbourhoodCreationStep = "CREATE_MODE_SELECTION" | "CREATION_CONFIRMATION";

export const getInitialState = (): MixedUseNeighbourhoodState => {
  return {
    createMode: undefined,
    stepsHistory: ["CREATE_MODE_SELECTION"],
  };
};

const mixedUseNeighbourhoodReducer = (
  parentState: ProjectCreationState,
  action: MixedUseNeighbourhoodAction,
): ProjectCreationState["mixedUseNeighbourhood"] => {
  switch (action.type) {
    case createModeSelected.type:
      return {
        ...parentState.mixedUseNeighbourhood,
        createMode: action.payload,
      };
    case createModeStepReverted.type:
      return {
        ...parentState.mixedUseNeighbourhood,
        createMode: undefined,
      };
    default:
      return parentState.mixedUseNeighbourhood;
  }
};

export default mixedUseNeighbourhoodReducer;
