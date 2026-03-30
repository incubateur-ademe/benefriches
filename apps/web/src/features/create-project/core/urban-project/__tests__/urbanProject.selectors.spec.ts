import { describe, it, expect } from "vitest";

import { AnswerStepId } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { ProjectCreationState } from "../../createProject.reducer";
import { creationProjectFormSelectors } from "../urbanProject.selectors";
import { mockSiteData } from "./_siteData.mock";
import { StoreBuilder } from "./_testStoreHelpers";

describe("urbanProject.selectors", () => {
  describe("selectStepAnswers", () => {
    it("should return answer payload if exists", () => {
      const initialSteps = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: {
            usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"],
          },
        },
      } satisfies ProjectCreationState["urbanProject"]["steps"];

      const store = new StoreBuilder()
        .withSteps(initialSteps)
        .withCurrentStep("URBAN_PROJECT_USES_SELECTION")
        .build();

      const rootState = store.getState();

      const selector = creationProjectFormSelectors.selectStepAnswers(
        "URBAN_PROJECT_USES_SELECTION",
      );

      expect(selector(rootState)).toEqual({
        usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"],
      });
    });

    it("should return undefined when no answer", () => {
      const store = new StoreBuilder().withSteps({}).build();
      const rootState = store.getState();

      const selector = creationProjectFormSelectors.selectStepAnswers(
        "URBAN_PROJECT_USES_SELECTION",
      );

      expect(selector(rootState)).toBeUndefined();
    });

    it("should return default answers if exists and no payload answers", () => {
      const store = new StoreBuilder()
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            defaultValues: {
              usesSelection: ["RESIDENTIAL"],
            },
          },
        })
        .build();
      const rootState = store.getState();
      const selector = creationProjectFormSelectors.selectStepAnswers(
        "URBAN_PROJECT_USES_SELECTION",
      );

      expect(selector(rootState)).toEqual({
        usesSelection: ["RESIDENTIAL"],
      });
    });

    it("should return payload answers even if there is default answers", () => {
      const store = new StoreBuilder()
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            defaultValues: {
              usesSelection: ["RESIDENTIAL"],
            },
            payload: {
              usesSelection: ["PUBLIC_GREEN_SPACES"],
            },
          },
        })
        .build();
      const rootState = store.getState();

      const selector = creationProjectFormSelectors.selectStepAnswers(
        "URBAN_PROJECT_USES_SELECTION" as AnswerStepId,
      );

      expect(selector(rootState)).toEqual({
        usesSelection: ["PUBLIC_GREEN_SPACES"],
      });
    });
  });

  describe("selectProjectSoilsDistributionByType", () => {
    it("should return empty object when there is no space categories filled", () => {
      const store = new StoreBuilder().build();
      const rootState = store.getState();
      const result = creationProjectFormSelectors.selectProjectSoilsDistributionByType(rootState);

      expect(result).toEqual({});
    });
  });

  describe("selectProjectDeveloperViewData", () => {
    it("returns composed view data with available stakeholders and project developer", () => {
      const store = new StoreBuilder()
        .withSiteData({
          ...mockSiteData,
          owner: { name: "Ville de Test", structureType: "municipality" as const },
        })
        .withSteps({
          URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
            completed: true,
            payload: {
              projectDeveloper: { name: "Mon entreprise", structureType: "company" },
            },
          },
        })
        .build();

      const rootState = store.getState();
      const result = creationProjectFormSelectors.selectProjectDeveloperViewData(rootState);

      expect(result.projectDeveloper).toEqual({
        name: "Mon entreprise",
        structureType: "company",
      });
      expect(result.availableStakeholdersList).toBeDefined();
      expect(result.availableLocalAuthoritiesStakeholders).toBeDefined();
    });

    it("returns undefined projectDeveloper when step has no answers", () => {
      const store = new StoreBuilder().withSteps({}).build();
      const rootState = store.getState();
      const result = creationProjectFormSelectors.selectProjectDeveloperViewData(rootState);

      expect(result.projectDeveloper).toBeUndefined();
      expect(result.availableStakeholdersList).toBeDefined();
      expect(result.availableLocalAuthoritiesStakeholders).toBeDefined();
    });
  });

  describe("selectReinstatementContractOwnerViewData", () => {
    it("returns composed view data with available stakeholders and reinstatement contract owner", () => {
      const store = new StoreBuilder()
        .withSiteData({
          ...mockSiteData,
          owner: { name: "Ville de Test", structureType: "municipality" as const },
        })
        .withSteps({
          URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: {
            completed: true,
            payload: {
              reinstatementContractOwner: { name: "Mon entreprise", structureType: "company" },
            },
          },
        })
        .build();

      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectReinstatementContractOwnerViewData(rootState);

      expect(result.reinstatementContractOwner).toEqual({
        name: "Mon entreprise",
        structureType: "company",
      });
      expect(result.availableStakeholdersList).toBeDefined();
      expect(result.availableLocalAuthoritiesStakeholders).toBeDefined();
    });

    it("returns undefined reinstatementContractOwner when step has no answers", () => {
      const store = new StoreBuilder().withSteps({}).build();
      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectReinstatementContractOwnerViewData(rootState);

      expect(result.reinstatementContractOwner).toBeUndefined();
      expect(result.availableStakeholdersList).toBeDefined();
      expect(result.availableLocalAuthoritiesStakeholders).toBeDefined();
    });
  });

  describe("selectSoilsSummaryViewData", () => {
    it("returns site soils distribution and empty project soils distribution when no steps completed", () => {
      const store = new StoreBuilder().withSteps({}).build();
      const rootState = store.getState();
      const result = creationProjectFormSelectors.selectSoilsSummaryViewData(rootState);

      expect(result.siteSoilsDistribution).toEqual(mockSiteData.soilsDistribution);
      expect(result.projectSoilsDistribution).toEqual({});
    });

    it("returns custom site soils distribution", () => {
      const customSoilsDistribution = {
        BUILDINGS: 2000,
        IMPERMEABLE_SOILS: 3000,
      };
      const store = new StoreBuilder()
        .withSiteData({
          ...mockSiteData,
          soilsDistribution: customSoilsDistribution,
        })
        .withSteps({})
        .build();

      const rootState = store.getState();
      const result = creationProjectFormSelectors.selectSoilsSummaryViewData(rootState);

      expect(result.siteSoilsDistribution).toEqual(customSoilsDistribution);
      expect(result.projectSoilsDistribution).toEqual({});
    });
  });

  describe("selectPublicGreenSpacesSoilsDistributionViewData", () => {
    it("should include constrained soil types from default answers even when not present on site", () => {
      const store = new StoreBuilder()
        .withSiteData({
          ...mockSiteData,
          soilsDistribution: {
            BUILDINGS: 2250,
            CULTIVATION: 42750,
          },
        })
        .withSteps({
          URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              publicGreenSpacesSurfaceArea: 45000,
            },
          },
          URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION: {
            completed: true,
            defaultValues: {
              publicGreenSpacesSoilsDistribution: {
                ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 18000,
                ARTIFICIAL_TREE_FILLED: 22500,
                WATER: 4500,
              },
            },
          },
        })
        .build();

      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectPublicGreenSpacesSoilsDistributionViewData(rootState);

      [
        "IMPERMEABLE_SOILS",
        "MINERAL_SOIL",
        "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
        "ARTIFICIAL_TREE_FILLED",
        "CULTIVATION",
        "WATER",
      ].forEach((soilType) => {
        expect(result.availableSoilTypes).toContain(soilType);
      });
      expect(result.publicGreenSpacesSoilsDistribution).toEqual({
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 18000,
        ARTIFICIAL_TREE_FILLED: 22500,
        WATER: 4500,
      });
    });
  });

  describe("selectReinstatementExpensesViewData", () => {
    it("returns reinstatement expenses, decontaminated surface area and site soils distribution", () => {
      const store = new StoreBuilder()
        .withSteps({
          URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
            completed: true,
            payload: {
              reinstatementExpenses: [{ amount: 50000, purpose: "waste_collection" as const }],
            },
          },
          URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
            completed: true,
            payload: { decontaminatedSurfaceArea: 1500 },
          },
        })
        .build();

      const rootState = store.getState();
      const result = creationProjectFormSelectors.selectReinstatementExpensesViewData(rootState);

      expect(result.reinstatementExpenses).toEqual([
        { amount: 50000, purpose: "waste_collection" },
      ]);
      expect(result.decontaminatedSurfaceArea).toBe(1500);
      expect(result.siteSoilsDistribution).toEqual(mockSiteData.soilsDistribution);
    });

    it("returns undefined values when no steps completed", () => {
      const store = new StoreBuilder().withSteps({}).build();
      const rootState = store.getState();
      const result = creationProjectFormSelectors.selectReinstatementExpensesViewData(rootState);

      expect(result.reinstatementExpenses).toBeUndefined();
      expect(result.decontaminatedSurfaceArea).toBeUndefined();
      expect(result.siteSoilsDistribution).toEqual(mockSiteData.soilsDistribution);
    });
  });

  describe("selectScheduleProjectionViewData", () => {
    it("returns step answers and isSiteFriche", () => {
      const store = new StoreBuilder()
        .withSteps({
          URBAN_PROJECT_SCHEDULE_PROJECTION: {
            completed: true,
            payload: {
              installationSchedule: { startDate: "2025-01-01", endDate: "2026-01-01" },
              firstYearOfOperation: 2027,
            },
          },
        })
        .build();

      const rootState = store.getState();
      const result = creationProjectFormSelectors.selectScheduleProjectionViewData(rootState);

      expect(result.stepAnswers?.installationSchedule).toEqual({
        startDate: "2025-01-01",
        endDate: "2026-01-01",
      });
      expect(result.stepAnswers?.firstYearOfOperation).toBe(2027);
      expect(result.isSiteFriche).toBe(true);
    });

    it("returns undefined step answers when no steps completed", () => {
      const store = new StoreBuilder().withSteps({}).build();
      const rootState = store.getState();
      const result = creationProjectFormSelectors.selectScheduleProjectionViewData(rootState);

      expect(result.stepAnswers).toBeUndefined();
      expect(result.isSiteFriche).toBe(true);
    });
  });

  describe("selectSoilsDecontaminationSurfaceAreaViewData", () => {
    it("returns decontaminated surface area and site contaminated surface area", () => {
      const store = new StoreBuilder()
        .withSteps({
          URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
            completed: true,
            payload: { decontaminatedSurfaceArea: 1000 },
          },
        })
        .build();

      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectSoilsDecontaminationSurfaceAreaViewData(rootState);

      expect(result.decontaminatedSurfaceArea).toBe(1000);
      expect(result.siteContaminatedSurfaceArea).toBe(mockSiteData.contaminatedSoilSurface);
    });

    it("returns undefined decontaminated surface area when no steps completed", () => {
      const store = new StoreBuilder().withSteps({}).build();
      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectSoilsDecontaminationSurfaceAreaViewData(rootState);

      expect(result.decontaminatedSurfaceArea).toBeUndefined();
      expect(result.siteContaminatedSurfaceArea).toBe(mockSiteData.contaminatedSoilSurface);
    });
  });

  describe("selectBuildingsNewConstructionIntroductionViewData", () => {
    it("returns project buildings footprint from spaces distribution", () => {
      const store = new StoreBuilder()
        .withSteps({
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: {
                BUILDINGS: 3200,
                IMPERMEABLE_SOILS: 1800,
              },
            },
          },
        })
        .build();
      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectBuildingsNewConstructionIntroductionViewData(rootState);

      expect(result).toEqual({ buildingsFootprintToConstruct: 3200 });
    });

    it("returns zero when spaces distribution is missing", () => {
      const store = new StoreBuilder().withSteps({}).build();
      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectBuildingsNewConstructionIntroductionViewData(rootState);

      expect(result).toEqual({ buildingsFootprintToConstruct: 0 });
    });
  });

  describe("selectBuildingsNewConstructionInfoViewData", () => {
    it("returns the remaining buildings footprint to construct after reuse", () => {
      const store = new StoreBuilder()
        .withSteps({
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: {
                BUILDINGS: 3200,
                IMPERMEABLE_SOILS: 1800,
              },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: {
              buildingsFootprintToReuse: 1400,
            },
          },
        })
        .build();
      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectBuildingsNewConstructionInfoViewData(rootState);

      expect(result).toEqual({ buildingsFootprintToConstruct: 1800 });
    });

    it("returns zero when reuse covers the whole project buildings footprint", () => {
      const store = new StoreBuilder()
        .withSteps({
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: {
                BUILDINGS: 1200,
                IMPERMEABLE_SOILS: 1800,
              },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: {
              buildingsFootprintToReuse: 1200,
            },
          },
        })
        .build();
      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectBuildingsNewConstructionInfoViewData(rootState);

      expect(result).toEqual({ buildingsFootprintToConstruct: 0 });
    });
  });

  describe("selectBuildingsFootprintToReuseViewData", () => {
    it("returns max footprint to reuse as min(site buildings, project buildings)", () => {
      const store = new StoreBuilder()
        .withSiteData({
          ...mockSiteData,
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 1000 },
        })
        .withSteps({
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: {
                BUILDINGS: 900,
                IMPERMEABLE_SOILS: 9100,
              },
            },
          },
        })
        .build();

      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectBuildingsFootprintToReuseViewData(rootState);

      expect(result).toEqual({
        siteBuildingsFootprint: 1000,
        maxBuildingsFootprintToReuse: 900,
        currentValue: undefined,
      });
    });

    it("falls back to site buildings footprint as max when spaces step is missing", () => {
      const store = new StoreBuilder()
        .withSiteData({
          ...mockSiteData,
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 1200 },
        })
        .withSteps({})
        .build();

      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectBuildingsFootprintToReuseViewData(rootState);

      expect(result.maxBuildingsFootprintToReuse).toBe(1200);
    });
  });

  describe("selectExistingBuildingsUsesFloorSurfaceAreaViewData", () => {
    it("returns current answers, building uses only, and overall floor surface distribution", () => {
      const store = new StoreBuilder()
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: {
              usesSelection: ["RESIDENTIAL", "OFFICES", "PUBLIC_GREEN_SPACES"],
            },
          },
          URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
            completed: true,
            payload: {
              usesFloorSurfaceAreaDistribution: {
                RESIDENTIAL: 2400,
                OFFICES: 600,
              },
            },
          },
          URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
            completed: true,
            payload: {
              existingBuildingsUsesFloorSurfaceArea: {
                RESIDENTIAL: 1800,
              },
            },
          },
        })
        .build();

      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectExistingBuildingsUsesFloorSurfaceAreaViewData(rootState);

      expect(result).toEqual({
        existingBuildingsUsesFloorSurfaceArea: {
          RESIDENTIAL: 1800,
        },
        selectedUses: ["RESIDENTIAL", "OFFICES"],
        usesFloorSurfaceAreaDistribution: {
          RESIDENTIAL: 2400,
          OFFICES: 600,
        },
      });
    });

    it("returns empty defaults when buildings answers are missing", () => {
      const store = new StoreBuilder()
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: {
              usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"],
            },
          },
        })
        .build();

      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectExistingBuildingsUsesFloorSurfaceAreaViewData(rootState);

      expect(result).toEqual({
        existingBuildingsUsesFloorSurfaceArea: undefined,
        selectedUses: ["RESIDENTIAL"],
        usesFloorSurfaceAreaDistribution: {},
      });
    });

    it("falls back to default answers for existing buildings uses", () => {
      const store = new StoreBuilder()
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: {
              usesSelection: ["RESIDENTIAL"],
            },
          },
          URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
            completed: true,
            defaultValues: {
              existingBuildingsUsesFloorSurfaceArea: {
                RESIDENTIAL: 1200,
              },
            },
          },
        })
        .build();

      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectExistingBuildingsUsesFloorSurfaceAreaViewData(rootState);

      expect(result.existingBuildingsUsesFloorSurfaceArea).toEqual({
        RESIDENTIAL: 1200,
      });
    });
  });

  describe("selectNewBuildingsUsesFloorSurfaceAreaViewData", () => {
    it("returns current answers, building uses only, and remaining floor surface distribution after existing allocation", () => {
      const store = new StoreBuilder()
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: {
              usesSelection: ["RESIDENTIAL", "OFFICES", "PUBLIC_GREEN_SPACES"],
            },
          },
          URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
            completed: true,
            payload: {
              usesFloorSurfaceAreaDistribution: {
                RESIDENTIAL: 2400,
                OFFICES: 600,
              },
            },
          },
          URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
            completed: true,
            payload: {
              existingBuildingsUsesFloorSurfaceArea: {
                RESIDENTIAL: 1600,
                OFFICES: 400,
              },
            },
          },
          URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
            completed: true,
            payload: {
              newBuildingsUsesFloorSurfaceArea: {
                RESIDENTIAL: 800,
                OFFICES: 200,
              },
            },
          },
        })
        .build();

      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectNewBuildingsUsesFloorSurfaceAreaViewData(rootState);

      expect(result).toEqual({
        newBuildingsUsesFloorSurfaceArea: {
          RESIDENTIAL: 800,
          OFFICES: 200,
        },
        selectedUses: ["RESIDENTIAL", "OFFICES"],
        usesFloorSurfaceAreaDistribution: {
          RESIDENTIAL: 2400,
          OFFICES: 600,
        },
        remainingUsesFloorSurfaceAreaDistribution: {
          RESIDENTIAL: 800,
          OFFICES: 200,
        },
      });
    });

    it("falls back to default answers and treats missing existing allocation as zero", () => {
      const store = new StoreBuilder()
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: {
              usesSelection: ["RESIDENTIAL"],
            },
          },
          URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
            completed: true,
            payload: {
              usesFloorSurfaceAreaDistribution: {
                RESIDENTIAL: 1200,
              },
            },
          },
          URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
            completed: true,
            defaultValues: {
              newBuildingsUsesFloorSurfaceArea: {
                RESIDENTIAL: 1200,
              },
            },
          },
        })
        .build();

      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectNewBuildingsUsesFloorSurfaceAreaViewData(rootState);

      expect(result).toEqual({
        newBuildingsUsesFloorSurfaceArea: {
          RESIDENTIAL: 1200,
        },
        selectedUses: ["RESIDENTIAL"],
        usesFloorSurfaceAreaDistribution: {
          RESIDENTIAL: 1200,
        },
        remainingUsesFloorSurfaceAreaDistribution: {
          RESIDENTIAL: 1200,
        },
      });
    });
  });

  describe("selectUrbanProjectSummaryViewData", () => {
    it("returns composed summary view data", () => {
      const store = new StoreBuilder().withSteps({}).build();
      const rootState = store.getState();
      const result = creationProjectFormSelectors.selectUrbanProjectSummaryViewData(rootState);

      expect(result.isFormValid).toBeDefined();
      expect(result.projectSummary).toBeDefined();
      expect(result.projectSoilsDistribution).toBeDefined();
      expect(result.saveState).toBe("idle");
      expect(result.stepsGroupedBySections).toBeDefined();
    });
  });
});
