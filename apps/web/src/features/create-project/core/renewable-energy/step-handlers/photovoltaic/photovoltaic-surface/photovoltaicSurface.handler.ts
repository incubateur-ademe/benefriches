import type { StepInvalidationRule as GenericStepInvalidationRule } from "@/shared/core/wizard-form/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";
import type { AnswerStepId } from "../../../renewableEnergySteps";
import type { AnswerStepHandler } from "../../stepHandler.type";

type StepInvalidationRule = GenericStepInvalidationRule<AnswerStepId>;

export const SurfaceHandler: AnswerStepHandler<"RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE"> = {
  stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",

  getPreviousStepId(params) {
    const keyParameter = ReadStateHelper.getStepAnswers(
      params.answers,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
    )?.photovoltaicKeyParameter;

    return keyParameter === "POWER"
      ? "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER"
      : "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER";
  },

  getNextStepId(params) {
    const keyParameter = ReadStateHelper.getStepAnswers(
      params.answers,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
    )?.photovoltaicKeyParameter;

    return keyParameter === "POWER"
      ? "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION"
      : "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER";
  },

  // Δ-gated. When surface is the key parameter, the power is a stale recommendation → invalidate
  // the power twin, and power drives production → invalidate production too. The soils cascade
  // (which depends on surface regardless of the key parameter) is added in ticket 04.
  getDependencyRules(params, answers) {
    const previousSurface = ReadStateHelper.getStepAnswers(
      params.answers,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
    )?.photovoltaicInstallationSurfaceSquareMeters;

    if (answers.photovoltaicInstallationSurfaceSquareMeters === previousSurface) {
      return [];
    }

    const keyParameter = ReadStateHelper.getStepAnswers(
      params.answers,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
    )?.photovoltaicKeyParameter;

    const rules: StepInvalidationRule[] = [];

    // Only invalidate dependents the user actually completed — guards first-time completion
    // (dependents absent) from surfacing an empty confirmation dialog.
    if (keyParameter === "SURFACE") {
      if (
        ReadStateHelper.getStep(params.answers, "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER")?.completed
      ) {
        rules.push({ stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER", action: "invalidate" });
      }
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
    }

    return rules;
  },
};
