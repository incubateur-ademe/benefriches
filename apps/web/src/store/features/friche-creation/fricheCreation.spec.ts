import reducer, {
  FricheCreationStep,
  fricheInitialState,
  setLastActivity,
  setPermeableArtificializedSoilComposition,
  setSpacesTypes,
} from "./fricheCreation";

import {
  FricheLastActivity,
  FricheSpaceType,
  PermeableArtificializedSoil,
} from "@/components/pages/SiteFoncier/friche";

describe("Friche creation flow", () => {
  describe("setLastActivity", () => {
    it("when friche last activity is set, next step should be spaces", () => {
      const state = fricheInitialState;
      const action = setLastActivity(FricheLastActivity.INDUSTRY);
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          lastActivity: FricheLastActivity.INDUSTRY,
        },
        step: FricheCreationStep.SPACES_STEP,
        nextSteps: state.nextSteps.slice(1),
      });
    });
  });

  describe("setSpacesTypes", () => {
    it("when friche has buildings and impermeable soils next step should be SPACES_SURFACES_AREA", () => {
      const state = {
        fricheData: fricheInitialState.fricheData,
        step: FricheCreationStep.SPACES_STEP,
        nextSteps: [
          FricheCreationStep.SPACES_SURFACE_AREA_STEP,
          FricheCreationStep.NAMING_STEP,
        ],
      };
      const spaces = [FricheSpaceType.BUILDINGS];
      const action = setSpacesTypes(spaces);
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          spaces: [{ type: FricheSpaceType.BUILDINGS }],
        },
        step: FricheCreationStep.SPACES_SURFACE_AREA_STEP,
        nextSteps: state.nextSteps.slice(1),
      });
    });

    it("when friche has permeable artificialized soils, soild composition should be added to next steps (after SPACES_SURFACES_AREA)", () => {
      const state = {
        fricheData: fricheInitialState.fricheData,
        step: FricheCreationStep.SPACES_STEP,
        nextSteps: [
          FricheCreationStep.SPACES_SURFACE_AREA_STEP,
          FricheCreationStep.NAMING_STEP,
        ],
      };
      const spaces = [FricheSpaceType.PERMEABLE_ARTIFICIAL_SOILS];
      const action = setSpacesTypes(spaces);
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          spaces: [{ type: FricheSpaceType.PERMEABLE_ARTIFICIAL_SOILS }],
        },
        step: FricheCreationStep.SPACES_SURFACE_AREA_STEP,
        nextSteps: [
          FricheCreationStep.PERMEABLE_ARTIFICIAL_SOILS_COMPOSITION,
          FricheCreationStep.NAMING_STEP,
        ],
      });
    });
  });

  describe("setPermeableArtificializedSoilComposition", () => {
    it("when friche permeable artificialized soil has only one type of soil, next step should be the following one", () => {
      const state = {
        fricheData: {
          ...fricheInitialState.fricheData,
          spaces: [{ type: FricheSpaceType.PERMEABLE_ARTIFICIAL_SOILS }],
        },
        step: FricheCreationStep.PERMEABLE_ARTIFICIAL_SOILS_COMPOSITION,
        nextSteps: [FricheCreationStep.NAMING_STEP],
      };
      const action = setPermeableArtificializedSoilComposition([
        PermeableArtificializedSoil.GRASS_OR_BUSHES_FILLED,
      ]);
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          spaces: [
            {
              type: FricheSpaceType.PERMEABLE_ARTIFICIAL_SOILS,
              soilComposition: [
                {
                  type: PermeableArtificializedSoil.GRASS_OR_BUSHES_FILLED,
                },
              ],
            },
          ],
        },
        step: FricheCreationStep.NAMING_STEP,
        nextSteps: state.nextSteps.slice(1),
      });
    });

    it("when friche permeable artificialized soil composition is unknown, it should default to mineral", () => {
      const state = {
        fricheData: {
          ...fricheInitialState.fricheData,
          spaces: [{ type: FricheSpaceType.PERMEABLE_ARTIFICIAL_SOILS }],
        },
        step: FricheCreationStep.PERMEABLE_ARTIFICIAL_SOILS_COMPOSITION,
        nextSteps: [FricheCreationStep.NAMING_STEP],
      };
      const action = setPermeableArtificializedSoilComposition([]);
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          spaces: [
            {
              type: FricheSpaceType.PERMEABLE_ARTIFICIAL_SOILS,
              soilComposition: [
                {
                  type: PermeableArtificializedSoil.MINERAL,
                },
              ],
            },
          ],
        },
        step: FricheCreationStep.NAMING_STEP,
        nextSteps: state.nextSteps.slice(1),
      });
    });

    it("when friche permeable artificialized soil is composed of more than one type, next step should be soil composition distribution", () => {
      const state = {
        fricheData: {
          ...fricheInitialState.fricheData,
          spaces: [{ type: FricheSpaceType.PERMEABLE_ARTIFICIAL_SOILS }],
        },
        step: FricheCreationStep.PERMEABLE_ARTIFICIAL_SOILS_COMPOSITION,
        nextSteps: [FricheCreationStep.NAMING_STEP],
      };
      const action = setPermeableArtificializedSoilComposition([
        PermeableArtificializedSoil.MINERAL,
        PermeableArtificializedSoil.TREE_FILLED,
      ]);
      const newState = reducer(state, action);

      expect(newState).toEqual({
        fricheData: {
          ...state.fricheData,
          spaces: [
            {
              type: FricheSpaceType.PERMEABLE_ARTIFICIAL_SOILS,
              soilComposition: [
                {
                  type: PermeableArtificializedSoil.MINERAL,
                },
                {
                  type: PermeableArtificializedSoil.TREE_FILLED,
                },
              ],
            },
          ],
        },
        step: FricheCreationStep.PERMEABLE_ARTIFICIAL_SOILS_DISTRIBUTION,
        nextSteps: [FricheCreationStep.NAMING_STEP],
      });
    });
  });
});
