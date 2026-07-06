import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import {
  createModeCompleted,
  developmentPlanCategoriesCompleted,
  projectPhaseCompleted,
  projectUseCaseSelectionStepGroupNavigated,
  renewableEnergyTypeCompleted,
  stepReverted,
} from "./useCaseSelection.actions";

const createTestStore = () => createStore(getTestAppDependencies());

const getUseCaseSelection = (store: ReturnType<typeof createTestStore>) =>
  store.getState().projectCreation.useCaseSelection;

const getCurrentFlow = (store: ReturnType<typeof createTestStore>) =>
  store.getState().projectCreation.currentProjectFlow;

describe("useCaseSelection reducer", () => {
  describe("projectPhaseCompleted", () => {
    const phasesRequiringDirectTypeSelection = [
      "construction",
      "design",
      "completed",
      "planning",
    ] as const;

    for (const phase of phasesRequiringDirectTypeSelection) {
      it(`advances directly to PROJECT_TYPE_SELECTION in custom mode for ${phase} phase`, () => {
        const store = createTestStore();
        store.dispatch(projectPhaseCompleted(phase));
        expect(getUseCaseSelection(store)).toEqual({
          stepsSequence: [
            "USE_CASE_SELECTION_PROJECT_PHASE",
            "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
          ],
          currentStep: "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
          creationMode: "custom",
          projectPhase: phase,
          projectDevelopmentPlan: undefined,
          projectSuggestions: undefined,
        });
      });
    }

    it("advances to CREATION_MODE for setup phase", () => {
      const store = createTestStore();
      store.dispatch(projectPhaseCompleted("setup"));
      expect(getUseCaseSelection(store)).toEqual({
        stepsSequence: ["USE_CASE_SELECTION_PROJECT_PHASE", "USE_CASE_SELECTION_CREATION_MODE"],
        currentStep: "USE_CASE_SELECTION_CREATION_MODE",
        creationMode: undefined,
        projectPhase: "setup",
        projectDevelopmentPlan: undefined,
        projectSuggestions: undefined,
      });
    });

    it("advances to CREATION_MODE for unknown phase", () => {
      const store = createTestStore();
      store.dispatch(projectPhaseCompleted("unknown"));
      expect(getUseCaseSelection(store)).toEqual({
        stepsSequence: ["USE_CASE_SELECTION_PROJECT_PHASE", "USE_CASE_SELECTION_CREATION_MODE"],
        currentStep: "USE_CASE_SELECTION_CREATION_MODE",
        creationMode: undefined,
        projectPhase: "unknown",
        projectDevelopmentPlan: undefined,
        projectSuggestions: undefined,
      });
    });
  });

  describe("createModeCompleted", () => {
    it("sets flow to DEMO when express mode selected", () => {
      const store = createTestStore();
      store.dispatch(projectPhaseCompleted("setup"));
      store.dispatch(createModeCompleted("express"));
      expect(getCurrentFlow(store)).toBe("DEMO");
      expect(getUseCaseSelection(store)).toEqual({
        stepsSequence: ["USE_CASE_SELECTION_PROJECT_PHASE", "USE_CASE_SELECTION_CREATION_MODE"],
        currentStep: "USE_CASE_SELECTION_CREATION_MODE",
        creationMode: "express",
        projectPhase: "setup",
        projectDevelopmentPlan: undefined,
        projectSuggestions: undefined,
      });
    });

    it("adds PROJECT_TYPE_SELECTION step when custom mode selected", () => {
      const store = createTestStore();
      store.dispatch(projectPhaseCompleted("setup"));
      store.dispatch(createModeCompleted("custom"));
      expect(getUseCaseSelection(store)).toEqual({
        stepsSequence: [
          "USE_CASE_SELECTION_PROJECT_PHASE",
          "USE_CASE_SELECTION_CREATION_MODE",
          "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
        ],
        currentStep: "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
        creationMode: "custom",
        projectPhase: "setup",
        projectDevelopmentPlan: undefined,
        projectSuggestions: undefined,
      });
    });
  });

  describe("developmentPlanCategoriesCompleted", () => {
    it("sets currentProjectFlow to URBAN_PROJECT when URBAN_PROJECT selected", () => {
      const store = createTestStore();
      store.dispatch(projectPhaseCompleted("construction"));
      store.dispatch(developmentPlanCategoriesCompleted("URBAN_PROJECT"));
      expect(getCurrentFlow(store)).toBe("URBAN_PROJECT");
      expect(getUseCaseSelection(store)).toEqual({
        stepsSequence: [
          "USE_CASE_SELECTION_PROJECT_PHASE",
          "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
        ],
        currentStep: "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
        creationMode: "custom",
        projectPhase: "construction",
        projectDevelopmentPlan: { category: "URBAN_PROJECT", type: "URBAN_PROJECT" },
        projectSuggestions: undefined,
      });
    });

    it("adds RENEWABLE_ENERGY_TYPE step when RENEWABLE_ENERGY selected", () => {
      const store = createTestStore();
      store.dispatch(projectPhaseCompleted("construction"));
      store.dispatch(developmentPlanCategoriesCompleted("RENEWABLE_ENERGY"));
      expect(getUseCaseSelection(store)).toEqual({
        stepsSequence: [
          "USE_CASE_SELECTION_PROJECT_PHASE",
          "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
          "USE_CASE_SELECTION_RENEWABLE_ENERGY_TYPE",
        ],
        currentStep: "USE_CASE_SELECTION_RENEWABLE_ENERGY_TYPE",
        creationMode: "custom",
        projectPhase: "construction",
        projectDevelopmentPlan: { category: "RENEWABLE_ENERGY" },
        projectSuggestions: undefined,
      });
    });

    it("does not add RENEWABLE_ENERGY_TYPE step for non-renewable category", () => {
      const store = createTestStore();
      store.dispatch(projectPhaseCompleted("construction"));
      store.dispatch(developmentPlanCategoriesCompleted("NATURAL_URBAN_SPACES"));
      expect(getUseCaseSelection(store)).toEqual({
        stepsSequence: [
          "USE_CASE_SELECTION_PROJECT_PHASE",
          "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
        ],
        currentStep: "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
        creationMode: "custom",
        projectPhase: "construction",
        projectDevelopmentPlan: { category: "NATURAL_URBAN_SPACES" },
        projectSuggestions: undefined,
      });
    });

    it("adds RENEWABLE_ENERGY_TYPE when RENEWABLE_ENERGY selected in custom mode (setup phase)", () => {
      const store = createTestStore();
      store.dispatch(projectPhaseCompleted("setup"));
      store.dispatch(createModeCompleted("custom"));
      store.dispatch(developmentPlanCategoriesCompleted("RENEWABLE_ENERGY"));
      expect(getUseCaseSelection(store)).toEqual({
        stepsSequence: [
          "USE_CASE_SELECTION_PROJECT_PHASE",
          "USE_CASE_SELECTION_CREATION_MODE",
          "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
          "USE_CASE_SELECTION_RENEWABLE_ENERGY_TYPE",
        ],
        currentStep: "USE_CASE_SELECTION_RENEWABLE_ENERGY_TYPE",
        creationMode: "custom",
        projectPhase: "setup",
        projectDevelopmentPlan: { category: "RENEWABLE_ENERGY" },
        projectSuggestions: undefined,
      });
    });
  });

  describe("renewableEnergyTypeCompleted", () => {
    it("sets flow to PHOTOVOLTAIC_POWER_PLANT when photovoltaic selected", () => {
      const store = createTestStore();
      store.dispatch(renewableEnergyTypeCompleted("PHOTOVOLTAIC_POWER_PLANT"));
      expect(getCurrentFlow(store)).toBe("PHOTOVOLTAIC_POWER_PLANT");
      expect(getUseCaseSelection(store)).toEqual({
        stepsSequence: ["USE_CASE_SELECTION_PROJECT_PHASE"],
        currentStep: "USE_CASE_SELECTION_PROJECT_PHASE",
        creationMode: undefined,
        projectPhase: undefined,
        projectDevelopmentPlan: {
          category: "RENEWABLE_ENERGY",
          type: "PHOTOVOLTAIC_POWER_PLANT",
        },
        projectSuggestions: undefined,
      });
    });

    it("sets plan type to undefined for non-photovoltaic renewable energy", () => {
      const store = createTestStore();
      store.dispatch(renewableEnergyTypeCompleted("AGRIVOLTAIC"));
      expect(getUseCaseSelection(store)).toEqual({
        stepsSequence: ["USE_CASE_SELECTION_PROJECT_PHASE"],
        currentStep: "USE_CASE_SELECTION_PROJECT_PHASE",
        creationMode: undefined,
        projectPhase: undefined,
        projectDevelopmentPlan: { category: "RENEWABLE_ENERGY", type: undefined },
        projectSuggestions: undefined,
      });
    });
  });

  describe("stepReverted", () => {
    it("goes back to previous step", () => {
      const store = createTestStore();
      store.dispatch(projectPhaseCompleted("construction"));
      store.dispatch(stepReverted());
      expect(getUseCaseSelection(store)).toEqual({
        stepsSequence: [
          "USE_CASE_SELECTION_PROJECT_PHASE",
          "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
        ],
        currentStep: "USE_CASE_SELECTION_PROJECT_PHASE",
        creationMode: "custom",
        projectPhase: "construction",
        projectDevelopmentPlan: undefined,
        projectSuggestions: undefined,
      });
    });

    it("stays on first step when already at the beginning", () => {
      const store = createTestStore();
      store.dispatch(stepReverted());
      expect(getUseCaseSelection(store)).toEqual({
        stepsSequence: ["USE_CASE_SELECTION_PROJECT_PHASE"],
        currentStep: "USE_CASE_SELECTION_PROJECT_PHASE",
        creationMode: undefined,
        projectPhase: undefined,
        projectDevelopmentPlan: undefined,
        projectSuggestions: undefined,
      });
    });
  });

  describe("projectUseCaseSelectionStepGroupNavigated", () => {
    it("sets current step to the specified step and flow to USE_CASE_SELECTION", () => {
      const store = createTestStore();
      store.dispatch(projectPhaseCompleted("construction"));
      store.dispatch(projectUseCaseSelectionStepGroupNavigated("USE_CASE_SELECTION_PROJECT_PHASE"));
      expect(getCurrentFlow(store)).toBe("USE_CASE_SELECTION");
      expect(getUseCaseSelection(store)).toEqual({
        stepsSequence: [
          "USE_CASE_SELECTION_PROJECT_PHASE",
          "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
        ],
        currentStep: "USE_CASE_SELECTION_PROJECT_PHASE",
        creationMode: "custom",
        projectPhase: "construction",
        projectDevelopmentPlan: undefined,
        projectSuggestions: undefined,
      });
    });
  });
});
