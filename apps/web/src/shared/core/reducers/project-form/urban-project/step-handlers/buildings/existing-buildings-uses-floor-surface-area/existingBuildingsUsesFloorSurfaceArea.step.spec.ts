import { describe, expect, it } from "vitest";

import { StoreBuilder } from "@/features/create-project/core/urban-project/__tests__/_testStoreHelpers";
import { creationProjectFormUrbanActions } from "@/features/create-project/core/urban-project/urbanProject.actions";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

const makeSiteData = () => ({
  id: "test-site",
  name: "Test Site",
  surfaceArea: 10000,
  nature: "FRICHE" as const,
  isExpressSite: false as const,
  owner: { name: "Owner", structureType: "company" as const },
  soilsDistribution: { BUILDINGS: 2000, IMPERMEABLE_SOILS: 8000 },
  hasContaminatedSoils: false,
  address: {
    city: "City",
    cityCode: "12345",
    value: "Address",
    postCode: "12345",
    long: 0,
    lat: 0,
  },
});

const makeBaseSteps = (spacesBuildings: number): ProjectFormState["urbanProject"]["steps"] => ({
  URBAN_PROJECT_USES_SELECTION: {
    completed: true,
    payload: { usesSelection: ["RESIDENTIAL"] },
  },
  URBAN_PROJECT_SPACES_SURFACE_AREA: {
    completed: true,
    payload: {
      spacesSurfaceAreaDistribution: { BUILDINGS: spacesBuildings, IMPERMEABLE_SOILS: 7000 },
    },
  },
});

describe("URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA handler", () => {
  describe("getDependencyRules", () => {
    it("given both existing and new buildings uses steps are completed, when existing allocation changes, then new buildings uses step is invalidated", () => {
      // site=2000, project=3000, reuse=2000 → new=1000
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        ...makeBaseSteps(3000),
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 2000 },
        },
        URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 2000 } },
        },
        URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1000 } },
        },
      };

      const store = new StoreBuilder()
        .withSiteData(makeSiteData())
        .withSteps(steps)
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA")
        .build();

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: {
            existingBuildingsUsesFloorSurfaceArea: { OFFICES: 1500, RESIDENTIAL: 500 },
          },
        }),
      );
      store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

      const state = store.getState().projectCreation.urbanProject.steps;

      expect(state.URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA).toBeDefined();
      expect(state.URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA?.completed).toBe(
        false,
      );
    });

    it("given new buildings uses step is not yet completed, when existing allocation changes, then no invalidation rule is emitted", () => {
      // site=2000, project=3000, reuse=2000 → new=1000
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        ...makeBaseSteps(3000),
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 2000 },
        },
        URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 2000 } },
        },
      };

      const store = new StoreBuilder()
        .withSiteData(makeSiteData())
        .withSteps(steps)
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA")
        .build();

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: {
            existingBuildingsUsesFloorSurfaceArea: { OFFICES: 1500, RESIDENTIAL: 500 },
          },
        }),
      );

      // No pending confirmation should be needed — no dependency rules triggered
      expect(store.getState().projectCreation.urbanProject.pendingStepCompletion).toBeUndefined();
    });
  });
});
