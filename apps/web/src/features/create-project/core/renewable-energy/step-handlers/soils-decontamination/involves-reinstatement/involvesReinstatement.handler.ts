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

      // Switching from true (or unset) to false: delete reinstatement-specific steps only.
      // false -> true needs no rule — the reinstatement steps re-enter the sequence via
      // gating and become required again.
      if (!answers.involvesReinstatement && previousAnswer !== false) {
        const rules: StepInvalidationRule[] = [];

        if (getStep(params.answers, "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT")) {
          rules.push({ stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT", action: "delete" });
        }
        if (getStep(params.answers, "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER")) {
          rules.push({
            stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
            action: "delete",
          });
        }
        if (getStep(params.answers, "RENEWABLE_ENERGY_SCHEDULE_PROJECTION")) {
          rules.push({ stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION", action: "invalidate" });
        }
        return rules;
      }

      return [];
    },
  };
