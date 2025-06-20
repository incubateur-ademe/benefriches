import { stepRevertAttempted } from "../../actions/revert.actions";
import {
  siteSurfaceAreaStepCompleted,
  soilsCarbonStorageStepCompleted,
  soilsDistributionStepCompleted,
  soilsIntroductionStepCompleted,
  soilsSelectionStepCompleted,
  soilsSummaryStepCompleted,
  spacesSurfaceAreaDistributionKnowledgeCompleted,
  spacesKnowledgeStepCompleted,
} from "../../actions/spaces.actions";
import { siteWithExhaustiveData } from "../../siteData.mock";
import {
  expectNewCurrentStep,
  expectSiteDataDiff,
  expectSiteDataUnchanged,
  expectStepReverted,
  StoreBuilder,
} from "./testUtils";

describe("Site creation: spaces steps", () => {
  describe("SPACES_INTRODUCTION", () => {
    describe("complete", () => {
      it("goes to SURFACE_AREA step when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["SPACES_INTRODUCTION"]).build();
        const initialRootState = store.getState();

        store.dispatch(soilsIntroductionStepCompleted());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "SURFACE_AREA");
      });
    });
  });
  describe("SURFACE_AREA", () => {
    describe("complete", () => {
      describe("custom mode", () => {
        it("goes to SPACES_KNOWLEDGE step and sets surface area when step is completed", () => {
          const store = new StoreBuilder()
            .withCreateMode("custom")
            .withStepsHistory(["SURFACE_AREA"])
            .build();
          const initialRootState = store.getState();

          store.dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: 143000 }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { surfaceArea: 143000 });
          expectNewCurrentStep(initialRootState, newState, "SPACES_KNOWLEDGE");
        });
        describe("revert", () => {
          it("goes to previous step and unset surface area", () => {
            const store = new StoreBuilder()
              .withStepsHistory(["IS_FRICHE", "ADDRESS", "SURFACE_AREA"])
              .withCreationData({ isFriche: true, surfaceArea: 12000 })
              .build();
            const initialRootState = store.getState();

            store.dispatch(stepRevertAttempted());

            const newState = store.getState();
            expectSiteDataDiff(initialRootState, newState, { surfaceArea: undefined });
            expectStepReverted(initialRootState, newState);
          });
        });
      });
      describe("express mode", () => {
        it("sets surface area when step is completed", () => {
          const store = new StoreBuilder()
            .withStepsHistory(["SURFACE_AREA"])
            .withCreateMode("express")
            .build();
          const initialRootState = store.getState();

          store.dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: 143000 }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { surfaceArea: 143000 });
          expect(newState.siteCreation.stepsHistory).toEqual(
            initialRootState.siteCreation.stepsHistory,
          );
        });
      });
    });
  });
  describe("SPACES_KNOWLEDGE", () => {
    describe("complete", () => {
      it("goes to SPACES_SELECTION step when user knows what spaces are on the site", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SURFACE_AREA", "SPACES_KNOWLEDGE"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(spacesKnowledgeStepCompleted({ knowsSpaces: true }));

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "SPACES_SELECTION");
      });
      it("assigns soils selection from friche activity and goes to SOILS_SUMMARY when users don't know spaces", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SURFACE_AREA", "SPACES_KNOWLEDGE"])
          .withCreationData({
            isFriche: true,
            nature: "FRICHE",
            fricheActivity: "BUILDING",
            surfaceArea: 100,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(spacesKnowledgeStepCompleted({ knowsSpaces: false }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          soils: ["BUILDINGS", "IMPERMEABLE_SOILS", "ARTIFICIAL_GRASS_OR_BUSHES_FILLED"],
          soilsDistribution: {
            BUILDINGS: 80,
            IMPERMEABLE_SOILS: 10,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10,
          },
        });
        expectNewCurrentStep(initialRootState, newState, "SOILS_SUMMARY");
      });
      it("assigns soils selection from agricultural operation activity and goes to SOILS_SUMMARY when users don't know spaces", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SURFACE_AREA", "SPACES_KNOWLEDGE"])
          .withCreationData({
            isFriche: false,
            nature: "AGRICULTURAL_OPERATION",
            agriculturalOperationActivity: "MARKET_GARDENING",
            surfaceArea: 100,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(spacesKnowledgeStepCompleted({ knowsSpaces: false }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          soils: ["CULTIVATION", "BUILDINGS"],
          soilsDistribution: { BUILDINGS: 5, CULTIVATION: 95 },
        });
        expectNewCurrentStep(initialRootState, newState, "SOILS_SUMMARY");
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset soils selection and distribution", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SURFACE_AREA", "SPACES_KNOWLEDGE"])
          .withCreationData({
            isFriche: true,
            soils: siteWithExhaustiveData.soils,
            soilsDistribution: siteWithExhaustiveData.soilsDistribution,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { soils: [], soilsDistribution: undefined });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
  describe("SPACES_SELECTION", () => {
    describe("complete", () => {
      it("goes to SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE step and sets soils when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["SPACES_SELECTION"]).build();
        const initialRootState = store.getState();

        store.dispatch(soilsSelectionStepCompleted({ soils: siteWithExhaustiveData.soils }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { soils: siteWithExhaustiveData.soils });
        expectNewCurrentStep(
          initialRootState,
          newState,
          "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE",
        );
      });
      it("sets whole site surface area to selected soil and goes to SOILS_CARBON_STORAGE step when only one type of space is selected", () => {
        const store = new StoreBuilder()
          .withCreationData({ surfaceArea: 145 })
          .withStepsHistory(["SPACES_SELECTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(soilsSelectionStepCompleted({ soils: ["PRAIRIE_GRASS"] }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          soils: ["PRAIRIE_GRASS"],
          soilsDistribution: { PRAIRIE_GRASS: 145 },
        });
        expectNewCurrentStep(initialRootState, newState, "SOILS_CARBON_STORAGE");
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset soils data", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["IS_FRICHE", "ADDRESS", "SPACES_SELECTION"])
          .withCreationData({ isFriche: true, soils: siteWithExhaustiveData.soils })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { soils: [] });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
  describe("SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE", () => {
    describe("complete", () => {
      it("goes to SOILS_SUMMARY step when step is completed and user doesn't know surface distribution", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE"])
          .withCreationData({
            surfaceArea: 100000,
            soils: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "BUILDINGS", "FOREST_CONIFER"],
          })
          .build();

        const initialRootState = store.getState();

        store.dispatch(
          spacesSurfaceAreaDistributionKnowledgeCompleted({ knowsSurfaceAreas: false }),
        );

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          spacesDistributionKnowledge: false,
          soilsDistribution: {
            ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED"]: 33333.33,
            ["BUILDINGS"]: 33333.33,
            ["FOREST_CONIFER"]: 33333.34,
          },
        });
        expectNewCurrentStep(initialRootState, newState, "SOILS_SUMMARY");
      });
    });

    it("goes to SOILS_SURFACE_AREAS_DISTRIBUTION step when step is completed and user knows surface distribution", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE"])
        .withCreationData({
          surfaceArea: 100000,
          soils: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "BUILDINGS", "FOREST_CONIFER"],
        })
        .build();

      const initialRootState = store.getState();

      store.dispatch(spacesSurfaceAreaDistributionKnowledgeCompleted({ knowsSurfaceAreas: true }));

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, {
        spacesDistributionKnowledge: true,
      });
      expectNewCurrentStep(initialRootState, newState, "SPACES_SURFACE_AREA_DISTRIBUTION");
    });
    describe("revert", () => {
      it("goes to previous step and unset soils distribution entry mode and surface areas", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "IS_FRICHE",
            "ADDRESS",
            "SPACES_SELECTION",
            "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE",
          ])
          .withCreationData({
            isFriche: true,
            soils: siteWithExhaustiveData.soils,
            soilsDistribution: siteWithExhaustiveData.soilsDistribution,
            spacesDistributionKnowledge: siteWithExhaustiveData.spacesDistributionKnowledge,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          soilsDistribution: undefined,
          spacesDistributionKnowledge: undefined,
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
  describe("SPACES_SURFACE_AREA_DISTRIBUTION", () => {
    describe("complete", () => {
      it("goes to SOILS_SUMMARY step and sets soils distribution when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SPACES_SURFACE_AREA_DISTRIBUTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          soilsDistributionStepCompleted({
            distribution: siteWithExhaustiveData.soilsDistribution,
          }),
        );

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          soilsDistribution: siteWithExhaustiveData.soilsDistribution,
        });
        expectNewCurrentStep(initialRootState, newState, "SOILS_SUMMARY");
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset soils distribution surface areas", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "IS_FRICHE",
            "ADDRESS",
            "SPACES_SELECTION",
            "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE",
            "SPACES_SURFACE_AREA_DISTRIBUTION",
          ])
          .withCreationData({
            isFriche: true,
            soils: siteWithExhaustiveData.soils,
            soilsDistribution: siteWithExhaustiveData.soilsDistribution,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { soilsDistribution: undefined });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
  describe("SOILS_SUMMARY", () => {
    describe("complete", () => {
      it("goes to SOILS_CARBON_STORAGE step when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["SOILS_SUMMARY"]).build();
        const initialRootState = store.getState();

        store.dispatch(soilsSummaryStepCompleted());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "SOILS_CARBON_STORAGE");
      });
    });
  });
  describe("SOILS_CARBON_STORAGE", () => {
    describe("complete", () => {
      it("goes to SOILS_CONTAMINATION_INTRODUCTION step when step is completed and site is a friche", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SOILS_CARBON_STORAGE"])
          .withCreationData({ isFriche: true })
          .build();
        const initialRootState = store.getState();

        store.dispatch(soilsCarbonStorageStepCompleted());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "SOILS_CONTAMINATION_INTRODUCTION");
      });
      it("goes to MANAGEMENT_INTRODUCTION step when step is completed and site is not a friche", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SOILS_CARBON_STORAGE"])
          .withCreationData({ isFriche: false })
          .build();
        const initialRootState = store.getState();

        store.dispatch(soilsCarbonStorageStepCompleted());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "MANAGEMENT_INTRODUCTION");
      });
    });
  });
});
