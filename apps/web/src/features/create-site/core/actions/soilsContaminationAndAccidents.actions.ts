import { createStepCompletedAction } from "./actionsUtils";

export const soilsContaminationIntroductionStepCompleted = createStepCompletedAction(
  "SOILS_CONTAMINATION_INTRODUCTION",
);

export const soilsContaminationStepCompleted = createStepCompletedAction<{
  hasContaminatedSoils: boolean;
  contaminatedSoilSurface?: number;
}>("SOILS_CONTAMINATION");

export const fricheAccidentsIntroductionStepCompleted = createStepCompletedAction(
  "FRICHE_ACCIDENTS_INTRODUCTION",
);
export const fricheAccidentsStepCompleted = createStepCompletedAction<
  | { hasRecentAccidents: false }
  | {
      hasRecentAccidents: true;
      accidentsMinorInjuries?: number;
      accidentsSevereInjuries?: number;
      accidentsDeaths?: number;
    }
>("FRICHE_ACCIDENTS");
