import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import {
  getLastBuildingsChapterStep,
  shouldEnterBuildingsChapter,
} from "../../buildings/buildingsReaders";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const InvolvesReinstatementHandler = {
  stepId: "URBAN_PROJECT_INVOLVES_REINSTATEMENT",

  getPreviousStepId(context) {
    if (shouldEnterBuildingsChapter(context)) {
      return getLastBuildingsChapterStep(context);
    }
    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },

  getNextStepId(context, answers) {
    const involvesReinstatement =
      answers?.involvesReinstatement ??
      ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_PROJECT_INVOLVES_REINSTATEMENT")
        ?.involvesReinstatement;

    if (involvesReinstatement === false) {
      return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
    }
    return "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION";
  },

  getDependencyRules(context, answers) {
    const previousAnswer = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
    )?.involvesReinstatement;

    // Switching from true (or undefined) to false: delete all reinstatement-dependent steps
    if (answers.involvesReinstatement === false && previousAnswer !== false) {
      const rules = [];

      if (
        ReadStateHelper.getStep(context.stepsState, "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION")
      ) {
        rules.push({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          action: "delete",
        } as const);
      }
      if (
        ReadStateHelper.getStep(
          context.stepsState,
          "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
        )
      ) {
        rules.push({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
          action: "delete",
        } as const);
      }
      if (ReadStateHelper.getStep(context.stepsState, "URBAN_PROJECT_EXPENSES_REINSTATEMENT")) {
        rules.push({ stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT", action: "delete" } as const);
      }
      if (
        ReadStateHelper.getStep(
          context.stepsState,
          "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
        )
      ) {
        rules.push({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
          action: "delete",
        } as const);
      }
      if (ReadStateHelper.getStep(context.stepsState, "URBAN_PROJECT_SCHEDULE_PROJECTION")) {
        rules.push({ stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION", action: "invalidate" } as const);
      }
      return rules;
    }

    return [];
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_INVOLVES_REINSTATEMENT">;
