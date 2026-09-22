import { describe, expect, it } from "vitest";

import { buildStepGroupsFromSequence } from "@/shared/core/wizard-form/helpers/stepGroups";

import {
  computeCustomStepperGroups,
  CUSTOM_STEP_TO_GROUP,
  CUSTOM_STEP_TO_SUMMARY_SECTION,
  isNavigableCustomStep,
} from "./customStepperConfig";
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

  describe("sub-groups", () => {
    it("buckets a group's navigable steps into sub-groups in walked order, each targeting its first incomplete step", () => {
      const groups = computeCustomStepperGroups({
        currentStep: "NAMING",
        steps: {},
        stepsSequence: FRICHE_SEQUENCE,
      });

      const spacesGroup = groups.find((g) => g.groupId === "SPACES")!;
      expect(spacesGroup.subGroups).toEqual([
        {
          subGroupId: "SPACES_TOTAL_SURFACE_AREA",
          title: "Superficie totale",
          targetStepId: "SURFACE_AREA",
          activity: "inactive",
          validation: "empty",
        },
        {
          subGroupId: "SPACES_TYPES",
          title: "Types d'espaces",
          targetStepId: "SPACES_KNOWLEDGE",
          activity: "inactive",
          validation: "empty",
        },
      ]);
    });

    it("does not mark a sub-group completed when only some of its steps are completed", () => {
      const groups = computeCustomStepperGroups({
        currentStep: "NAMING",
        steps: {
          SPACES_KNOWLEDGE: { completed: true, payload: { knowsSpaces: true } },
        },
        stepsSequence: FRICHE_SEQUENCE,
      });

      const spacesGroup = groups.find((g) => g.groupId === "SPACES")!;
      const typesSubGroup = spacesGroup.subGroups.find((sg) => sg.subGroupId === "SPACES_TYPES")!;
      expect(typesSubGroup.validation).toBe("empty");
    });

    it("marks a sub-group completed once every one of its steps is completed", () => {
      const groups = computeCustomStepperGroups({
        currentStep: "NAMING",
        steps: COMPLETED_STEPS,
        stepsSequence: FRICHE_SEQUENCE,
      });

      const spacesGroup = groups.find((g) => g.groupId === "SPACES")!;
      const typesSubGroup = spacesGroup.subGroups.find((sg) => sg.subGroupId === "SPACES_TYPES")!;
      expect(typesSubGroup.validation).toBe("completed");
    });

    it("marks the group 'groupActive' and exactly its current step's sub-group 'current' when the current step carries a sub-group id", () => {
      const groups = computeCustomStepperGroups({
        currentStep: "SPACES_KNOWLEDGE",
        steps: {},
        stepsSequence: FRICHE_SEQUENCE,
      });

      const spacesGroup = groups.find((g) => g.groupId === "SPACES")!;
      expect(spacesGroup.activity).toBe("groupActive");

      const typesSubGroup = spacesGroup.subGroups.find((sg) => sg.subGroupId === "SPACES_TYPES")!;
      const surfaceAreaSubGroup = spacesGroup.subGroups.find(
        (sg) => sg.subGroupId === "SPACES_TOTAL_SURFACE_AREA",
      )!;
      expect(typesSubGroup.activity).toBe("current");
      expect(surfaceAreaSubGroup.activity).toBe("inactive");
    });

    it("keeps the group 'current' (not 'groupActive') and no sub-group 'current' when the current step has no sub-group id", () => {
      const groups = computeCustomStepperGroups({
        currentStep: "SPACES_INTRODUCTION",
        steps: {},
        stepsSequence: FRICHE_SEQUENCE,
      });

      const spacesGroup = groups.find((g) => g.groupId === "SPACES")!;
      expect(spacesGroup.activity).toBe("current");
      expect(spacesGroup.subGroups.every((sg) => sg.activity === "inactive")).toBe(true);
    });

    it("returns an empty sub-groups list for groups whose navigable steps carry no sub-group id", () => {
      const groups = computeCustomStepperGroups({
        currentStep: "NAMING",
        steps: {},
        stepsSequence: FRICHE_SEQUENCE,
      });

      expect(groups.find((g) => g.groupId === "INTRODUCTION")!.subGroups).toEqual([]);
      expect(groups.find((g) => g.groupId === "ADDRESS")!.subGroups).toEqual([]);
      expect(groups.find((g) => g.groupId === "NAMING")!.subGroups).toEqual([]);
    });

    it("assigns every sub-group id to exactly one parent group across CUSTOM_STEP_TO_GROUP", () => {
      const groupIdsBySubGroupId = new Map<string, Set<string>>();

      for (const { groupId, subGroupId } of Object.values(CUSTOM_STEP_TO_GROUP)) {
        if (subGroupId === undefined) continue;

        const groupIds = groupIdsBySubGroupId.get(subGroupId) ?? new Set<string>();
        groupIds.add(groupId);
        groupIdsBySubGroupId.set(subGroupId, groupIds);
      }

      const subGroupIdsWithMultipleParentGroups = Array.from(groupIdsBySubGroupId.entries()).filter(
        ([, groupIds]) => groupIds.size > 1,
      );
      expect(subGroupIdsWithMultipleParentGroups).toEqual([]);
    });
  });
});

describe("CUSTOM_STEP_TO_SUMMARY_SECTION", () => {
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

  it("splits Pollution and Accidents into two summary sections, even though they share one sidebar group", () => {
    const sections = buildStepGroupsFromSequence(
      FRICHE_SEQUENCE.map((stepId) => ({ stepId, isCompleted: false })),
      CUSTOM_STEP_TO_SUMMARY_SECTION,
      isNavigableCustomStep,
    );

    expect(sections.CONTAMINATION?.map((s) => s.stepId)).toEqual(["SOILS_CONTAMINATION"]);
    expect(sections.ACCIDENTS?.map((s) => s.stepId)).toEqual(["FRICHE_ACCIDENTS"]);
  });

  it("never puts info/summary steps into any section", () => {
    const sections = buildStepGroupsFromSequence(
      FRICHE_SEQUENCE.map((stepId) => ({ stepId, isCompleted: false })),
      CUSTOM_STEP_TO_SUMMARY_SECTION,
      isNavigableCustomStep,
    );

    const allStepIds = Object.values(sections).flatMap((steps) => steps.map((s) => s.stepId));
    expect(allStepIds).not.toContain("SPACES_INTRODUCTION");
    expect(allStepIds).not.toContain("FINAL_SUMMARY");
    expect(allStepIds).not.toContain("SOILS_SUMMARY");
  });

  it("puts the nature/activity step under NAMING, even though it sits in the sidebar's INTRODUCTION group", () => {
    const sections = buildStepGroupsFromSequence(
      FRICHE_SEQUENCE.map((stepId) => ({ stepId, isCompleted: false })),
      CUSTOM_STEP_TO_SUMMARY_SECTION,
      isNavigableCustomStep,
    );

    expect(sections.NAMING?.map((s) => s.stepId)).toContain("FRICHE_ACTIVITY");
  });
});
