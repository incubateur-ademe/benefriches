import { describe, expect, it } from "vitest";

import type { RenewableEnergyStepsState } from "../step-handlers/stepHandler.type";
import { buildRenewableEnergyStepGroupsFromSequence } from "./stepperNavigation";

describe("buildRenewableEnergyStepGroupsFromSequence", () => {
  it("buckets the photovoltaic surface and power steps into their own distinct sub-group entries so each can be navigated to directly", () => {
    // Arrange
    const stepsSequence = [
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
    ] as const;
    const steps: RenewableEnergyStepsState = {
      RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
        completed: true,
        payload: { photovoltaicKeyParameter: "SURFACE" },
      },
      RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: {
        completed: true,
        payload: { photovoltaicInstallationSurfaceSquareMeters: 1200 },
      },
      RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: { completed: false },
    };

    // Act
    const stepGroups = buildRenewableEnergyStepGroupsFromSequence({
      steps,
      stepsSequence: [...stepsSequence],
    });

    // Assert
    expect(stepGroups).toEqual({
      PHOTOVOLTAIC_PARAMETERS: [
        {
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
          subGroupId: "PHOTOVOLTAIC_KEY_PARAMETER",
          isStepCompleted: true,
        },
        {
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
          subGroupId: "PHOTOVOLTAIC_SURFACE",
          isStepCompleted: true,
        },
        {
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
          subGroupId: "PHOTOVOLTAIC_POWER",
          isStepCompleted: false,
        },
      ],
    });
  });

  it("excludes notice/introduction steps from the built groups, keeping only answer-bearing (and allow-listed) steps", () => {
    // Arrange
    const stepsSequence = [
      "RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION",
      "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
      "RENEWABLE_ENERGY_FINAL_SUMMARY",
    ] as const;
    const steps: RenewableEnergyStepsState = {
      RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER: {
        completed: true,
        payload: {
          projectDeveloper: { name: "Aménageur SAS", structureType: "company" },
        },
      },
    };

    // Act
    const stepGroups = buildRenewableEnergyStepGroupsFromSequence({
      steps,
      stepsSequence: [...stepsSequence],
    });

    // Assert
    expect(stepGroups).toEqual({
      STAKEHOLDERS: [
        {
          stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
          subGroupId: "STAKEHOLDERS_PROJECT_DEVELOPER",
          isStepCompleted: true,
        },
      ],
      // RENEWABLE_ENERGY_FINAL_SUMMARY is a non-answer step allow-listed as always-navigable,
      // and always treated as completed, but has no sub-group id (not answer-bearing) so it is
      // dropped from the sub-step rows built downstream by `useBuildStepperNavigationItems`.
      SUMMARY: [
        {
          stepId: "RENEWABLE_ENERGY_FINAL_SUMMARY",
          subGroupId: undefined,
          isStepCompleted: true,
        },
      ],
    });
  });
});
