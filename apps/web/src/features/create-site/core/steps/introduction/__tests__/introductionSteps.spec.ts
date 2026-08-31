import { describe, expect, it } from "vitest";

import { StoreBuilder, expectCurrentStep } from "../../../__tests__/creation-steps/testUtils";
import { stepReverted } from "../../../actions/revert.action";
import {
  createModeSelectionCompleted,
  introductionStepCompleted,
  isFricheCompleted,
  mutabilityOrImpactsSelectionCompleted,
  siteCreationInitiated,
  siteNatureCompleted,
} from "../introduction.actions";

describe("Site creation: introduction steps (intro, nature, creation mode)", () => {
  describe("initial state", () => {
    it("starts with CREATE_MODE_SELECTION step", () => {
      const store = new StoreBuilder().build();

      store.dispatch(siteCreationInitiated());

      expect(store.getState().siteCreation.stepsHistory).toEqual(["CREATE_MODE_SELECTION"]);
    });

    it("starts with INTRODUCTION step when asked to use custom mode", () => {
      const store = new StoreBuilder().build();

      store.dispatch(siteCreationInitiated({ createMode: "custom" }));

      expect(store.getState().siteCreation.createMode).toEqual("custom");
      expect(store.getState().siteCreation.stepsHistory).toEqual(["INTRODUCTION"]);
    });

    it("starts with demo steps when asked to use express mode", () => {
      const store = new StoreBuilder().build();

      store.dispatch(siteCreationInitiated({ createMode: "express" }));
      expect(store.getState().siteCreation.createMode).toEqual("express");
      expect(store.getState().siteCreation.stepsHistory).toEqual([]);
    });

    it("sets true to skipUseMutability in store", () => {
      const store = new StoreBuilder().build();

      store.dispatch(siteCreationInitiated({ evaluationMode: "impacts" }));

      expect(store.getState().siteCreation.skipUseMutability).toEqual(true);
    });
  });

  describe("CREATE_MODE_SELECTION", () => {
    it("goes to INTRODUCTION step when custom mode is selected", () => {
      const store = new StoreBuilder().withStepsHistory(["CREATE_MODE_SELECTION"]).build();

      store.dispatch(createModeSelectionCompleted({ createMode: "custom" }));

      expectCurrentStep(store, "INTRODUCTION");
    });

    it("goes to DEMO_INTRODUCTION step when express mode is selected", () => {
      const store = new StoreBuilder().withStepsHistory(["CREATE_MODE_SELECTION"]).build();

      store.dispatch(createModeSelectionCompleted({ createMode: "express" }));

      const newState = store.getState();
      expect(newState.siteCreation.createMode).toEqual("express");
      expect(newState.siteCreation.demo.currentStep).toEqual("DEMO_INTRODUCTION");
    });
  });

  describe("INTRODUCTION", () => {
    it("goes to IS_FRICHE step when step completed", () => {
      const store = new StoreBuilder().withStepsHistory(["INTRODUCTION"]).build();

      store.dispatch(introductionStepCompleted());

      expectCurrentStep(store, "IS_FRICHE");
    });
  });

  describe("IS_FRICHE", () => {
    it("goes to SITE_NATURE step when step is completed and site is not a friche", () => {
      const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "IS_FRICHE"]).build();

      store.dispatch(isFricheCompleted({ isFriche: false }));

      expect(store.getState().siteCreation.isFriche).toEqual(false);
      expectCurrentStep(store, "SITE_NATURE");
    });

    it("goes to USE_MUTABILITY step and sets site nature to friche when step is completed and site is a friche", () => {
      const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "IS_FRICHE"]).build();

      store.dispatch(isFricheCompleted({ isFriche: true }));

      const newState = store.getState().siteCreation;
      expect(newState.isFriche).toEqual(true);
      expect(newState.nature).toEqual("FRICHE");
      expectCurrentStep(store, "USE_MUTABILITY");
    });

    it("enters the custom engine directly on FRICHE_ACTIVITY when skipUseMutability is true", () => {
      const store = new StoreBuilder()
        .withSkipUseMutability(true)
        .withStepsHistory(["INTRODUCTION", "IS_FRICHE"])
        .build();

      store.dispatch(isFricheCompleted({ isFriche: true }));

      expect(store.getState().siteCreation.customFlowStarted).toBe(true);
      expectCurrentStep(store, "FRICHE_ACTIVITY");
    });

    it("goes back to INTRODUCTION when reverted", () => {
      const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "IS_FRICHE"]).build();

      store.dispatch(stepReverted());

      expectCurrentStep(store, "INTRODUCTION");
    });
  });

  describe("USE_MUTABILITY", () => {
    it("enters the custom engine on FRICHE_ACTIVITY when useMutability is false", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["INTRODUCTION", "IS_FRICHE", "USE_MUTABILITY"])
        .build();

      store.dispatch(mutabilityOrImpactsSelectionCompleted({ useMutability: false }));

      expect(store.getState().siteCreation.customFlowStarted).toBe(true);
      expectCurrentStep(store, "FRICHE_ACTIVITY");
    });

    it("goes back to IS_FRICHE when reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["INTRODUCTION", "IS_FRICHE", "USE_MUTABILITY"])
        .build();

      store.dispatch(stepReverted());

      expectCurrentStep(store, "IS_FRICHE");
    });
  });

  describe("SITE_NATURE", () => {
    it("enters the custom engine on FRICHE_ACTIVITY when nature is FRICHE", () => {
      const store = new StoreBuilder().withStepsHistory(["IS_FRICHE", "SITE_NATURE"]).build();

      store.dispatch(siteNatureCompleted({ nature: "FRICHE" }));

      expect(store.getState().siteCreation.nature).toEqual("FRICHE");
      expectCurrentStep(store, "FRICHE_ACTIVITY");
    });

    it("enters the custom engine on AGRICULTURAL_OPERATION_ACTIVITY when nature is AGRICULTURAL_OPERATION", () => {
      const store = new StoreBuilder().withStepsHistory(["IS_FRICHE", "SITE_NATURE"]).build();

      store.dispatch(siteNatureCompleted({ nature: "AGRICULTURAL_OPERATION" }));

      expectCurrentStep(store, "AGRICULTURAL_OPERATION_ACTIVITY");
    });

    it("enters the custom engine on NATURAL_AREA_TYPE when nature is NATURAL_AREA", () => {
      const store = new StoreBuilder().withStepsHistory(["IS_FRICHE", "SITE_NATURE"]).build();

      store.dispatch(siteNatureCompleted({ nature: "NATURAL_AREA" }));

      expectCurrentStep(store, "NATURAL_AREA_TYPE");
    });

    it("enters the custom engine on URBAN_ZONE_TYPE when nature is URBAN_ZONE", () => {
      const store = new StoreBuilder().withStepsHistory(["IS_FRICHE", "SITE_NATURE"]).build();

      store.dispatch(siteNatureCompleted({ nature: "URBAN_ZONE" }));

      expectCurrentStep(store, "URBAN_ZONE_TYPE");
    });

    it("goes back to IS_FRICHE when reverted", () => {
      const store = new StoreBuilder()
        .withCreationData({ nature: "NATURAL_AREA" })
        .withStepsHistory(["IS_FRICHE", "SITE_NATURE"])
        .build();

      store.dispatch(stepReverted());

      expectCurrentStep(store, "IS_FRICHE");
    });
  });
});
