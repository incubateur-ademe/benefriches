import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";
import type { StepInvalidationRule as GenericStepInvalidationRule } from "@/shared/core/wizard-form/stepHandler.type";

import type { AnswerStepId } from "../../../renewableEnergySteps";
import type { AnswerStepHandler } from "../../stepHandler.type";

type StepInvalidationRule = GenericStepInvalidationRule<AnswerStepId>;

export const InvolvesReinstatementHandler: AnswerStepHandler<"RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT"> =
  {
    stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",

    getNextStepId() {
      return "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION";
    },

    getDependencyRules(params, answers) {
      // oxlint-disable-next-line @typescript-eslint/unbound-method
      const getStep = ReadStateHelper.getStep;
      const previousAnswer = ReadStateHelper.getStepAnswers(
        params.answers,
        "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
      )?.involvesReinstatement;

      if (answers.involvesReinstatement === previousAnswer) {
        return [];
      }

      const rules: StepInvalidationRule[] = [];

      // Switching to false: the reinstatement-only steps no longer apply, delete them so they
      // re-enter as required if the user switches back to true.
      if (!answers.involvesReinstatement) {
        if (getStep(params.answers, "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT")) {
          rules.push({ stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT", action: "delete" });
        }
        if (getStep(params.answers, "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER")) {
          rules.push({
            stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
            action: "delete",
          });
        }
      }

      // Either direction: the schedule step's reinstatement dates were answered (or omitted)
      // under the old value, so it must be revisited — invalidate it if already completed.
      if (getStep(params.answers, "RENEWABLE_ENERGY_SCHEDULE_PROJECTION")) {
        rules.push({ stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION", action: "invalidate" });
      }

      return rules;
    },
  };
