import reducer, {
  NaturalAreaCreationStep,
  setForestTrees,
  setSpacesSurfaceArea,
  setSpacesTypes,
} from "./createNaturalArea.reducers";

import {
  NaturalAreaSpaceType,
  TreeType,
} from "@/features/create-site/domain/naturalArea.types";
import { SiteFoncierType } from "@/features/create-site/domain/siteFoncier.types";

describe("Natural Area creation flow", () => {
  describe("setSpacesTypes", () => {
    it("when natureal area is a forest, next step should be SPACES_SURFACES then FOREST_TREES", () => {
      const spaces = [NaturalAreaSpaceType.FOREST];
      const action = setSpacesTypes(spaces);
      const newState = reducer(undefined, action);

      expect(newState).toEqual({
        naturalAreaData: {
          type: SiteFoncierType.NATURAL_AREA,
          spaces: [{ type: NaturalAreaSpaceType.FOREST }],
        },
        step: NaturalAreaCreationStep.SPACES_SURFACE_AREA_STEP,
        nextSteps: [
          NaturalAreaCreationStep.FOREST_TREES_STEP,
          NaturalAreaCreationStep.SOIL_SUMMARY_STEP,
          NaturalAreaCreationStep.CARBON_SUMMARY_STEP,
          NaturalAreaCreationStep.OWNER_STEP,
          NaturalAreaCreationStep.OPERATION_STEP,
          NaturalAreaCreationStep.FULL_TIME_JOBS_INVOLVED_STEP,
          NaturalAreaCreationStep.YEARLY_EXPENSES_STEP,
          NaturalAreaCreationStep.YEARLY_INCOME_STEP,
          NaturalAreaCreationStep.NAMING_STEP,
          NaturalAreaCreationStep.CONFIRMATION_STEP,
        ],
      });
    });

    it("when natureal area is a mix of prairie, forest and water, next step should be SPACES_SURFACES then FOREST_TREES and PRAIRIE_VEGETATION", () => {
      const spaces = [
        NaturalAreaSpaceType.FOREST,
        NaturalAreaSpaceType.PRAIRIE,
        NaturalAreaSpaceType.WATER,
      ];
      const action = setSpacesTypes(spaces);
      const newState = reducer(undefined, action);

      expect(newState).toEqual({
        naturalAreaData: {
          type: SiteFoncierType.NATURAL_AREA,
          spaces: [
            { type: NaturalAreaSpaceType.FOREST },
            { type: NaturalAreaSpaceType.PRAIRIE },
            { type: NaturalAreaSpaceType.WATER },
          ],
        },
        step: NaturalAreaCreationStep.SPACES_SURFACE_AREA_STEP,
        nextSteps: [
          NaturalAreaCreationStep.FOREST_TREES_STEP,
          NaturalAreaCreationStep.PRAIRIE_VEGETATION_STEP,
          NaturalAreaCreationStep.SOIL_SUMMARY_STEP,
          NaturalAreaCreationStep.CARBON_SUMMARY_STEP,
          NaturalAreaCreationStep.OWNER_STEP,
          NaturalAreaCreationStep.OPERATION_STEP,
          NaturalAreaCreationStep.FULL_TIME_JOBS_INVOLVED_STEP,
          NaturalAreaCreationStep.YEARLY_EXPENSES_STEP,
          NaturalAreaCreationStep.YEARLY_INCOME_STEP,
          NaturalAreaCreationStep.NAMING_STEP,
          NaturalAreaCreationStep.CONFIRMATION_STEP,
        ],
      });
    });

    it("when natureal area is a mix of orchard, cultivation, vineyard, wet land and water, next step should be SPACES_SURFACES then SOIL_SUMMARY", () => {
      const spaces = [
        NaturalAreaSpaceType.CULTIVATION,
        NaturalAreaSpaceType.ORCHARD,
        NaturalAreaSpaceType.WET_LAND,
        NaturalAreaSpaceType.WATER,
        NaturalAreaSpaceType.VINEYARD,
      ];
      const action = setSpacesTypes(spaces);
      const newState = reducer(undefined, action);

      expect(newState).toEqual({
        naturalAreaData: {
          type: SiteFoncierType.NATURAL_AREA,
          spaces: [
            { type: NaturalAreaSpaceType.CULTIVATION },
            { type: NaturalAreaSpaceType.ORCHARD },
            { type: NaturalAreaSpaceType.WET_LAND },
            { type: NaturalAreaSpaceType.WATER },
            { type: NaturalAreaSpaceType.VINEYARD },
          ],
        },
        step: NaturalAreaCreationStep.SPACES_SURFACE_AREA_STEP,
        nextSteps: [
          NaturalAreaCreationStep.SOIL_SUMMARY_STEP,
          NaturalAreaCreationStep.CARBON_SUMMARY_STEP,
          NaturalAreaCreationStep.OWNER_STEP,
          NaturalAreaCreationStep.OPERATION_STEP,
          NaturalAreaCreationStep.FULL_TIME_JOBS_INVOLVED_STEP,
          NaturalAreaCreationStep.YEARLY_EXPENSES_STEP,
          NaturalAreaCreationStep.YEARLY_INCOME_STEP,
          NaturalAreaCreationStep.NAMING_STEP,
          NaturalAreaCreationStep.CONFIRMATION_STEP,
        ],
      });
    });
  });

  describe("setSpacesSurfaceArea", () => {
    it("should set surface area for given spaces", () => {
      const action = setSpacesSurfaceArea({
        [NaturalAreaSpaceType.FOREST]: 5000,
        [NaturalAreaSpaceType.PRAIRIE]: 10000,
        [NaturalAreaSpaceType.WATER]: 500,
      });
      const newState = reducer(
        {
          naturalAreaData: { type: SiteFoncierType.NATURAL_AREA },
          step: NaturalAreaCreationStep.SPACES_SURFACE_AREA_STEP,
          nextSteps: [
            NaturalAreaCreationStep.SOIL_SUMMARY_STEP,
            NaturalAreaCreationStep.CARBON_SUMMARY_STEP,
            NaturalAreaCreationStep.OWNER_STEP,
            NaturalAreaCreationStep.NAMING_STEP,
            NaturalAreaCreationStep.CONFIRMATION_STEP,
          ],
        },
        action,
      );

      expect(newState).toEqual({
        naturalAreaData: {
          type: SiteFoncierType.NATURAL_AREA,
          spaces: [
            { type: NaturalAreaSpaceType.FOREST, surface: 5000 },
            { type: NaturalAreaSpaceType.PRAIRIE, surface: 10000 },
            { type: NaturalAreaSpaceType.WATER, surface: 500 },
          ],
        },
        step: NaturalAreaCreationStep.SOIL_SUMMARY_STEP,
        nextSteps: [
          NaturalAreaCreationStep.CARBON_SUMMARY_STEP,
          NaturalAreaCreationStep.OWNER_STEP,
          NaturalAreaCreationStep.NAMING_STEP,
          NaturalAreaCreationStep.CONFIRMATION_STEP,
        ],
      });
    });
  });

  describe("setForestTrees", () => {
    it("when only one type of trees on forest, next step should be the expected one", () => {
      const action = setForestTrees([TreeType.RESINOUS]);
      const newState = reducer(
        {
          naturalAreaData: {
            type: SiteFoncierType.NATURAL_AREA,
            spaces: [
              { type: NaturalAreaSpaceType.FOREST, surface: 5000 },
              { type: NaturalAreaSpaceType.PRAIRIE, surface: 10000 },
            ],
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
        },
        action,
      );

      expect(newState).toEqual({
        naturalAreaData: {
          type: SiteFoncierType.NATURAL_AREA,
          spaces: [
            {
              type: NaturalAreaSpaceType.FOREST,
              surface: 5000,
              trees: [{ type: TreeType.RESINOUS }],
            },
            { type: NaturalAreaSpaceType.PRAIRIE, surface: 10000 },
          ],
        },
        step: NaturalAreaCreationStep.PRAIRIE_VEGETATION_STEP,
        nextSteps: [
          NaturalAreaCreationStep.SOIL_SUMMARY_STEP,
          NaturalAreaCreationStep.CARBON_SUMMARY_STEP,
          NaturalAreaCreationStep.OWNER_STEP,
          NaturalAreaCreationStep.NAMING_STEP,
          NaturalAreaCreationStep.CONFIRMATION_STEP,
        ],
      });
    });
    it("when multiple type of trees on forest, next step should FOREST_TREES_DISTRIBUTION", () => {
      const action = setForestTrees([TreeType.RESINOUS, TreeType.POPLAR]);
      const newState = reducer(
        {
          naturalAreaData: {
            type: SiteFoncierType.NATURAL_AREA,
            spaces: [
              { type: NaturalAreaSpaceType.FOREST, surface: 5000 },
              { type: NaturalAreaSpaceType.PRAIRIE, surface: 10000 },
            ],
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
        },
        action,
      );

      expect(newState).toEqual({
        naturalAreaData: {
          type: SiteFoncierType.NATURAL_AREA,
          spaces: [
            {
              type: NaturalAreaSpaceType.FOREST,
              surface: 5000,
              trees: [{ type: TreeType.RESINOUS }, { type: TreeType.POPLAR }],
            },
            { type: NaturalAreaSpaceType.PRAIRIE, surface: 10000 },
          ],
        },
        step: NaturalAreaCreationStep.FOREST_TREES_DISTRIBUTION,
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
