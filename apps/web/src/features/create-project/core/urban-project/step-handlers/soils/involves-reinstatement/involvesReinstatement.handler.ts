import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

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

    if (answers.involvesReinstatement === previousAnswer) {
      return [];
    }

    const rules: StepInvalidationRule[] = [];

    // Switching to false: the reinstatement-only steps no longer apply, delete them so they
    // re-enter as required if the user switches back to true.
    if (!answers.involvesReinstatement) {
      if (getStep(params.answers, "URBAN_PROJECT_EXPENSES_REINSTATEMENT")) {
        rules.push({ stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT", action: "delete" });
      }
      if (getStep(params.answers, "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER")) {
        rules.push({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
          action: "delete",
        });
      }
    }

    // Either direction: the schedule step's reinstatement dates were answered (or omitted)
    // under the old value, so it must be revisited — invalidate it if already completed.
    if (getStep(params.answers, "URBAN_PROJECT_SCHEDULE_PROJECTION")) {
      rules.push({ stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION", action: "invalidate" });
    }

    return rules;
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_INVOLVES_REINSTATEMENT">;
