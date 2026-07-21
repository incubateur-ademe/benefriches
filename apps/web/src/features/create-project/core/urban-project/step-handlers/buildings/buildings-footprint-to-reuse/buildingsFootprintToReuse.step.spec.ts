import { describe, expect, it } from "vitest";

import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/urban-project/__tests__/_testStoreHelpers";
import { getProjectData } from "@/features/create-project/core/urban-project/helpers/readers/projectDataReaders";
import { creationProjectFormUrbanActions } from "@/features/create-project/core/urban-project/urbanProject.actions";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";

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

const makeBaseSteps = (spacesBuildings: number): UrbanProjectStepsState => ({
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
      const steps: UrbanProjectStepsState = makeBaseSteps(3000);
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

      // FRICHE site → INVOLVES_REINSTATEMENT
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_INVOLVES_REINSTATEMENT");
    });

    it("navigates to involves reinstatement when FRICHE and exit routing (regardless of contamination)", () => {
      // site=2000, project=2000, reuse=2000 → exit → FRICHE → involves reinstatement
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

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_INVOLVES_REINSTATEMENT");
    });
  });

  describe("getDependencyRules", () => {
    it("does not trigger cascading confirmation when no dependent steps have been answered yet", () => {
      const steps: UrbanProjectStepsState = makeBaseSteps(3000);

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

      expect(
        store.getState().projectCreation.urbanProject.form.pendingStepCompletion,
      ).toBeUndefined();
      expect(getCurrentStep(store)).toBe(
        "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
      );
    });

    it("discards existing/new buildings uses and stakeholder builder answers when new construction becomes 0", () => {
      // site=2000, project=2000, reuse=2000 → new=0
      // Previously had uses steps completed
      const steps: UrbanProjectStepsState = {
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

      const projectData = getProjectData(store.getState().projectCreation.urbanProject.form.steps);

      // Dependent buildings answers are discarded now that there is no new construction
      expect(projectData.existingBuildingsUsesFloorSurfaceArea).toBeUndefined();
      expect(projectData.newBuildingsUsesFloorSurfaceArea).toBeUndefined();
      expect(projectData.developerWillBeBuildingsConstructor).toBeUndefined();
    });
  });
});
