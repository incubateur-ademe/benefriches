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
  // pollution
  SOIL_CONTAMINATION = "SOIL_CONTAMINATION",
  NAMING_STEP = "NAMING_STEP",
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
    FricheCreationStep.SOIL_CONTAMINATION,
    FricheCreationStep.LAST_ACTIVITY_STEP,
    FricheCreationStep.NAMING_STEP,
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
  setLastActivity,
  setNaturalAreas,
  setContaminatedSoilSurface,
  goToNextStep,
} = fricheCreationSlice.actions;

export default fricheCreationSlice.reducer;
