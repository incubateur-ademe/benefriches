import reducer, {
  addSoils,
  FricheCreationStep,
  fricheInitialState,
  setLastActivity,
  setSoils,
  setSoilsSurfaceAreas,
  setSurfaceArea,
} from "./createFriche.reducer";

import {
  FricheLastActivity,
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
    it("sets soils area and goes to next step when no agricultural/natural area", () => {
      const state = {
        fricheData: fricheInitialState.fricheData,
        step: FricheCreationStep.SOILS,
        nextSteps: [FricheCreationStep.NAMING_STEP],
      };
      const action = setSoils({
        hasNaturalOrAgriculturalSoils: false,
        soils: [
          FricheSoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
          FricheSoilType.BUILDINGS,
        ],
      });
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          soils: [
            FricheSoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
            FricheSoilType.BUILDINGS,
          ],
          hasNaturalOrAgriculturalSoils: false,
        },
        step: FricheCreationStep.NAMING_STEP,
        nextSteps: [],
      });
    });

    it("sets soils area and add natural/agricultural soil step to next step when agricultural/natural area on friche", () => {
      const state = {
        fricheData: fricheInitialState.fricheData,
        step: FricheCreationStep.SOILS,
        nextSteps: [FricheCreationStep.NAMING_STEP],
      };
      const action = setSoils({
        hasNaturalOrAgriculturalSoils: true,
        soils: [FricheSoilType.MINERAL_SOIL, FricheSoilType.BUILDINGS],
      });
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          soils: [FricheSoilType.MINERAL_SOIL, FricheSoilType.BUILDINGS],
          hasNaturalOrAgriculturalSoils: true,
        },
        step: FricheCreationStep.NATURAL_OR_AGRICULTURAL_SOILS,
        nextSteps: [FricheCreationStep.NAMING_STEP],
      });
    });
  });

  describe("addSoils", () => {
    it("add soils to existing ones and goes to next step", () => {
      const state = {
        fricheData: {
          ...fricheInitialState.fricheData,
          soils: [
            FricheSoilType.BUILDINGS,
            FricheSoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
          ],
        },
        step: FricheCreationStep.NATURAL_OR_AGRICULTURAL_SOILS,
        nextSteps: [FricheCreationStep.NAMING_STEP],
      };
      const action = addSoils([
        FricheSoilType.CULTIVATION,
        FricheSoilType.FOREST_POPLAR,
      ]);
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          soils: [
            FricheSoilType.BUILDINGS,
            FricheSoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
            FricheSoilType.CULTIVATION,
            FricheSoilType.FOREST_POPLAR,
          ],
        },
        step: FricheCreationStep.NAMING_STEP,
        nextSteps: [],
      });
    });

    it("set soils when none and goes to next step", () => {
      const state = {
        fricheData: fricheInitialState.fricheData,
        step: FricheCreationStep.NATURAL_OR_AGRICULTURAL_SOILS,
        nextSteps: [FricheCreationStep.NAMING_STEP],
      };
      const action = addSoils([
        FricheSoilType.WATER,
        FricheSoilType.PRAIRIE_TREES,
      ]);
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          soils: [FricheSoilType.WATER, FricheSoilType.PRAIRIE_TREES],
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

  describe("setLastActivity", () => {
    it("when friche last activity is set, next step should be spaces", () => {
      const state = {
        fricheData: fricheInitialState.fricheData,
        step: FricheCreationStep.LAST_ACTIVITY_STEP,
        nextSteps: [FricheCreationStep.NAMING_STEP],
      };
      const action = setLastActivity(FricheLastActivity.INDUSTRY);
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          lastActivity: FricheLastActivity.INDUSTRY,
        },
        step: FricheCreationStep.NAMING_STEP,
        nextSteps: state.nextSteps.slice(1),
      });
    });
  });
});
