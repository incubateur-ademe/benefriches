import {
  expectNewCurrentStep,
  expectSiteDataDiff,
  expectSiteDataUnchanged,
  expectStepReverted,
  StoreBuilder,
} from "../../../__tests__/creation-steps/testUtils";
import { stepReverted } from "../../../actions/revert.action";
import { siteWithExhaustiveData } from "../../../siteData.mock";
import {
  fricheAccidentsIntroductionStepCompleted,
  fricheAccidentsStepCompleted,
  soilsContaminationIntroductionStepCompleted,
  soilsContaminationStepCompleted,
} from "../contaminationAndAccidents.actions";

describe("Site creation: soils contamination and friche accidents steps", () => {
  describe("SOILS_CONTAMINATION_INTRODUCTION", () => {
    describe("complete", () => {
      it("goes to SOILS_CONTAMINATION step when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SOILS_CONTAMINATION_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(soilsContaminationIntroductionStepCompleted());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "SOILS_CONTAMINATION");
      });
    });
  });
  describe("SOILS_CONTAMINATION", () => {
    describe("complete", () => {
      it("goes to FRICHE_ACCIDENTS_INTRODUCTION step and sets contamination data when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["SOILS_CONTAMINATION"]).build();
        const initialRootState = store.getState();

        store.dispatch(
          soilsContaminationStepCompleted({
            hasContaminatedSoils: true,
            contaminatedSoilSurface: 2500,
          }),
        );

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          hasContaminatedSoils: true,
          contaminatedSoilSurface: 2500,
        });
        expectNewCurrentStep(initialRootState, newState, "FRICHE_ACCIDENTS_INTRODUCTION");
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset soils contamination", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "IS_FRICHE",
            "ADDRESS",
            "SPACES_SELECTION",
            "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE",
            "SPACES_SURFACE_AREA_DISTRIBUTION",
            "SOILS_CONTAMINATION",
          ])
          .withCreationData({
            isFriche: true,
            soils: siteWithExhaustiveData.soils,
            hasContaminatedSoils: true,
            contaminatedSoilSurface: 12000,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepReverted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          hasContaminatedSoils: undefined,
          contaminatedSoilSurface: undefined,
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
  describe("FRICHE_ACCIDENTS_INTRODUCTION", () => {
    describe("complete", () => {
      it("goes to FRICHE_ACCIDENTS step when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["FRICHE_ACCIDENTS_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(fricheAccidentsIntroductionStepCompleted());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "FRICHE_ACCIDENTS");
      });
    });
  });
  describe("FRICHE_ACCIDENTS", () => {
    describe("complete", () => {
      it("goes to MANAGEMENT_INTRODUCTION step and sets accidents data when step is completed and friche has accidents", () => {
        const store = new StoreBuilder().withStepsHistory(["FRICHE_ACCIDENTS"]).build();
        const initialRootState = store.getState();

        store.dispatch(
          fricheAccidentsStepCompleted({
            hasRecentAccidents: true,
            accidentsDeaths: 1,
            accidentsSevereInjuries: 2,
            accidentsMinorInjuries: 3,
          }),
        );

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          hasRecentAccidents: true,
          accidentsDeaths: 1,
          accidentsSevereInjuries: 2,
          accidentsMinorInjuries: 3,
        });
        expectNewCurrentStep(initialRootState, newState, "MANAGEMENT_INTRODUCTION");
      });
      it("goes to MANAGEMENT_INTRODUCTION step and sets accidents data when step is completed and friche has no accident", () => {
        const store = new StoreBuilder().withStepsHistory(["FRICHE_ACCIDENTS"]).build();
        const initialRootState = store.getState();

        store.dispatch(fricheAccidentsStepCompleted({ hasRecentAccidents: false }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { hasRecentAccidents: false });
        expectNewCurrentStep(initialRootState, newState, "MANAGEMENT_INTRODUCTION");
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset friche accidents", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["IS_FRICHE", "ADDRESS", "FRICHE_ACCIDENTS"])
          .withCreationData({
            isFriche: true,
            hasRecentAccidents: true,
            accidentsDeaths: 1,
            accidentsSevereInjuries: 2,
            accidentsMinorInjuries: 0,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepReverted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          hasRecentAccidents: undefined,
          accidentsDeaths: undefined,
          accidentsSevereInjuries: undefined,
          accidentsMinorInjuries: undefined,
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
});
