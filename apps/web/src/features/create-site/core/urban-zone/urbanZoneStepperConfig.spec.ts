import { describe, expect, it } from "vitest";

import { buildStepGroupsFromSequence } from "@/shared/core/wizard-form/helpers/stepGroups";

import {
  isNavigableUrbanZoneStep,
  URBAN_ZONE_STEP_TO_SUMMARY_SECTION,
} from "./urbanZoneStepperConfig";
import type { UrbanZoneSiteCreationStep } from "./urbanZoneSteps";

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
