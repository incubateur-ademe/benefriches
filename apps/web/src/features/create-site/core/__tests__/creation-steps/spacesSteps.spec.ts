import {
  revertSoilsDistributionStep,
  revertSoilsSelectionStep,
  revertSoilsSurfaceAreaDistributionEntryModeStep,
  revertSurfaceAreaStep,
} from "../../actions/createSite.actions";
import {
  completeSiteSurfaceArea,
  completeSoils,
  completeSoilsCarbonStorage,
  completeSoilsDistribution,
  completeSoilsIntroduction,
  completeSoilsSummary,
  soilsSurfaceAreaDistributionEntryModeCompleted,
} from "../../createSite.reducer";
import { siteWithExhaustiveData } from "../../siteData.mock";
import {
  expectNewCurrentStep,
  expectSiteDataDiff,
  expectSiteDataUnchanged,
  expectStepReverted,
  StoreBuilder,
} from "./testUtils";

describe("Site creation: spaces steps", () => {
  describe("SOILS_INTRODUCTION", () => {
    describe("complete", () => {
      it("goes to SURFACE_AREA step when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["SOILS_INTRODUCTION"]).build();
        const initialRootState = store.getState();

        store.dispatch(completeSoilsIntroduction());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "SURFACE_AREA");
      });
    });
  });
  describe("SURFACE_AREA", () => {
    describe("complete", () => {
      describe("custom mode", () => {
        it("goes to SOILS_SELECTION step and sets surface area when step is completed", () => {
          const store = new StoreBuilder()
            .withCreateMode("custom")
            .withStepsHistory(["SURFACE_AREA"])
            .build();
          const initialRootState = store.getState();

          store.dispatch(completeSiteSurfaceArea({ surfaceArea: 143000 }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { surfaceArea: 143000 });
          expectNewCurrentStep(initialRootState, newState, "SOILS_SELECTION");
        });
        describe("revert", () => {
          it("goes to previous step and unset surface area", () => {
            const store = new StoreBuilder()
              .withStepsHistory(["IS_FRICHE", "ADDRESS", "SOILS_SELECTION"])
              .withCreationData({ isFriche: true, surfaceArea: 12000 })
              .build();
            const initialRootState = store.getState();

            store.dispatch(revertSurfaceAreaStep());

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

          store.dispatch(completeSiteSurfaceArea({ surfaceArea: 143000 }));

          const newState = store.getState();
          expectSiteDataDiff(initialRootState, newState, { surfaceArea: 143000 });
          expect(newState.siteCreation.stepsHistory).toEqual(
            initialRootState.siteCreation.stepsHistory,
          );
        });
      });
    });
  });
  describe("SOILS_SELECTION", () => {
    describe("complete", () => {
      it("goes to SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE step and sets soils when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["SOILS_SELECTION"]).build();
        const initialRootState = store.getState();

        store.dispatch(completeSoils({ soils: siteWithExhaustiveData.soils }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { soils: siteWithExhaustiveData.soils });
        expectNewCurrentStep(
          initialRootState,
          newState,
          "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
        );
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset soils data", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["IS_FRICHE", "ADDRESS", "SOILS_SELECTION"])
          .withCreationData({ isFriche: true, soils: siteWithExhaustiveData.soils })
          .build();
        const initialRootState = store.getState();

        store.dispatch(revertSoilsSelectionStep());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { soils: [] });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
  describe("SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE", () => {
    describe("complete", () => {
      it("goes to SOILS_SUMMARY step when step is completed with default_even_split", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE"])
          .withCreationData({
            surfaceArea: 100000,
            soils: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "BUILDINGS", "FOREST_CONIFER"],
          })
          .build();

        const initialRootState = store.getState();

        store.dispatch(soilsSurfaceAreaDistributionEntryModeCompleted("default_even_split"));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          soilsDistributionEntryMode: "default_even_split",
          soilsDistribution: {
            ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED"]: 33333.33,
            ["BUILDINGS"]: 33333.33,
            ["FOREST_CONIFER"]: 33333.34,
          },
        });
        expectNewCurrentStep(initialRootState, newState, "SOILS_SUMMARY");
      });
    });

    it("goes to SOILS_SURFACE_AREAS_DISTRIBUTION step when step is completed with square_meters_or_percentage", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE"])
        .withCreationData({
          surfaceArea: 100000,
          soils: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "BUILDINGS", "FOREST_CONIFER"],
        })
        .build();

      const initialRootState = store.getState();

      store.dispatch(soilsSurfaceAreaDistributionEntryModeCompleted("square_meters_or_percentage"));

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, {
        soilsDistributionEntryMode: "square_meters_or_percentage",
      });
      expectNewCurrentStep(initialRootState, newState, "SOILS_SURFACE_AREAS_DISTRIBUTION");
    });
    describe("revert", () => {
      it("goes to previous step and unset soils distribution entry mode and surface areas", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "IS_FRICHE",
            "ADDRESS",
            "SOILS_SELECTION",
            "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
          ])
          .withCreationData({
            isFriche: true,
            soils: siteWithExhaustiveData.soils,
            soilsDistribution: siteWithExhaustiveData.soilsDistribution,
            soilsDistributionEntryMode: siteWithExhaustiveData.soilsDistributionEntryMode,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(revertSoilsSurfaceAreaDistributionEntryModeStep());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          soilsDistribution: undefined,
          soilsDistributionEntryMode: undefined,
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
  describe("SOILS_SURFACE_AREAS_DISTRIBUTION", () => {
    describe("complete", () => {
      it("goes to SOILS_SUMMARY step and sets soils distribution when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SOILS_SURFACE_AREAS_DISTRIBUTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          completeSoilsDistribution({ distribution: siteWithExhaustiveData.soilsDistribution }),
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
            "SOILS_SELECTION",
            "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
            "SOILS_SURFACE_AREAS_DISTRIBUTION",
          ])
          .withCreationData({
            isFriche: true,
            soils: siteWithExhaustiveData.soils,
            soilsDistribution: siteWithExhaustiveData.soilsDistribution,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(revertSoilsDistributionStep());

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

        store.dispatch(completeSoilsSummary());

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

        store.dispatch(completeSoilsCarbonStorage());

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

        store.dispatch(completeSoilsCarbonStorage());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "MANAGEMENT_INTRODUCTION");
      });
    });
  });
});
