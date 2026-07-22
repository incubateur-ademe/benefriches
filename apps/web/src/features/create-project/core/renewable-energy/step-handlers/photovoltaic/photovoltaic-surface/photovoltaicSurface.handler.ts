import { canSiteAccomodatePhotovoltaicPanels } from "shared";

import type { StepInvalidationRule as GenericStepInvalidationRule } from "@/shared/core/wizard-form/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";
import type { AnswerStepId } from "../../../renewableEnergySteps";
import type { AnswerStepHandler, StepHandlerParams } from "../../stepHandler.type";

type StepInvalidationRule = GenericStepInvalidationRule<AnswerStepId>;

// The soils-transformation branch depends on the panel surface (via
// `canSiteAccomodatePhotovoltaicPanels` and the transformation derivation), independently of which
// parameter is primary. It only exists once the user has reached the project-selection step, so the
// cascade is gated on that step being completed.
//
// - non-suitable steps: `delete` when the new surface now fits the site's suitable area (they leave
//   the sequence — the intro routes straight to project selection), else `invalidate` (still needed,
//   but their footprint-tied data is stale).
// - custom transformation: the strategy (PROJECT_SELECTION = custom) still holds, so keep it; the
//   footprint-tied custom soils selection + surface-area allocation are stale → invalidate them.
// - renaturation / preserve: the derived distribution lives *on* PROJECT_SELECTION (re-derived by its
//   middleware from the new power/base), so invalidating that step is enough.
function getSoilsTransformationCascadeRules(
  params: StepHandlerParams,
  newSurfaceSquareMeters: number,
): StepInvalidationRule[] {
  const projectSelectionStep = ReadStateHelper.getStep(
    params.answers,
    "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
  );

  if (!projectSelectionStep?.completed) {
    return [];
  }

  const rules: StepInvalidationRule[] = [];

  const canAccommodate = canSiteAccomodatePhotovoltaicPanels(
    params.context.siteData?.soilsDistribution ?? {},
    newSurfaceSquareMeters,
  );
  const nonSuitableAction = canAccommodate ? "delete" : "invalidate";

  for (const stepId of [
    "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
    "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
  ] as const) {
    if (ReadStateHelper.getStep(params.answers, stepId)?.completed) {
      rules.push({ stepId, action: nonSuitableAction });
    }
  }

  const soilsTransformationProject = ReadStateHelper.getStepAnswers(
    params.answers,
    "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
  )?.soilsTransformationProject;

  if (soilsTransformationProject === "custom") {
    for (const stepId of [
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
    ] as const) {
      if (ReadStateHelper.getStep(params.answers, stepId)?.completed) {
        rules.push({ stepId, action: "invalidate" });
      }
    }
  } else {
    rules.push({
      stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
      action: "invalidate",
    });
  }

  return rules;
}

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
  // the power twin, and power drives production → invalidate production too. Independently of the key
  // parameter, a surface change cascades to the soils-transformation branch (see
  // `getSoilsTransformationCascadeRules`). Power never enters the soils cascade directly — it reaches
  // it only via the invalidated surface twin being re-completed.
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

    rules.push(
      ...getSoilsTransformationCascadeRules(
        params,
        answers.photovoltaicInstallationSurfaceSquareMeters,
      ),
    );

    return rules;
  },
};
