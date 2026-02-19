import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../../createSite.reducer";
import {
  fricheAccidentsIntroductionStepCompleted,
  fricheAccidentsStepCompleted,
  soilsContaminationIntroductionStepCompleted,
  soilsContaminationStepCompleted,
} from "./contaminationAndAccidents.actions";

export const registerContaminationAndAccidentsHandlers = (
  builder: ActionReducerMapBuilder<SiteCreationState>,
): void => {
  builder
    .addCase(soilsContaminationIntroductionStepCompleted, (state) => {
      state.stepsHistory.push("SOILS_CONTAMINATION");
    })
    .addCase(soilsContaminationStepCompleted, (state, action) => {
      const { hasContaminatedSoils, contaminatedSoilSurface } = action.payload;
      state.siteData.hasContaminatedSoils = hasContaminatedSoils;

      if (hasContaminatedSoils && contaminatedSoilSurface) {
        state.siteData.contaminatedSoilSurface = contaminatedSoilSurface;
      }
      state.stepsHistory.push("FRICHE_ACCIDENTS_INTRODUCTION");
    })
    .addCase(fricheAccidentsIntroductionStepCompleted, (state) => {
      state.stepsHistory.push("FRICHE_ACCIDENTS");
    })
    .addCase(fricheAccidentsStepCompleted, (state, action) => {
      const { hasRecentAccidents } = action.payload;
      state.siteData.hasRecentAccidents = hasRecentAccidents;

      if (hasRecentAccidents) {
        state.siteData.accidentsMinorInjuries = action.payload.accidentsMinorInjuries ?? 0;
        state.siteData.accidentsSevereInjuries = action.payload.accidentsSevereInjuries ?? 0;
        state.siteData.accidentsDeaths = action.payload.accidentsDeaths ?? 0;
      }
      state.stepsHistory.push("MANAGEMENT_INTRODUCTION");
    });
};

export const revertContaminationAndAccidentsStep = (state: SiteCreationState): void => {
  switch (state.stepsHistory.at(-1)) {
    case "SOILS_CONTAMINATION":
      state.siteData.hasContaminatedSoils = undefined;
      state.siteData.contaminatedSoilSurface = undefined;
      break;
    case "FRICHE_ACCIDENTS":
      state.siteData.hasRecentAccidents = undefined;
      state.siteData.accidentsMinorInjuries = undefined;
      state.siteData.accidentsSevereInjuries = undefined;
      state.siteData.accidentsDeaths = undefined;
      break;
  }
};
