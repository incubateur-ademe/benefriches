import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import {
  getSoilsDistributionForAgriculturalOperationActivity,
  getSoilsDistributionForFricheActivity,
  getSoilsDistributionForNaturalAreaType,
  SoilsDistribution,
  SoilType,
  SurfaceAreaDistribution,
  typedObjectKeys,
} from "shared";

import { splitEvenly } from "@/shared/core/split-number/splitNumber";

import type { SiteCreationState } from "../../createSite.reducer";
import {
  siteSurfaceAreaStepCompleted,
  soilsCarbonStorageStepCompleted,
  soilsDistributionStepCompleted,
  soilsIntroductionStepCompleted,
  soilsSelectionStepCompleted,
  soilsSummaryStepCompleted,
  spacesSurfaceAreaDistributionKnowledgeCompleted,
  spacesKnowledgeStepCompleted,
  surfaceAreaInputModeUpdated,
} from "./spaces.actions";

export const registerSpacesHandlers = (
  builder: ActionReducerMapBuilder<SiteCreationState>,
): void => {
  builder
    .addCase(soilsIntroductionStepCompleted, (state) => {
      state.stepsHistory.push("SURFACE_AREA");
    })
    .addCase(siteSurfaceAreaStepCompleted, (state, action) => {
      state.siteData.surfaceArea = action.payload.surfaceArea;
      if (state.createMode === "custom") {
        state.stepsHistory.push("SPACES_KNOWLEDGE");
      }
    })
    .addCase(spacesKnowledgeStepCompleted, (state, action) => {
      if (action.payload.knowsSpaces) {
        state.stepsHistory.push("SPACES_SELECTION");
      } else {
        const surfaceArea = state.siteData.surfaceArea ?? 0;

        switch (state.siteData.nature) {
          case "FRICHE":
            state.siteData.soilsDistribution = getSoilsDistributionForFricheActivity(
              surfaceArea,
              state.siteData.fricheActivity ?? "OTHER",
            );
            break;
          case "AGRICULTURAL_OPERATION":
            if (state.siteData.agriculturalOperationActivity) {
              state.siteData.soilsDistribution =
                getSoilsDistributionForAgriculturalOperationActivity(
                  surfaceArea,
                  state.siteData.agriculturalOperationActivity,
                );
            }
            break;
          case "NATURAL_AREA":
            if (state.siteData.naturalAreaType) {
              state.siteData.soilsDistribution = getSoilsDistributionForNaturalAreaType(
                surfaceArea,
                state.siteData.naturalAreaType,
              );
            }
            break;
        }
        state.siteData.soils = typedObjectKeys(state.siteData.soilsDistribution ?? {});
        state.stepsHistory.push("SOILS_SUMMARY");
      }
    })
    .addCase(soilsSelectionStepCompleted, (state, action) => {
      const { soils } = action.payload;
      state.siteData.soils = soils;

      if (soils.length === 1) {
        const totalSurface = state.siteData.surfaceArea ?? 0;
        const soilsDistribution = new SurfaceAreaDistribution();
        soilsDistribution.addSurface(soils[0] as SoilType, totalSurface);

        state.siteData.soilsDistribution = soilsDistribution.toJSON();
        state.stepsHistory.push("SOILS_CARBON_STORAGE");
      } else {
        state.stepsHistory.push("SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE");
      }
    })
    .addCase(spacesSurfaceAreaDistributionKnowledgeCompleted, (state, action) => {
      const { knowsSurfaceAreas } = action.payload;
      if (!knowsSurfaceAreas) {
        const totalSurface = state.siteData.surfaceArea ?? 0;
        const soils = state.siteData.soils;
        const surfaceSplit = splitEvenly(totalSurface, soils.length);
        const soilsDistribution: SoilsDistribution = {};
        soils.forEach((soilType, index) => {
          soilsDistribution[soilType] = surfaceSplit[index];
        });
        state.siteData.soilsDistribution = soilsDistribution;
      }
      state.siteData.spacesDistributionKnowledge = knowsSurfaceAreas;
      const nextStep = knowsSurfaceAreas ? "SPACES_SURFACE_AREA_DISTRIBUTION" : "SOILS_SUMMARY";
      state.stepsHistory.push(nextStep);
    })
    .addCase(soilsDistributionStepCompleted, (state, action) => {
      state.siteData.soilsDistribution = action.payload.distribution;
      state.stepsHistory.push("SOILS_SUMMARY");
    })
    .addCase(soilsSummaryStepCompleted, (state) => {
      state.stepsHistory.push("SOILS_CARBON_STORAGE");
    })
    .addCase(soilsCarbonStorageStepCompleted, (state) => {
      const nextStep = state.siteData.isFriche
        ? "SOILS_CONTAMINATION_INTRODUCTION"
        : "MANAGEMENT_INTRODUCTION";
      state.stepsHistory.push(nextStep);
    })
    .addCase(surfaceAreaInputModeUpdated, (state, action) => {
      state.surfaceAreaInputMode = action.payload;
    });
};

export const revertSpacesStep = (state: SiteCreationState): void => {
  switch (state.stepsHistory.at(-1)) {
    case "SURFACE_AREA":
      state.siteData.surfaceArea = undefined;
      break;
    case "SPACES_KNOWLEDGE":
      state.siteData.soils = [];
      state.siteData.soilsDistribution = undefined;
      break;
    case "SPACES_SELECTION":
      state.siteData.soils = [];
      break;
    case "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE":
      state.siteData.spacesDistributionKnowledge = undefined;
      state.siteData.soilsDistribution = undefined;
      break;
    case "SPACES_SURFACE_AREA_DISTRIBUTION":
      state.siteData.soilsDistribution = undefined;
      break;
  }
};
