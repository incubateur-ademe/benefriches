import { createReducer } from "@reduxjs/toolkit";
import { ProjectCreationState } from "../createProject.reducer";
import {
  confirmationStepReverted,
  createModeStepReverted,
  expressCreateModeSelected,
} from "./mixedUseNeighbourhoodProject.actions";

export type MixedUseNeighbourhoodCreationStep = "CREATE_MODE_SELECTION" | "CREATION_RESULT";

export type MixedUseNeighbourhoodState = {
  createMode: "express" | "custom" | undefined;
  saveState: "idle" | "loading" | "success" | "error";
  stepsHistory: MixedUseNeighbourhoodCreationStep[];
};

const mixedUseNeighbourhoodReducer = createReducer({} as ProjectCreationState, (builder) => {
  builder.addCase(createModeStepReverted, (state) => {
    state.mixedUseNeighbourhood.createMode = undefined;
  });
  builder.addCase(expressCreateModeSelected.pending, (state) => {
    state.mixedUseNeighbourhood.createMode = "express";
    state.mixedUseNeighbourhood.saveState = "loading";
    state.mixedUseNeighbourhood.stepsHistory.push("CREATION_RESULT");
  });
  builder.addCase(expressCreateModeSelected.rejected, (state) => {
    state.mixedUseNeighbourhood.saveState = "error";
  });
  builder.addCase(expressCreateModeSelected.fulfilled, (state) => {
    state.mixedUseNeighbourhood.saveState = "success";
  });
  builder.addCase(confirmationStepReverted, (state) => {
    state.mixedUseNeighbourhood.stepsHistory = state.mixedUseNeighbourhood.stepsHistory.slice(
      0,
      -1,
    );
  });
});

export default mixedUseNeighbourhoodReducer;
