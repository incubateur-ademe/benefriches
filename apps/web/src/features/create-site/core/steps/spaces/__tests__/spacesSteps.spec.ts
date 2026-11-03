import type { Address } from "shared";
import { getSoilsDistributionForFricheActivity } from "shared";
import { describe, expect, it } from "vitest";

import { StoreBuilder, expectCurrentStep } from "../../../__tests__/creation-steps/testUtils";
import { customFormActions } from "../../../custom/custom.actions";

const ADDRESS: Address = {
  banId: "75056_1",
  value: "1 Rue de Paris 75001 Paris",
  city: "Paris",
  cityCode: "75056",
  postCode: "75001",
  long: 2.35,
  lat: 48.85,
};

const SPACES_NATURES = [
  { nature: "FRICHE", isFriche: true },
  { nature: "AGRICULTURAL_OPERATION", isFriche: false },
  { nature: "NATURAL_AREA", isFriche: false },
] as const;

describe("Site creation: spaces steps", () => {
  describe.each(SPACES_NATURES)(
    "MISSING_INFORMATION for a $nature site",
    ({ nature, isFriche }) => {
      // Starts on ADDRESS: completing it computes the steps sequence back navigation walks.
      const buildStoreOnSpacesIntroduction = () => {
        const store = new StoreBuilder()
          .withIsFriche(isFriche)
          .withNature(nature)
          .withCustomStep("ADDRESS")
          .build();
        store.dispatch(
          customFormActions.stepCompletionRequested({
            stepId: "ADDRESS",
            answers: { address: ADDRESS },
          }),
        );
        return store;
      };

      it("is shown after the spaces introduction, then leads to SURFACE_AREA", () => {
        const store = buildStoreOnSpacesIntroduction();
        expectCurrentStep(store, "SPACES_INTRODUCTION");

        store.dispatch(customFormActions.nextStepRequested());
        expectCurrentStep(store, "MISSING_INFORMATION");

        store.dispatch(customFormActions.nextStepRequested());
        expectCurrentStep(store, "SURFACE_AREA");
      });

      it("goes back from SURFACE_AREA to MISSING_INFORMATION, then to the spaces introduction", () => {
        const store = buildStoreOnSpacesIntroduction();
        store.dispatch(customFormActions.nextStepRequested());
        store.dispatch(customFormActions.nextStepRequested());

        store.dispatch(customFormActions.previousStepRequested());
        expectCurrentStep(store, "MISSING_INFORMATION");

        store.dispatch(customFormActions.previousStepRequested());
        expectCurrentStep(store, "SPACES_INTRODUCTION");
      });
    },
  );

  describe("SURFACE_AREA", () => {
    it("goes to SPACES_KNOWLEDGE for a non urban-zone nature", () => {
      const store = new StoreBuilder().withCustomStep("SURFACE_AREA").build();

      store.dispatch(
        customFormActions.stepCompletionRequested({
          stepId: "SURFACE_AREA",
          answers: { surfaceArea: 30000 },
        }),
      );

      expectCurrentStep(store, "SPACES_KNOWLEDGE");
    });

    it("hands off to the urban-zone sub-flow for an urban-zone nature", () => {
      const store = new StoreBuilder()
        .withNature("URBAN_ZONE")
        .withCustomStep("SURFACE_AREA")
        .build();

      store.dispatch(
        customFormActions.stepCompletionRequested({
          stepId: "SURFACE_AREA",
          answers: { surfaceArea: 7000 },
        }),
      );

      const state = store.getState().siteCreation;
      expect(state.customHandedOffToUrbanZone).toBe(true);
      expectCurrentStep(store, state.urbanZone.currentStep);
    });
  });

  describe("SPACES_KNOWLEDGE", () => {
    it("goes to SPACES_SELECTION when the soils are known", () => {
      const store = new StoreBuilder().withCustomStep("SPACES_KNOWLEDGE").build();

      store.dispatch(
        customFormActions.stepCompletionRequested({
          stepId: "SPACES_KNOWLEDGE",
          answers: { knowsSpaces: true },
        }),
      );

      expectCurrentStep(store, "SPACES_SELECTION");
    });

    it("auto-derives the soils distribution from the friche activity when unknown, and skips to SOILS_SUMMARY", () => {
      const store = new StoreBuilder()
        .withIsFriche(true)
        .withNature("FRICHE")
        .withCustomStep("SPACES_KNOWLEDGE", {
          FRICHE_ACTIVITY: { completed: true, payload: "INDUSTRY" },
          SURFACE_AREA: { completed: true, payload: { surfaceArea: 30000 } },
        })
        .build();

      store.dispatch(
        customFormActions.stepCompletionRequested({
          stepId: "SPACES_KNOWLEDGE",
          answers: { knowsSpaces: false },
        }),
      );

      expectCurrentStep(store, "SOILS_SUMMARY");
      expect(store.getState().siteCreation.custom.steps.SPACES_KNOWLEDGE?.payload).toEqual({
        knowsSpaces: false,
        soilsDistribution: getSoilsDistributionForFricheActivity(30000, "INDUSTRY"),
        soils: Object.keys(getSoilsDistributionForFricheActivity(30000, "INDUSTRY")),
      });
    });
  });

  describe("SPACES_SELECTION", () => {
    it("auto-fills the soils distribution and jumps to SOILS_CARBON_STORAGE when a single soil is selected", () => {
      const store = new StoreBuilder()
        .withCustomStep("SPACES_SELECTION", {
          SURFACE_AREA: { completed: true, payload: { surfaceArea: 10000 } },
        })
        .build();

      store.dispatch(
        customFormActions.stepCompletionRequested({
          stepId: "SPACES_SELECTION",
          answers: { soils: ["BUILDINGS"] },
        }),
      );

      expectCurrentStep(store, "SOILS_CARBON_STORAGE");
      expect(store.getState().siteCreation.custom.steps.SPACES_SELECTION?.payload).toEqual({
        soils: ["BUILDINGS"],
        soilsDistribution: { BUILDINGS: 10000 },
      });
    });

    it("asks for the surface-area distribution knowledge when several soils are selected", () => {
      const store = new StoreBuilder().withCustomStep("SPACES_SELECTION").build();

      store.dispatch(
        customFormActions.stepCompletionRequested({
          stepId: "SPACES_SELECTION",
          answers: { soils: ["BUILDINGS", "MINERAL_SOIL"] },
        }),
      );

      expectCurrentStep(store, "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE");
    });
  });

  describe("SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE", () => {
    it("asks for the distribution when known", () => {
      const store = new StoreBuilder()
        .withCustomStep("SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE")
        .build();

      store.dispatch(
        customFormActions.stepCompletionRequested({
          stepId: "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE",
          answers: { knowsSurfaceAreas: true },
        }),
      );

      expectCurrentStep(store, "SPACES_SURFACE_AREA_DISTRIBUTION");
    });

    it("splits the surface evenly across soils when unknown, and goes to SOILS_SUMMARY", () => {
      const store = new StoreBuilder()
        .withCustomStep("SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE", {
          SURFACE_AREA: { completed: true, payload: { surfaceArea: 10000 } },
          SPACES_SELECTION: { completed: true, payload: { soils: ["BUILDINGS", "MINERAL_SOIL"] } },
        })
        .build();

      store.dispatch(
        customFormActions.stepCompletionRequested({
          stepId: "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE",
          answers: { knowsSurfaceAreas: false },
        }),
      );

      expectCurrentStep(store, "SOILS_SUMMARY");
      expect(
        store.getState().siteCreation.custom.steps.SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE
          ?.payload,
      ).toEqual({
        knowsSurfaceAreas: false,
        soilsDistribution: { BUILDINGS: 5000, MINERAL_SOIL: 5000 },
      });
    });
  });

  it("SPACES_SURFACE_AREA_DISTRIBUTION: goes to SOILS_SUMMARY", () => {
    const store = new StoreBuilder().withCustomStep("SPACES_SURFACE_AREA_DISTRIBUTION").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "SPACES_SURFACE_AREA_DISTRIBUTION",
        answers: { distribution: { BUILDINGS: 20000, MINERAL_SOIL: 10000 } },
      }),
    );

    expectCurrentStep(store, "SOILS_SUMMARY");
  });
});
