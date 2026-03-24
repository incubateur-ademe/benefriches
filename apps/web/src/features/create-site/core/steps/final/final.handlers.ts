import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../../createSite.reducer";
import { urbanZoneSiteSaved } from "../../urban-zone/urbanZoneSiteSaved.action";
import { customSiteSaved, expressSiteSaved } from "./final.actions";

export const registerFinalHandlers = (
  builder: ActionReducerMapBuilder<SiteCreationState>,
): void => {
  builder
    .addCase(customSiteSaved.pending, (state) => {
      state.stepsHistory.push("CREATION_RESULT");
      state.saveLoadingState = "loading";
    })
    .addCase(customSiteSaved.fulfilled, (state) => {
      state.saveLoadingState = "success";
    })
    .addCase(customSiteSaved.rejected, (state) => {
      state.saveLoadingState = "error";
    })
    .addCase(urbanZoneSiteSaved.pending, (state) => {
      state.urbanZone.currentStep = "URBAN_ZONE_CREATION_RESULT";
      state.urbanZone.saveState = "loading";
      // NavigationBlockerDialog still keys off the legacy top-level save state,
      // so urban-zone saves must mirror their status there until that dialog is specialized.
      state.saveLoadingState = "loading";
    })
    .addCase(urbanZoneSiteSaved.fulfilled, (state) => {
      state.urbanZone.saveState = "success";
      state.saveLoadingState = "success";
    })
    .addCase(urbanZoneSiteSaved.rejected, (state) => {
      state.urbanZone.saveState = "error";
      state.saveLoadingState = "error";
    })
    .addCase(expressSiteSaved.pending, (state) => {
      state.stepsHistory.push("CREATION_RESULT");
      state.saveLoadingState = "loading";
    })
    .addCase(expressSiteSaved.fulfilled, (state) => {
      state.saveLoadingState = "success";
    })
    .addCase(expressSiteSaved.rejected, (state) => {
      state.saveLoadingState = "error";
    });
};
