import { describe, expect, it } from "vitest";

import { computeCustomStepperGroups, isNavigableCustomStep } from "./customStepperConfig";
import type { CustomStepsState, SiteCreationCustomStep } from "./customSteps";

describe("isNavigableCustomStep", () => {
  it("treats answer steps as navigable", () => {
    expect(isNavigableCustomStep("ADDRESS")).toBe(true);
    expect(isNavigableCustomStep("NAMING")).toBe(true);
  });

  it("treats info/notice steps as not navigable", () => {
    expect(isNavigableCustomStep("SPACES_INTRODUCTION")).toBe(false);
    expect(isNavigableCustomStep("FINAL_SUMMARY")).toBe(false);
  });
});

describe("computeCustomStepperGroups", () => {
  const FRICHE_SEQUENCE: SiteCreationCustomStep[] = [
    "FRICHE_ACTIVITY",
    "ADDRESS",
    "SPACES_INTRODUCTION",
    "SURFACE_AREA",
    "SPACES_KNOWLEDGE",
    "SPACES_SELECTION",
    "SOILS_SUMMARY",
    "SOILS_CONTAMINATION_INTRODUCTION",
    "SOILS_CONTAMINATION",
    "FRICHE_ACCIDENTS_INTRODUCTION",
    "FRICHE_ACCIDENTS",
    "MANAGEMENT_INTRODUCTION",
    "OWNER",
    "IS_FRICHE_LEASED",
    "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
    "YEARLY_EXPENSES",
    "YEARLY_EXPENSES_SUMMARY",
    "NAMING_INTRODUCTION",
    "NAMING",
    "FINAL_SUMMARY",
  ];

  const COMPLETED_STEPS: CustomStepsState = {
    FRICHE_ACTIVITY: { completed: true, payload: "INDUSTRY" },
    ADDRESS: {
      completed: true,
      payload: {
        address: {
          value: "1 Rue de Paris",
          city: "Paris",
          cityCode: "75056",
          postCode: "75001",
          long: 2.35,
          lat: 48.85,
        },
      },
    },
    SURFACE_AREA: { completed: true, payload: { surfaceArea: 1000 } },
    SPACES_KNOWLEDGE: { completed: true, payload: { knowsSpaces: true } },
    SPACES_SELECTION: {
      completed: true,
      payload: { soils: ["BUILDINGS"], soilsDistribution: { BUILDINGS: 1000 } },
    },
    SOILS_CONTAMINATION: {
      completed: true,
      payload: { hasContaminatedSoils: false },
    },
    FRICHE_ACCIDENTS: { completed: true, payload: { hasRecentAccidents: false } },
    OWNER: {
      completed: true,
      payload: { owner: { structureType: "company", name: "Owner" } },
    },
    IS_FRICHE_LEASED: { completed: true, payload: { isFricheLeased: false } },
    YEARLY_EXPENSES: { completed: true, payload: [] },
  };

  it("marks the group containing the current step as current, and targets its first navigable step", () => {
    const groups = computeCustomStepperGroups({
      currentStep: "ADDRESS",
      steps: {},
      stepsSequence: FRICHE_SEQUENCE,
    });

    const addressGroup = groups.find((g) => g.groupId === "ADDRESS")!;
    expect(addressGroup.activity).toBe("current");
    expect(addressGroup.targetStepId).toBe("ADDRESS");

    const introGroup = groups.find((g) => g.groupId === "INTRODUCTION")!;
    expect(introGroup.activity).toBe("inactive");
  });

  it("marks a group completed only when every navigable step in it is completed", () => {
    const groups = computeCustomStepperGroups({
      currentStep: "NAMING",
      steps: COMPLETED_STEPS,
      stepsSequence: FRICHE_SEQUENCE,
    });

    const introductionGroup = groups.find((g) => g.groupId === "INTRODUCTION")!;
    expect(introductionGroup.validation).toBe("completed");

    const namingGroup = groups.find((g) => g.groupId === "NAMING")!;
    expect(namingGroup.validation).toBe("empty");
  });

  it("targets the first incomplete navigable step in a group, not the first walked step", () => {
    const groups = computeCustomStepperGroups({
      currentStep: "NAMING",
      steps: {
        ...COMPLETED_STEPS,
        SOILS_CONTAMINATION: undefined,
      },
      stepsSequence: FRICHE_SEQUENCE,
    });

    const contaminationGroup = groups.find((g) => g.groupId === "CONTAMINATION_AND_ACCIDENTS")!;
    expect(contaminationGroup.targetStepId).toBe("SOILS_CONTAMINATION");
  });

  it("excludes the SUMMARY group, since it has no navigable step of its own", () => {
    const groups = computeCustomStepperGroups({
      currentStep: "FINAL_SUMMARY",
      steps: COMPLETED_STEPS,
      stepsSequence: FRICHE_SEQUENCE,
    });

    expect(groups.some((g) => g.groupId === "SUMMARY")).toBe(false);
  });

  it("includes CONTAMINATION_AND_ACCIDENTS for a friche site, since the sequence walks it", () => {
    const groups = computeCustomStepperGroups({
      currentStep: "NAMING",
      steps: COMPLETED_STEPS,
      stepsSequence: FRICHE_SEQUENCE,
    });

    expect(groups.some((g) => g.groupId === "CONTAMINATION_AND_ACCIDENTS")).toBe(true);
  });

  it("excludes CONTAMINATION_AND_ACCIDENTS for an agricultural site, since the sequence never walks it", () => {
    const AGRICULTURAL_SEQUENCE: SiteCreationCustomStep[] = [
      "AGRICULTURAL_OPERATION_ACTIVITY",
      "ADDRESS",
      "SPACES_INTRODUCTION",
      "SURFACE_AREA",
      "MANAGEMENT_INTRODUCTION",
      "OWNER",
      "NAMING_INTRODUCTION",
      "NAMING",
      "FINAL_SUMMARY",
    ];

    const groups = computeCustomStepperGroups({
      currentStep: "NAMING",
      steps: {},
      stepsSequence: AGRICULTURAL_SEQUENCE,
    });

    expect(groups.some((g) => g.groupId === "CONTAMINATION_AND_ACCIDENTS")).toBe(false);
  });

  it("excludes CONTAMINATION_AND_ACCIDENTS for a natural-area site, since the sequence never walks it", () => {
    const NATURAL_AREA_SEQUENCE: SiteCreationCustomStep[] = [
      "NATURAL_AREA_TYPE",
      "ADDRESS",
      "SPACES_INTRODUCTION",
      "SURFACE_AREA",
      "NAMING_INTRODUCTION",
      "NAMING",
      "FINAL_SUMMARY",
    ];

    const groups = computeCustomStepperGroups({
      currentStep: "NAMING",
      steps: {},
      stepsSequence: NATURAL_AREA_SEQUENCE,
    });

    expect(groups.some((g) => g.groupId === "CONTAMINATION_AND_ACCIDENTS")).toBe(false);
  });
});
