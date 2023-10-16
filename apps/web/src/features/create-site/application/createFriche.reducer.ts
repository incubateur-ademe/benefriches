import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  FricheSite,
  FricheSoilType,
} from "@/features/create-site/domain/friche.types";
import { NaturalAreaSpaceType } from "@/features/create-site/domain/naturalArea.types";
import { SiteFoncierType } from "@/features/create-site/domain/siteFoncier.types";

export enum FricheCreationStep {
  LAST_ACTIVITY_STEP = "LAST_ACTIVITY_STEP",
  // soils
  SOIL_INTRODUCTION = "SOIL_INTRODUCTION",
  SURFACE_AREA = "SURFACE_AREA",
  SOILS = "SOILS",
  NATURAL_OR_AGRICULTURAL_SOILS = "NATURAL_OR_AGRICULTURAL_SOILS",
  SOILS_SURFACE_AREAS = "SOILS_SURFACE_AREAS",
  SOILS_SUMMARY = "SOILS_SUMMARY",
  SOILS_CARBON_STORAGE = "SOILS_CARBON_STORAGE",
  // pollution
  SOIL_CONTAMINATION = "SOIL_CONTAMINATION",
  NAMING_STEP = "NAMING_STEP",
  CREATION_CONFIRMATION = "CREATION_CONFIRMATION",
}

type FricheCreationState = {
  step: FricheCreationStep;
  nextSteps: FricheCreationStep[];
  fricheData: Partial<FricheSite>;
};

export const fricheInitialState: FricheCreationState = {
  step: FricheCreationStep.SOIL_INTRODUCTION,
  nextSteps: [
    FricheCreationStep.SURFACE_AREA,
    FricheCreationStep.SOILS,
    FricheCreationStep.SOILS_SURFACE_AREAS,
    FricheCreationStep.SOILS_SUMMARY,
    FricheCreationStep.SOIL_CONTAMINATION,
    FricheCreationStep.LAST_ACTIVITY_STEP,
    FricheCreationStep.NAMING_STEP,
    FricheCreationStep.CREATION_CONFIRMATION,
  ],
  fricheData: {
    type: SiteFoncierType.FRICHE,
  },
};

const getNextSteps = (steps: FricheCreationStep[]) => {
  const [nextStep, ...nextSteps] = steps;
  return { nextStep, nextSteps };
};

const fricheCreationSlice = createSlice({
  name: "fricheCreation",
  initialState: fricheInitialState,
  reducers: {
    setSurfaceArea: (state, action: PayloadAction<number>) => {
      state.fricheData.surfaceArea = action.payload;

      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setSoils: (
      state,
      action: PayloadAction<{
        hasNaturalOrAgriculturalSoils: boolean;
        soils: FricheSoilType[];
      }>,
    ) => {
      const { soils, hasNaturalOrAgriculturalSoils } = action.payload;
      state.fricheData.soils = soils;
      state.fricheData.hasNaturalOrAgriculturalSoils =
        hasNaturalOrAgriculturalSoils;

      if (hasNaturalOrAgriculturalSoils) {
        state.step = FricheCreationStep.NATURAL_OR_AGRICULTURAL_SOILS;
      } else {
        const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
        state.step = nextStep;
        state.nextSteps = nextSteps;
      }
    },
    addSoils: (state, action: PayloadAction<FricheSoilType[]>) => {
      state.fricheData.soils = [
        ...(state.fricheData.soils ?? []),
        ...action.payload,
      ];

      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setSoilsSurfaceAreas: (
      state,
      action: PayloadAction<FricheSite["soilsSurfaceAreas"]>,
    ) => {
      state.fricheData.soilsSurfaceAreas = action.payload;

      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setLastActivity: (
      state,
      action: PayloadAction<FricheSite["lastActivity"]>,
    ) => {
      state.fricheData.lastActivity = action.payload;

      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setNaturalAreas: (state, action: PayloadAction<NaturalAreaSpaceType[]>) => {
      state.fricheData.naturalAreas = action.payload;
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setContaminatedSoilSurface: (state, action: PayloadAction<number>) => {
      state.fricheData.contaminatedSoilSurface = action.payload;
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setNameAndDescription: (
      state,
      action: PayloadAction<{ name: string; description?: string }>,
    ) => {
      state.fricheData.name = action.payload.name;
      if (action.payload.description)
        state.fricheData.description = action.payload.description;
      state.step = FricheCreationStep.CREATION_CONFIRMATION;
    },
    goToNextStep: (state) => {
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
  },
});

export const {
  setSurfaceArea,
  setSoils,
  addSoils,
  setSoilsSurfaceAreas,
  setLastActivity,
  setNaturalAreas,
  setContaminatedSoilSurface,
  setNameAndDescription,
  goToNextStep,
} = fricheCreationSlice.actions;

export default fricheCreationSlice.reducer;
