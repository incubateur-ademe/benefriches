import { createStepCompletedAction } from "./actionsUtils";
import { createStepRevertAttempted } from "./revert.actions";

export const soilsContaminationIntroductionStepCompleted = createStepCompletedAction(
  "SOILS_CONTAMINATION_INTRODUCTION",
);
export const soilsContaminationIntroductionStepReverted = () =>
  createStepRevertAttempted("SOILS_CONTAMINATION_INTRODUCTION")();

export const soilsContaminationStepCompleted = createStepCompletedAction<{
  hasContaminatedSoils: boolean;
  contaminatedSoilSurface?: number;
}>("SOILS_CONTAMINATION");

export const soilsContaminationStepReverted = () =>
  createStepRevertAttempted("SOILS_CONTAMINATION")({
    resetFields: ["hasContaminatedSoils", "contaminatedSoilSurface"],
  });

export const fricheAccidentsIntroductionStepCompleted = createStepCompletedAction(
  "FRICHE_ACCIDENTS_INTRODUCTION",
);
export const fricheAccidentsIntroductionStepReverted = () =>
  createStepRevertAttempted("FRICHE_ACCIDENTS_INTRODUCTION")();
export const fricheAccidentsStepCompleted = createStepCompletedAction<
  | { hasRecentAccidents: false }
  | {
      hasRecentAccidents: true;
      accidentsMinorInjuries?: number;
      accidentsSevereInjuries?: number;
      accidentsDeaths?: number;
    }
>("FRICHE_ACCIDENTS");

export const fricheAccidentsStepReverted = () =>
  createStepRevertAttempted("FRICHE_ACCIDENTS")({
    resetFields: [
      "hasRecentAccidents",
      "accidentsMinorInjuries",
      "accidentsSevereInjuries",
      "accidentsDeaths",
    ],
  });
