import reducer, {
  FricheCreationStep,
  fricheInitialState,
  setActivity,
  setSoils,
  setSoilsSurfaceAreas,
  setSurfaceArea,
} from "./createFriche.reducer";

import {
  FricheActivity,
  FricheSoilType,
} from "@/features/create-site/domain/friche.types";

describe("Friche creation flow", () => {
  describe("setSurfaceArea", () => {
    it("sets surface area and goes to next step", () => {
      const state = {
        fricheData: fricheInitialState.fricheData,
        step: FricheCreationStep.SURFACE_AREA,
        nextSteps: [FricheCreationStep.NAMING_STEP],
      };
      const action = setSurfaceArea(4500);
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          surfaceArea: 4500,
        },
        step: FricheCreationStep.NAMING_STEP,
        nextSteps: [],
      });
    });
  });

  describe("setSoils", () => {
    it("sets soils and goes to next step", () => {
      const state = {
        fricheData: fricheInitialState.fricheData,
        step: FricheCreationStep.SOILS,
        nextSteps: [FricheCreationStep.NAMING_STEP],
      };
      const action = setSoils([
        FricheSoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
        FricheSoilType.BUILDINGS,
      ]);
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          soils: [
            FricheSoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
            FricheSoilType.BUILDINGS,
          ],
        },
        step: FricheCreationStep.NAMING_STEP,
        nextSteps: [],
      });
    });
  });

  describe("setSoilsSurfaceAreas", () => {
    it("sets soils area and goes to next step when no agricultural/natural area", () => {
      const state = {
        fricheData: fricheInitialState.fricheData,
        step: FricheCreationStep.SOILS_SURFACE_AREAS,
        nextSteps: [FricheCreationStep.NAMING_STEP],
      };
      const action = setSoilsSurfaceAreas({
        [FricheSoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED]: 10000,
        [FricheSoilType.BUILDINGS]: 5000,
      });
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          soilsSurfaceAreas: {
            [FricheSoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED]: 10000,
            [FricheSoilType.BUILDINGS]: 5000,
          },
        },
        step: FricheCreationStep.NAMING_STEP,
        nextSteps: [],
      });
    });
  });

  describe("setActivity", () => {
    it("when friche activity is set, go to next step", () => {
      const state = {
        fricheData: fricheInitialState.fricheData,
        step: FricheCreationStep.LAST_ACTIVITY_STEP,
        nextSteps: [FricheCreationStep.NAMING_STEP],
      };
      const action = setActivity(FricheActivity.INDUSTRY);
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          activity: FricheActivity.INDUSTRY,
        },
        step: FricheCreationStep.NAMING_STEP,
        nextSteps: state.nextSteps.slice(1),
      });
    });
  });
});
