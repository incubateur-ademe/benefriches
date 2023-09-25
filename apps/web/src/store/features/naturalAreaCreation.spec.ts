import reducer, {
  NaturalAreaCreationStep,
  setSpacesSurfaceArea,
  setSpacesTypes,
} from "./naturalAreaCreation";

import {
  NaturalAreaSpaceType,
  SiteFoncierType,
} from "@/components/pages/SiteFoncier/siteFoncier";

describe("Natural Area creation flow", () => {
  it("when spaces have been set, new step should be SPACES_SURFACES and following steps should be set accordingly", () => {
    const spaces = [
      NaturalAreaSpaceType.FOREST,
      NaturalAreaSpaceType.ORCHARD,
      NaturalAreaSpaceType.PRAIRIE,
    ];
    const action = setSpacesTypes(spaces);
    const newState = reducer(undefined, action);
    expect(newState).toEqual({
      naturalAreaData: {
        type: SiteFoncierType.NATURAL_AREA,
        spaces: [
          { type: NaturalAreaSpaceType.FOREST },
          { type: NaturalAreaSpaceType.ORCHARD },
          { type: NaturalAreaSpaceType.PRAIRIE },
        ],
      },
      step: NaturalAreaCreationStep.SPACES_SURFACE_AREA_STEP,
      nextSteps: [
        NaturalAreaCreationStep.FOREST_TREES_STEP,
        NaturalAreaCreationStep.PRAIRIE_VEGETATION_STEP,
        NaturalAreaCreationStep.SOIL_SUMMARY_STEP,
        NaturalAreaCreationStep.CARBON_SUMMARY_STEP,
        NaturalAreaCreationStep.OWNER_STEP,
        NaturalAreaCreationStep.NAMING_STEP,
        NaturalAreaCreationStep.CONFIRMATION_STEP,
      ],
    });
  });

  describe("setSpacesSurfaceArea", () => {
    it("when the natural area is a forest, next step should be FOREST_TREES", () => {
      const spaces = [NaturalAreaSpaceType.FOREST];
      const initialState = reducer(undefined, setSpacesTypes(spaces));

      const newState = reducer(
        initialState,
        setSpacesSurfaceArea({ [NaturalAreaSpaceType.FOREST]: 10000 }),
      );
      expect(newState).toEqual({
        naturalAreaData: {
          type: SiteFoncierType.NATURAL_AREA,
          spaces: [{ type: NaturalAreaSpaceType.FOREST, surface: 10000 }],
        },
        step: NaturalAreaCreationStep.FOREST_TREES_STEP,
        nextSteps: [
          NaturalAreaCreationStep.SOIL_SUMMARY_STEP,
          NaturalAreaCreationStep.CARBON_SUMMARY_STEP,
          NaturalAreaCreationStep.OWNER_STEP,
          NaturalAreaCreationStep.NAMING_STEP,
          NaturalAreaCreationStep.CONFIRMATION_STEP,
        ],
      });
    });

    it("when the natural area is a mix of forest and prairie, next step should be FOREST_TREES then soil summary", () => {
      const spaces = [NaturalAreaSpaceType.FOREST];
      const initialState = reducer(undefined, setSpacesTypes(spaces));

      const state = reducer(
        initialState,
        setSpacesSurfaceArea({ [NaturalAreaSpaceType.FOREST]: 10000 }),
      );
      expect(state).toEqual({
        naturalAreaData: {
          type: SiteFoncierType.NATURAL_AREA,
          spaces: [{ type: NaturalAreaSpaceType.FOREST, surface: 10000 }],
        },
        step: NaturalAreaCreationStep.FOREST_TREES_STEP,
        nextSteps: [
          NaturalAreaCreationStep.PRAIRIE_VEGETATION_STEP,
          NaturalAreaCreationStep.SOIL_SUMMARY_STEP,
          NaturalAreaCreationStep.CARBON_SUMMARY_STEP,
          NaturalAreaCreationStep.OWNER_STEP,
          NaturalAreaCreationStep.NAMING_STEP,
          NaturalAreaCreationStep.CONFIRMATION_STEP,
        ],
      });
    });
  });
});
