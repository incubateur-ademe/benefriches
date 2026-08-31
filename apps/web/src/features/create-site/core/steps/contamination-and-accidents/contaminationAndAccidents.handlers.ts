import type {
  CustomAnswerStepHandler,
  CustomInfoStepHandler,
} from "../../custom/stepHandlerRegistry";

export const contaminationAndAccidentsHandlers = {
  answerSteps: {
    SOILS_CONTAMINATION: {
      stepId: "SOILS_CONTAMINATION",
      getNextStepId: () => "FRICHE_ACCIDENTS_INTRODUCTION",
      updateAnswersMiddleware: (_params, answers) => ({
        hasContaminatedSoils: answers.hasContaminatedSoils,
        ...(answers.hasContaminatedSoils &&
          answers.contaminatedSoilSurface !== undefined && {
            contaminatedSoilSurface: answers.contaminatedSoilSurface,
          }),
      }),
    } satisfies CustomAnswerStepHandler<"SOILS_CONTAMINATION">,

    FRICHE_ACCIDENTS: {
      stepId: "FRICHE_ACCIDENTS",
      getNextStepId: () => "MANAGEMENT_INTRODUCTION",
      updateAnswersMiddleware: (_params, answers) =>
        answers.hasRecentAccidents
          ? {
              hasRecentAccidents: true,
              accidentsMinorInjuries: answers.accidentsMinorInjuries ?? 0,
              accidentsSevereInjuries: answers.accidentsSevereInjuries ?? 0,
              accidentsDeaths: answers.accidentsDeaths ?? 0,
            }
          : { hasRecentAccidents: false },
    } satisfies CustomAnswerStepHandler<"FRICHE_ACCIDENTS">,
  },

  infoSteps: {
    SOILS_CONTAMINATION_INTRODUCTION: {
      stepId: "SOILS_CONTAMINATION_INTRODUCTION",
      getNextStepId: () => "SOILS_CONTAMINATION",
    } satisfies CustomInfoStepHandler,

    FRICHE_ACCIDENTS_INTRODUCTION: {
      stepId: "FRICHE_ACCIDENTS_INTRODUCTION",
      getNextStepId: () => "FRICHE_ACCIDENTS",
    } satisfies CustomInfoStepHandler,
  },
};
