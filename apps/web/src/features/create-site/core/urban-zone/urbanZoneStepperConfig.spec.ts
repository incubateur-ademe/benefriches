import { describe, expect, it } from "vitest";

import { buildStepGroupsFromSequence } from "@/shared/core/wizard-form/helpers/stepGroups";

import {
  computeUrbanZoneStepperGroups,
  isNavigableUrbanZoneStep,
  URBAN_ZONE_STEP_TO_GROUP,
  URBAN_ZONE_STEP_TO_SUMMARY_SECTION,
} from "./urbanZoneStepperConfig";
import type { UrbanZoneSiteCreationStep, UrbanZoneStepsState } from "./urbanZoneSteps";

describe("URBAN_ZONE_STEP_TO_SUMMARY_SECTION", () => {
  const SEQUENCE: UrbanZoneSiteCreationStep[] = [
    "URBAN_ZONE_LAND_PARCELS_SELECTION",
    "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
    "URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION",
    "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
    "URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION",
    "URBAN_ZONE_SERVICED_SURFACE_SOILS_DISTRIBUTION",
    "URBAN_ZONE_RESERVED_SURFACE_SOILS_DISTRIBUTION",
    "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA",
    "URBAN_ZONE_PUBLIC_SPACES_BUILDINGS_FLOOR_AREA",
    "URBAN_ZONE_SERVICED_SURFACE_BUILDINGS_FLOOR_AREA",
    "URBAN_ZONE_RESERVED_SURFACE_BUILDINGS_FLOOR_AREA",
    "URBAN_ZONE_SOILS_SUMMARY",
    "URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION",
    "URBAN_ZONE_SOILS_CONTAMINATION",
    "URBAN_ZONE_MANAGEMENT_INTRODUCTION",
    "URBAN_ZONE_MANAGER",
    "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
    "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
    "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION",
    "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES",
    "URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY",
    "URBAN_ZONE_NAMING_INTRODUCTION",
    "URBAN_ZONE_NAMING",
    "URBAN_ZONE_FINAL_SUMMARY",
  ];

  it("groups the four per-parcel soils-distribution steps and the four buildings-floor-area steps into a single SOILS section", () => {
    const sections = buildStepGroupsFromSequence(
      SEQUENCE.map((stepId) => ({ stepId, isCompleted: false })),
      URBAN_ZONE_STEP_TO_SUMMARY_SECTION,
      isNavigableUrbanZoneStep,
    );

    expect(sections.SOILS?.map((s) => s.stepId)).toEqual([
      "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
      "URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION",
      "URBAN_ZONE_SERVICED_SURFACE_SOILS_DISTRIBUTION",
      "URBAN_ZONE_RESERVED_SURFACE_SOILS_DISTRIBUTION",
      "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA",
      "URBAN_ZONE_PUBLIC_SPACES_BUILDINGS_FLOOR_AREA",
      "URBAN_ZONE_SERVICED_SURFACE_BUILDINGS_FLOOR_AREA",
      "URBAN_ZONE_RESERVED_SURFACE_BUILDINGS_FLOOR_AREA",
    ]);
  });

  it("groups the manager, vacant-premises and FTE steps into MANAGEMENT", () => {
    const sections = buildStepGroupsFromSequence(
      SEQUENCE.map((stepId) => ({ stepId, isCompleted: false })),
      URBAN_ZONE_STEP_TO_SUMMARY_SECTION,
      isNavigableUrbanZoneStep,
    );

    expect(sections.MANAGEMENT?.map((s) => s.stepId)).toEqual([
      "URBAN_ZONE_MANAGER",
      "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
      "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
    ]);
  });

  it("never puts info/summary steps into any section", () => {
    const sections = buildStepGroupsFromSequence(
      SEQUENCE.map((stepId) => ({ stepId, isCompleted: false })),
      URBAN_ZONE_STEP_TO_SUMMARY_SECTION,
      isNavigableUrbanZoneStep,
    );

    const allStepIds = Object.values(sections).flatMap((steps) => steps.map((s) => s.stepId));
    expect(allStepIds).not.toContain("URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION");
    expect(allStepIds).not.toContain("URBAN_ZONE_SOILS_SUMMARY");
    expect(allStepIds).not.toContain("URBAN_ZONE_FINAL_SUMMARY");
  });

  it("buckets the expense/income steps under EXPENSES, not MANAGEMENT, so they never affect MANAGEMENT's completion, warning or target", () => {
    const sections = buildStepGroupsFromSequence(
      SEQUENCE.map((stepId) => ({ stepId, isCompleted: false })),
      URBAN_ZONE_STEP_TO_SUMMARY_SECTION,
      isNavigableUrbanZoneStep,
    );

    expect(sections.MANAGEMENT?.map((s) => s.stepId)).toEqual([
      "URBAN_ZONE_MANAGER",
      "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
      "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
    ]);
    expect(sections.EXPENSES?.map((s) => s.stepId)).toEqual([
      "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES",
    ]);
  });

  it("has no LOCATION section, since 📍 Localisation's steps live on the custom engine", () => {
    const sections = buildStepGroupsFromSequence(
      SEQUENCE.map((stepId) => ({ stepId, isCompleted: false })),
      URBAN_ZONE_STEP_TO_SUMMARY_SECTION,
      isNavigableUrbanZoneStep,
    );

    expect(sections.LOCATION).toBeUndefined();
  });
});

describe("computeUrbanZoneStepperGroups", () => {
  const SEQUENCE: UrbanZoneSiteCreationStep[] = [
    "URBAN_ZONE_LAND_PARCELS_SELECTION",
    "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
    "URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION",
    "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
    "URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION",
    "URBAN_ZONE_SERVICED_SURFACE_SOILS_DISTRIBUTION",
    "URBAN_ZONE_RESERVED_SURFACE_SOILS_DISTRIBUTION",
    "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA",
    "URBAN_ZONE_PUBLIC_SPACES_BUILDINGS_FLOOR_AREA",
    "URBAN_ZONE_SERVICED_SURFACE_BUILDINGS_FLOOR_AREA",
    "URBAN_ZONE_RESERVED_SURFACE_BUILDINGS_FLOOR_AREA",
    "URBAN_ZONE_SOILS_SUMMARY",
    "URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION",
    "URBAN_ZONE_SOILS_CONTAMINATION",
    "URBAN_ZONE_MANAGEMENT_INTRODUCTION",
    "URBAN_ZONE_MANAGER",
    "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
    "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
    "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
    "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION",
    "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES",
    "URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY",
    "URBAN_ZONE_NAMING_INTRODUCTION",
    "URBAN_ZONE_NAMING",
    "URBAN_ZONE_FINAL_SUMMARY",
  ];

  it("buckets a group's navigable steps into sub-groups in walked order, each targeting its first incomplete step", () => {
    const groups = computeUrbanZoneStepperGroups({
      currentStep: "URBAN_ZONE_NAMING",
      steps: {},
      stepsSequence: SEQUENCE,
    });

    const landParcelsGroup = groups.find((g) => g.groupId === "LAND_PARCELS")!;
    expect(landParcelsGroup.subGroups).toEqual([
      {
        subGroupId: "LAND_PARCELS_SELECTION",
        title: "Sélection des surfaces foncières",
        targetStepId: "URBAN_ZONE_LAND_PARCELS_SELECTION",
        activity: "inactive",
        validation: "empty",
      },
      {
        subGroupId: "LAND_PARCELS_SURFACE_DISTRIBUTION",
        title: "Superficie des surfaces foncières",
        targetStepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
        activity: "inactive",
        validation: "empty",
      },
    ]);
  });

  it("collapses the four per-parcel soils-distribution steps and the four buildings-floor-area steps into two sub-groups", () => {
    const groups = computeUrbanZoneStepperGroups({
      currentStep: "URBAN_ZONE_NAMING",
      steps: {},
      stepsSequence: SEQUENCE,
    });

    const soilsAndSpacesGroup = groups.find((g) => g.groupId === "SOILS_AND_SPACES")!;
    expect(soilsAndSpacesGroup.subGroups).toEqual([
      {
        subGroupId: "PARCEL_SOILS_DISTRIBUTION",
        title: "Superficie des sols",
        targetStepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
        activity: "inactive",
        validation: "empty",
      },
      {
        subGroupId: "PARCEL_BUILDINGS_FLOOR_AREA",
        title: "Surface de plancher des bâtiments",
        targetStepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA",
        activity: "inactive",
        validation: "empty",
      },
    ]);
  });

  it("does not mark the per-parcel soils-distribution sub-group completed unless all four parcels are completed", () => {
    const steps: UrbanZoneStepsState = {
      URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: {
        completed: true,
        payload: { soilsDistribution: { BUILDINGS: 1000 } },
      },
      URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION: {
        completed: true,
        payload: { soilsDistribution: { BUILDINGS: 1000 } },
      },
      URBAN_ZONE_SERVICED_SURFACE_SOILS_DISTRIBUTION: {
        completed: true,
        payload: { soilsDistribution: { BUILDINGS: 1000 } },
      },
      // URBAN_ZONE_RESERVED_SURFACE_SOILS_DISTRIBUTION intentionally left incomplete.
    };

    const groups = computeUrbanZoneStepperGroups({
      currentStep: "URBAN_ZONE_NAMING",
      steps,
      stepsSequence: SEQUENCE,
    });

    const soilsAndSpacesGroup = groups.find((g) => g.groupId === "SOILS_AND_SPACES")!;
    const soilsDistributionSubGroup = soilsAndSpacesGroup.subGroups.find(
      (sg) => sg.subGroupId === "PARCEL_SOILS_DISTRIBUTION",
    )!;
    expect(soilsDistributionSubGroup.validation).toBe("empty");
  });

  it("marks the per-parcel soils-distribution sub-group completed once all four parcels are completed", () => {
    const steps: UrbanZoneStepsState = {
      URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: {
        completed: true,
        payload: { soilsDistribution: { BUILDINGS: 1000 } },
      },
      URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION: {
        completed: true,
        payload: { soilsDistribution: { BUILDINGS: 1000 } },
      },
      URBAN_ZONE_SERVICED_SURFACE_SOILS_DISTRIBUTION: {
        completed: true,
        payload: { soilsDistribution: { BUILDINGS: 1000 } },
      },
      URBAN_ZONE_RESERVED_SURFACE_SOILS_DISTRIBUTION: {
        completed: true,
        payload: { soilsDistribution: { BUILDINGS: 1000 } },
      },
    };

    const groups = computeUrbanZoneStepperGroups({
      currentStep: "URBAN_ZONE_NAMING",
      steps,
      stepsSequence: SEQUENCE,
    });

    const soilsAndSpacesGroup = groups.find((g) => g.groupId === "SOILS_AND_SPACES")!;
    const soilsDistributionSubGroup = soilsAndSpacesGroup.subGroups.find(
      (sg) => sg.subGroupId === "PARCEL_SOILS_DISTRIBUTION",
    )!;
    expect(soilsDistributionSubGroup.validation).toBe("completed");
  });

  it("marks the group 'groupActive' and exactly its current step's sub-group 'current' when the current step carries a sub-group id", () => {
    const groups = computeUrbanZoneStepperGroups({
      currentStep: "URBAN_ZONE_MANAGER",
      steps: {},
      stepsSequence: SEQUENCE,
    });

    const managementGroup = groups.find((g) => g.groupId === "MANAGEMENT")!;
    expect(managementGroup.activity).toBe("groupActive");

    const managerSubGroup = managementGroup.subGroups.find((sg) => sg.subGroupId === "MANAGER")!;
    const footprintSubGroup = managementGroup.subGroups.find(
      (sg) => sg.subGroupId === "VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
    )!;
    expect(managerSubGroup.activity).toBe("current");
    expect(footprintSubGroup.activity).toBe("inactive");
  });

  it("keeps the group 'current' (not 'groupActive') and no sub-group 'current' when the current step has no sub-group id", () => {
    const groups = computeUrbanZoneStepperGroups({
      currentStep: "URBAN_ZONE_MANAGEMENT_INTRODUCTION",
      steps: {},
      stepsSequence: SEQUENCE,
    });

    const managementGroup = groups.find((g) => g.groupId === "MANAGEMENT")!;
    expect(managementGroup.activity).toBe("current");
    expect(managementGroup.subGroups.every((sg) => sg.activity === "inactive")).toBe(true);
  });

  it("returns an empty sub-groups list for groups whose only navigable step has no sub-group id", () => {
    const groups = computeUrbanZoneStepperGroups({
      currentStep: "URBAN_ZONE_NAMING",
      steps: {},
      stepsSequence: SEQUENCE,
    });

    expect(groups.find((g) => g.groupId === "CONTAMINATION")!.subGroups).toEqual([]);
    expect(groups.find((g) => g.groupId === "NAMING")!.subGroups).toEqual([]);
  });

  it("assigns every sub-group id to exactly one parent group across URBAN_ZONE_STEP_TO_GROUP", () => {
    const groupIdsBySubGroupId = new Map<string, Set<string>>();

    for (const { groupId, subGroupId } of Object.values(URBAN_ZONE_STEP_TO_GROUP)) {
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
