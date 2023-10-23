import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  FricheSite,
  FricheSoilType,
  OwnerType,
} from "@/features/create-site/domain/friche.types";
import { SiteFoncierType } from "@/features/create-site/domain/siteFoncier.types";

export enum FricheCreationStep {
  // soils
  SOIL_INTRODUCTION = "SOIL_INTRODUCTION",
  SURFACE_AREA = "SURFACE_AREA",
  SOILS = "SOILS",
  SOILS_SURFACE_AREAS = "SOILS_SURFACE_AREAS",
  SOILS_SUMMARY = "SOILS_SUMMARY",
  SOILS_CARBON_STORAGE = "SOILS_CARBON_STORAGE",
  // contamination
  SOIL_CONTAMINATION = "SOIL_CONTAMINATION",
  // site management
  MANAGEMENT_INTRODUCTION = "MANAGEMENT_INTRODUCTION",
  OWNER = "OWNER",
  TENANT = "TENANT",
  FULL_TIME_JOBS_INVOLVED = "FULL_TIME_JOBS_INVOLVED",
  RECENT_ACCIDENTS = "RECENT_ACCIDENTS",
  // NAMING
  LAST_ACTIVITY_STEP = "LAST_ACTIVITY_STEP",
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
    FricheCreationStep.MANAGEMENT_INTRODUCTION,
    FricheCreationStep.OWNER,
    FricheCreationStep.TENANT,
    FricheCreationStep.FULL_TIME_JOBS_INVOLVED,
    FricheCreationStep.RECENT_ACCIDENTS,
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
    setSoils: (state, action: PayloadAction<FricheSoilType[]>) => {
      state.fricheData.soils = action.payload;

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
    setActivity: (state, action: PayloadAction<FricheSite["activity"]>) => {
      state.fricheData.activity = action.payload;

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
    setFullTimeJobsInvolved: (state, action: PayloadAction<number>) => {
      state.fricheData.fullTimeJobsInvolved = action.payload;
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setTenant: (state, action: PayloadAction<string>) => {
      state.fricheData.tenantBusinessName = action.payload;
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setOwner: (
      state,
      action: PayloadAction<{ type: OwnerType; name?: string }>,
    ) => {
      state.fricheData.owner = action.payload;
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setRecentAccidents: (
      state,
      action: PayloadAction<{
        hasRecentAccidents: boolean;
        minorInjuriesPerson?: number;
        severeInjuriesPerson?: number;
        deaths?: number;
      }>,
    ) => {
      const { hasRecentAccidents } = action.payload;
      state.fricheData.hasRecentAccidents = action.payload.hasRecentAccidents;

      if (hasRecentAccidents) {
        state.fricheData.minorInjuriesPerson =
          action.payload.minorInjuriesPerson ?? 0;
        state.fricheData.severeInjuriesPerson =
          action.payload.severeInjuriesPerson ?? 0;
        state.fricheData.deaths = action.payload.deaths ?? 0;
      }

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
  setSoilsSurfaceAreas,
  setActivity,
  setContaminatedSoilSurface,
  setOwner,
  setTenant,
  setFullTimeJobsInvolved,
  setRecentAccidents,
  setNameAndDescription,
  goToNextStep,
} = fricheCreationSlice.actions;

export default fricheCreationSlice.reducer;
