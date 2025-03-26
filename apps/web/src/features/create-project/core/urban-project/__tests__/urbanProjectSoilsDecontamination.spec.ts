import { stepRevertAttempted } from "../../actions/actionsUtils";
import {
  soilsDecontaminationIntroductionCompleted,
  soilsDecontaminationSelectionCompleted,
  soilsDecontaminationSurfaceAreaCompleted,
} from "../actions/urbanProject.actions";
import { expectRevertedState, expectUpdatedState, StoreBuilder } from "./testUtils";

describe("Urban project custom creation : soils decontamination", () => {
  describe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION step", () => {
    it("goes to URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION step when step is completed", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION"])
        .build();
      const initialRootState = store.getState();

      store.dispatch(soilsDecontaminationIntroductionCompleted());

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
      });
    });

    it("goes to previous step when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
          "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",
        ])
        .build();
      const initialRootState = store.getState();

      store.dispatch(stepRevertAttempted());

      const newState = store.getState();
      expectRevertedState(initialRootState, newState, {});
    });
  });
  describe("URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION step", () => {
    it("goes to URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA step when step is completed with 'partial' option", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",
          "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        ])
        .build();
      const initialRootState = store.getState();

      store.dispatch(soilsDecontaminationSelectionCompleted("partial"));

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
        creationDataDiff: {
          decontaminationPlan: "partial",
        },
      });
    });
    it("goes to URBAN_PROJECT_BUILDINGS_INTRODUCTION step and set 0 to decontaminated surface when step is completed with 'none' option", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",
          "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        ])
        .withCreationData({
          livingAndActivitySpacesDistribution: { BUILDINGS: 1000 },
        })
        .build();
      const initialRootState = store.getState();

      store.dispatch(soilsDecontaminationSelectionCompleted("none"));

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
        creationDataDiff: {
          decontaminationPlan: "none",
          decontaminatedSurfaceArea: 0,
        },
      });
    });
    it("goes to URBAN_PROJECT_BUILDINGS_INTRODUCTION step when step is completed with 'unknown' option and assign default value", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",
          "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        ])
        .withSiteData({
          contaminatedSoilSurface: 1000,
        })
        .withCreationData({
          livingAndActivitySpacesDistribution: { BUILDINGS: 1000 },
        })
        .build();
      const initialRootState = store.getState();

      store.dispatch(soilsDecontaminationSelectionCompleted("unknown"));

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
        creationDataDiff: {
          decontaminationPlan: "unknown",
          decontaminatedSurfaceArea: 250,
        },
      });
    });

    it("goes to URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION step and set 0 to decontaminated surface when step is completed with 'none' option and there is no buildings in project", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",
          "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        ])
        .build();
      const initialRootState = store.getState();

      store.dispatch(soilsDecontaminationSelectionCompleted("none"));

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
        creationDataDiff: {
          decontaminationPlan: "none",
          decontaminatedSurfaceArea: 0,
        },
      });
    });
    it("goes to URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION step when step is completed with 'unknown' option and there is no buildings in project", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",
          "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        ])
        .withSiteData({
          contaminatedSoilSurface: 1000,
        })
        .build();
      const initialRootState = store.getState();

      store.dispatch(soilsDecontaminationSelectionCompleted("unknown"));

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
        creationDataDiff: {
          decontaminationPlan: "unknown",
          decontaminatedSurfaceArea: 250,
        },
      });
    });
    it("goes to previous step and unset space categories when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",
          "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
        ])
        .withCreationData({ decontaminatedSurfaceArea: 100, decontaminationPlan: "partial" })
        .build();
      const initialRootState = store.getState();

      store.dispatch(stepRevertAttempted());

      const newState = store.getState();
      expectRevertedState(initialRootState, newState, {
        creationDataDiff: {
          decontaminatedSurfaceArea: undefined,
          decontaminationPlan: undefined,
        },
      });
    });
  });
  describe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA step", () => {
    it("goes to URBAN_PROJECT_BUILDINGS_INTRODUCTION and sets decontaminated surface area when step is completed", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
        ])
        .withCreationData({ livingAndActivitySpacesDistribution: { BUILDINGS: 5000 } })
        .build();
      const initialRootState = store.getState();

      store.dispatch(soilsDecontaminationSurfaceAreaCompleted(120));

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
        creationDataDiff: {
          decontaminatedSurfaceArea: 120,
        },
      });
    });
    it("goes to URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION and sets decontaminated surface area when step is completed and there is no buildings in project", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
        ])
        .build();
      const initialRootState = store.getState();

      store.dispatch(soilsDecontaminationSurfaceAreaCompleted(120));

      const newState = store.getState();
      expectUpdatedState(initialRootState, newState, {
        currentStep: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
        creationDataDiff: {
          decontaminatedSurfaceArea: 120,
        },
      });
    });
    it("goes to previous step and unsets decontaminated surface area when step is reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
        ])
        .withCreationData({ decontaminatedSurfaceArea: 120 })
        .build();
      const initialRootState = store.getState();

      store.dispatch(stepRevertAttempted());

      const newState = store.getState();
      expectRevertedState(initialRootState, newState, {
        creationDataDiff: {
          decontaminatedSurfaceArea: undefined,
        },
      });
    });
  });
});
