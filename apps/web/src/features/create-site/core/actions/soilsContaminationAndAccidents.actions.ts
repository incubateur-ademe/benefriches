import { createStepCompletedAction, createStepRevertedAction } from "./actionsUtils";

export const soilsContaminationIntroductionStepCompleted = createStepCompletedAction(
  "SOILS_CONTAMINATION_INTRODUCTION",
);
export const soilsContaminationIntroductionStepReverted = () =>
  createStepRevertedAction("SOILS_CONTAMINATION_INTRODUCTION")();

export const soilsContaminationStepCompleted = createStepCompletedAction<{
  hasContaminatedSoils: boolean;
  contaminatedSoilSurface?: number;
}>("SOILS_CONTAMINATION");

export const soilsContaminationStepReverted = () =>
  createStepRevertedAction("SOILS_CONTAMINATION")({
    resetFields: ["hasContaminatedSoils", "contaminatedSoilSurface"],
  });

export const fricheAccidentsIntroductionStepCompleted = createStepCompletedAction(
  "FRICHE_ACCIDENTS_INTRODUCTION",
);
export const fricheAccidentsIntroductionStepReverted = () =>
  createStepRevertedAction("FRICHE_ACCIDENTS_INTRODUCTION")();
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
  createStepRevertedAction("FRICHE_ACCIDENTS")({
    resetFields: [
      "hasRecentAccidents",
      "accidentsMinorInjuries",
      "accidentsSevereInjuries",
      "accidentsDeaths",
    ],
  });
