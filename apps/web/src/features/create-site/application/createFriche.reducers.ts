import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  FricheSite,
  FricheSpaceType,
  PermeableArtificializedSoil,
  PermeableArtificializedSoilSpace,
} from "@/features/create-site/domain/friche.types";
import { NaturalAreaSpaceType } from "@/features/create-site/domain/naturalArea.types";
import { SiteFoncierType } from "@/features/create-site/domain/siteFoncier.types";

export enum FricheCreationStep {
  LAST_ACTIVITY_STEP = "LAST_ACTIVITY_STEP",
  // spaces
  SPACES_STEP = "SPACES_STEP",
  SPACES_SURFACE_AREA_STEP = "SPACES_SURFACE_AREA_STEP",
  PERMEABLE_ARTIFICIAL_SOILS_COMPOSITION = "PERMEABLE_ARTIFICIAL_SOILS_COMPOSITION",
  PERMEABLE_ARTIFICIAL_SOILS_DISTRIBUTION = "PERMEABLE_ARTIFICIAL_SOILS_DISTRIBUTION",
  NATURAL_AREAS = "NATURAL_AREAS",
  NATURAL_AREAS_SURFACE_AREA = "NATURAL_AREAS_SURFACE_AREA",
  NAMING_STEP = "NAMING_STEP",
}

type FricheCreationState = {
  step: FricheCreationStep;
  nextSteps: FricheCreationStep[];
  fricheData: Partial<FricheSite>;
};

export const fricheInitialState: FricheCreationState = {
  step: FricheCreationStep.LAST_ACTIVITY_STEP,
  nextSteps: [
    FricheCreationStep.SPACES_STEP,
    FricheCreationStep.SPACES_SURFACE_AREA_STEP,
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
    setLastActivity: (
      state,
      action: PayloadAction<FricheSite["lastActivity"]>,
    ) => {
      state.fricheData.lastActivity = action.payload;

      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setSpacesTypes: (state, action: PayloadAction<FricheSpaceType[]>) => {
      const fricheSpaces = action.payload;
      state.fricheData.spaces = fricheSpaces.map((spaceType) => ({
        type: spaceType,
      }));

      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;

      if (fricheSpaces.includes(FricheSpaceType.PERMEABLE_ARTIFICIAL_SOILS)) {
        state.nextSteps = [
          FricheCreationStep.PERMEABLE_ARTIFICIAL_SOILS_COMPOSITION,
          ...state.nextSteps,
        ];
      }

      if (fricheSpaces.includes(FricheSpaceType.NATURAL_AREAS)) {
        state.nextSteps = [
          FricheCreationStep.NATURAL_AREAS,
          ...state.nextSteps,
        ];
      }
    },
    setSpacesSurfaceArea: (
      state,
      action: PayloadAction<FricheSite["spaces"]>,
    ) => {
      state.fricheData.spaces = action.payload;

      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setPermeableArtificializedSoilComposition: (
      state,
      action: PayloadAction<PermeableArtificializedSoil[]>,
    ) => {
      const permeableArtificializedSoilSpace = state.fricheData.spaces?.find(
        (space) => space.type === FricheSpaceType.PERMEABLE_ARTIFICIAL_SOILS,
      ) as PermeableArtificializedSoilSpace;

      if (action.payload.length === 0) {
        permeableArtificializedSoilSpace.soilComposition = [
          { type: PermeableArtificializedSoil.MINERAL },
        ];
      } else {
        permeableArtificializedSoilSpace.soilComposition = action.payload.map(
          (soilType) => {
            return { type: soilType };
          },
        );
      }

      if (action.payload.length > 1) {
        state.nextSteps = [
          FricheCreationStep.PERMEABLE_ARTIFICIAL_SOILS_DISTRIBUTION,
          ...state.nextSteps,
        ];
      }

      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setPermeableArtificializedSoilDistribution: (
      state,
      action: PayloadAction<
        Partial<Record<PermeableArtificializedSoil, number>>
      >,
    ) => {
      const permeableArtificializedSoilSpace = state.fricheData.spaces?.find(
        (space) => space.type === FricheSpaceType.PERMEABLE_ARTIFICIAL_SOILS,
      ) as PermeableArtificializedSoilSpace;

      permeableArtificializedSoilSpace.soilComposition = Object.entries(
        action.payload,
      ).map(([type, surface]) => {
        return { type: type as PermeableArtificializedSoil, surface };
      });

      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setNaturalAreas: (state, action: PayloadAction<NaturalAreaSpaceType[]>) => {
      state.fricheData.naturalAreas = action.payload;
    },
  },
});

export const {
  setLastActivity,
  setSpacesTypes,
  setSpacesSurfaceArea,
  setPermeableArtificializedSoilComposition,
  setPermeableArtificializedSoilDistribution,
  setNaturalAreas,
} = fricheCreationSlice.actions;

export default fricheCreationSlice.reducer;
