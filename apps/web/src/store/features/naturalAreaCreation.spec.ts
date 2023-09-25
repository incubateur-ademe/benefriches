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
      { type: NaturalAreaSpaceType.FOREST },
      { type: NaturalAreaSpaceType.ORCHARD },
      { type: NaturalAreaSpaceType.PRAIRIE },
    ];
    const action = setSpacesTypes(spaces);
    const state = reducer(undefined, action);
    expect(state).toEqual({
      naturalAreaData: {
        type: SiteFoncierType.NATURAL_AREA,
        spaces,
      },
      step: NaturalAreaCreationStep.SPACES_SURFACE_AREA_STEP,
      nextSteps: [
        NaturalAreaCreationStep.FOREST_TREES_STEP,
        NaturalAreaCreationStep.FOREST_TREES_DISTRIBUTION,
        NaturalAreaCreationStep.PRAIRIE_VEGETATION_STEP,
        NaturalAreaCreationStep.PRAIRIE_VEGETATION_DISTRIBUTION_STEP,
        NaturalAreaCreationStep.OWNER_STEP,
        NaturalAreaCreationStep.NAMING_STEP,
        NaturalAreaCreationStep.CONFIRMATION_STEP,
      ],
    });
  });

  it("when surface have been set, new step should be FOREST_TREES", () => {
    const spaces = [{ type: NaturalAreaSpaceType.FOREST }];
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
        NaturalAreaCreationStep.FOREST_TREES_DISTRIBUTION,
        NaturalAreaCreationStep.OWNER_STEP,
        NaturalAreaCreationStep.NAMING_STEP,
        NaturalAreaCreationStep.CONFIRMATION_STEP,
      ],
    });
  });
});
