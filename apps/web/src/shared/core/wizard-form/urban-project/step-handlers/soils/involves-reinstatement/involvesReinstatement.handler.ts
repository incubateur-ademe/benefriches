import { ReadStateHelper } from "@/shared/core/wizard-form/urban-project/helpers/readState";

import {
  getLastBuildingsChapterStep,
  shouldEnterBuildingsChapter,
} from "../../buildings/buildingsReaders";
import type { AnswerStepHandler, StepInvalidationRule } from "../../stepHandler.type";

export const InvolvesReinstatementHandler = {
  stepId: "URBAN_PROJECT_INVOLVES_REINSTATEMENT",

  getPreviousStepId(params) {
    if (shouldEnterBuildingsChapter(params)) {
      return getLastBuildingsChapterStep(params);
    }
    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },

  getNextStepId(params) {
    if (params.context?.siteData?.hasContaminatedSoils) {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION";
    }
    return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
  },

  getDependencyRules(params, answers) {
    // oxlint-disable-next-line @typescript-eslint/unbound-method
    const getStep = ReadStateHelper.getStep;
    const previousAnswer = ReadStateHelper.getStepAnswers(
      params.answers,
      "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
    )?.involvesReinstatement;

    // Switching from true (or undefined) to false: delete reinstatement-specific steps only.
    if (answers.involvesReinstatement === false && previousAnswer !== false) {
      const rules: StepInvalidationRule[] = [];

      if (getStep(params.answers, "URBAN_PROJECT_EXPENSES_REINSTATEMENT")) {
        rules.push({ stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT", action: "delete" });
      }
      if (getStep(params.answers, "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER")) {
        rules.push({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
          action: "delete",
        });
      }
      if (getStep(params.answers, "URBAN_PROJECT_SCHEDULE_PROJECTION")) {
        rules.push({ stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION", action: "invalidate" });
      }
      return rules;
    }

    return [];
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_INVOLVES_REINSTATEMENT">;
