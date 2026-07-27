import { describe, expect, it } from "vitest";

import { buildStepGroupsFromSequence } from "@/shared/core/wizard-form/helpers/stepGroups";

import { isAnswersStep } from "../renewableEnergySteps";
import { RENEWABLE_ENERGY_STEP_TO_GROUP } from "./renewableEnergyStepperConfig";

describe("RENEWABLE_ENERGY_STEP_TO_GROUP", () => {
  it("buckets the photovoltaic key-parameter/power branch and naming step into their groups and sub-groups, skipping notice and summary steps", () => {
    const stepSequence = [
      { stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION", isCompleted: true },
      { stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER", isCompleted: true },
      { stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER", isCompleted: true },
      { stepId: "RENEWABLE_ENERGY_SOILS_SUMMARY", isCompleted: true },
      { stepId: "RENEWABLE_ENERGY_SOILS_CARBON_STORAGE", isCompleted: true },
      { stepId: "RENEWABLE_ENERGY_NAMING", isCompleted: false },
    ] as const;

    const stepGroups = buildStepGroupsFromSequence(
      [...stepSequence],
      RENEWABLE_ENERGY_STEP_TO_GROUP,
      isAnswersStep,
    );

    expect(stepGroups).toEqual({
      PHOTOVOLTAIC_PARAMETERS: [
        {
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
          subGroupId: "PHOTOVOLTAIC_KEY_PARAMETER",
          isStepCompleted: true,
        },
        {
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
          subGroupId: "PHOTOVOLTAIC_POWER",
          isStepCompleted: true,
        },
      ],
      NAMING: [
        {
          stepId: "RENEWABLE_ENERGY_NAMING",
          subGroupId: "NAMING_PROJECT_NAME",
          isStepCompleted: false,
        },
      ],
    });
  });

  it("keeps the soils-summary and soils-carbon-storage steps assigned to the SITE_WORKS group", () => {
    expect(RENEWABLE_ENERGY_STEP_TO_GROUP.RENEWABLE_ENERGY_SOILS_SUMMARY.groupId).toBe(
      "SITE_WORKS",
    );
    expect(RENEWABLE_ENERGY_STEP_TO_GROUP.RENEWABLE_ENERGY_SOILS_CARBON_STORAGE.groupId).toBe(
      "SITE_WORKS",
    );
  });
});
