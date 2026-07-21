import type { StepInvalidationRule as GenericStepInvalidationRule } from "@/shared/core/wizard-form/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";
import type { AnswerStepId } from "../../../renewableEnergySteps";
import type { AnswerStepHandler } from "../../stepHandler.type";

type StepInvalidationRule = GenericStepInvalidationRule<AnswerStepId>;

export const PowerHandler: AnswerStepHandler<"RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER"> = {
  stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",

  getPreviousStepId(params) {
    const keyParameter = ReadStateHelper.getStepAnswers(
      params.answers,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
    )?.photovoltaicKeyParameter;

    return keyParameter === "POWER"
      ? "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER"
      : "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE";
  },

  getNextStepId(params) {
    const keyParameter = ReadStateHelper.getStepAnswers(
      params.answers,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
    )?.photovoltaicKeyParameter;

    return keyParameter === "POWER"
      ? "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE"
      : "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION";
  },

  // Δ-gated: production derives from power, so any power change invalidates it (it re-fetches on
  // step entry). When power is the key parameter the surface is a stale recommendation → invalidate
  // the twin; re-completing surface fires the soils cascade (ticket 04). Power never enters the
  // soils cascade directly.
  getDependencyRules(params, answers) {
    const previousPower = ReadStateHelper.getStepAnswers(
      params.answers,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
    )?.photovoltaicInstallationElectricalPowerKWc;

    if (answers.photovoltaicInstallationElectricalPowerKWc === previousPower) {
      return [];
    }

    const keyParameter = ReadStateHelper.getStepAnswers(
      params.answers,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
    )?.photovoltaicKeyParameter;

    // Only invalidate dependents the user actually completed — guards first-time completion
    // (dependents absent) from surfacing an empty confirmation dialog.
    const rules: StepInvalidationRule[] = [];

    if (
      ReadStateHelper.getStep(
        params.answers,
        "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
      )?.completed
    ) {
      rules.push({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
        action: "invalidate",
      });
    }

    if (
      keyParameter === "POWER" &&
      ReadStateHelper.getStep(params.answers, "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")?.completed
    ) {
      rules.push({ stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE", action: "invalidate" });
    }

    return rules;
  },
};
