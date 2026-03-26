import { describe, expect, it } from "vitest";

import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/urban-project/__tests__/_testStoreHelpers";
import { creationProjectFormUrbanActions } from "@/features/create-project/core/urban-project/urbanProject.actions";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

const makeSiteData = (
  overrides: Partial<{
    soilsDistribution: Record<string, number>;
    hasContaminatedSoils: boolean;
    nature: string;
  }> = {},
) => ({
  id: "test-site",
  name: "Test Site",
  surfaceArea: 10000,
  nature: (overrides.nature ?? "FRICHE") as "FRICHE",
  isExpressSite: false as const,
  owner: { name: "Owner", structureType: "company" as const },
  soilsDistribution: overrides.soilsDistribution ?? { BUILDINGS: 2000, IMPERMEABLE_SOILS: 8000 },
  hasContaminatedSoils: overrides.hasContaminatedSoils ?? false,
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
  URBAN_PROJECT_CREATE_MODE_SELECTION: {
    completed: true,
    payload: { createMode: "custom" },
  },
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

describe("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE handler", () => {
  describe("getNextStepId", () => {
    it("navigates to DEMOLITION_INFO when demolished > 0", () => {
      // site=2000, project=3000, reuse=1500 → demolished=500
      const steps: ProjectFormState["urbanProject"]["steps"] = makeBaseSteps(3000);
      const store = new StoreBuilder()
        .withSiteData(makeSiteData())
        .withSteps(steps)
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE")
        .build();

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
          answers: { buildingsFootprintToReuse: 1500 },
        }),
      );
      store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO");
    });

    it("navigates to EXISTING_BUILDINGS_USES when reuse > 0, new > 0, no demolition", () => {
      // site=2000, project=3000, reuse=2000 → demolished=0, new=1000, hasBoth=true
      const steps = makeBaseSteps(3000);
      const store = new StoreBuilder()
        .withSiteData(makeSiteData())
        .withSteps(steps)
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE")
        .build();

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
          answers: { buildingsFootprintToReuse: 2000 },
        }),
      );
      store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

      expect(getCurrentStep(store)).toBe(
        "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
      );
    });

    it("navigates to exit routing when reuse = site buildings and no new construction", () => {
      // site=2000, project=2000, reuse=2000 → demolished=0, new=0 → exit
      const steps = makeBaseSteps(2000);
      const store = new StoreBuilder()
        .withSiteData(makeSiteData())
        .withSteps(steps)
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE")
        .build();

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
          answers: { buildingsFootprintToReuse: 2000 },
        }),
      );
      store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

      // hasContaminatedSoils=false → SITE_RESALE_INTRODUCTION
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    });

    it("navigates to decontamination when hasContaminatedSoils and exit routing", () => {
      // site=2000, project=2000, reuse=2000 → exit → contaminated → decontamination
      const steps = makeBaseSteps(2000);
      const store = new StoreBuilder()
        .withSiteData(makeSiteData({ hasContaminatedSoils: true }))
        .withSteps(steps)
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE")
        .build();

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
          answers: { buildingsFootprintToReuse: 2000 },
        }),
      );
      store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
    });
  });

  describe("getDependencyRules", () => {
    it("deletes existing/new uses steps and stakeholder builder when new construction becomes 0", () => {
      // site=2000, project=2000, reuse=2000 → new=0
      // Previously had uses steps completed
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        ...makeBaseSteps(2000),
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 1500 },
        },
        URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1500 } },
        },
        URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 500 } },
        },
        URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
          completed: true,
          payload: { developerWillBeBuildingsConstructor: true },
        },
        URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION: {
          completed: true,
          payload: { buildingsConstructionWorks: 100000 },
        },
      };

      const store = new StoreBuilder()
        .withSiteData(makeSiteData())
        .withSteps(steps)
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE")
        .build();

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
          answers: { buildingsFootprintToReuse: 2000 },
        }),
      );
      store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

      const state = store.getState().projectCreation.urbanProject.steps;

      // Deleted
      expect(
        state.URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA,
      ).toBeUndefined();
      expect(state.URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA).toBeUndefined();
      expect(state.URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER).toBeUndefined();
      // Invalidated (not deleted)
      expect(state.URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION).toBeDefined();
      expect(
        state.URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION?.completed,
      ).toBe(false);
    });

    it("invalidates existing uses and expenses when reuse changes but still has both", () => {
      // site=2000, project=3000
      // Change reuse from 1500 to 1000 → still hasBoth (reuse=1000, new=2000)
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        ...makeBaseSteps(3000),
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 1500 },
        },
        URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1500 } },
        },
        URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1500 } },
        },
        URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION: {
          completed: true,
          payload: { buildingsConstructionWorks: 100000 },
        },
      };

      const store = new StoreBuilder()
        .withSiteData(makeSiteData())
        .withSteps(steps)
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE")
        .build();

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
          answers: { buildingsFootprintToReuse: 1000 },
        }),
      );
      store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

      const state = store.getState().projectCreation.urbanProject.steps;

      // Invalidated (still present, but completed=false)
      expect(
        state.URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA,
      ).toBeDefined();
      expect(
        state.URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA?.completed,
      ).toBe(false);
      expect(state.URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA).toBeDefined();
      expect(state.URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA?.completed).toBe(
        false,
      );
      expect(
        state.URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION?.completed,
      ).toBe(false);
    });

    it("always invalidates expenses step", () => {
      // Even when reuse stays the same (but is resubmitted)
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        ...makeBaseSteps(2000),
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 2000 },
        },
        URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION: {
          completed: true,
          payload: { buildingsConstructionWorks: 50000 },
        },
      };

      const store = new StoreBuilder()
        .withSiteData(makeSiteData())
        .withSteps(steps)
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE")
        .build();

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
          answers: { buildingsFootprintToReuse: 2000 },
        }),
      );
      store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

      const state = store.getState().projectCreation.urbanProject.steps;
      expect(
        state.URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION?.completed,
      ).toBe(false);
    });
  });
});
