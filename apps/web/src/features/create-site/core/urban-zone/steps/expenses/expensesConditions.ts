import { ReadStateHelper } from "../../helpers/stateHelpers";
import type { UrbanZoneStepContext } from "../../step-handlers/stepHandler.type";

export function isActivityParkManager(context: UrbanZoneStepContext): boolean {
  return (
    ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_ZONE_MANAGER")?.structureType ===
    "activity_park_manager"
  );
}

export function isLocalAuthority(context: UrbanZoneStepContext): boolean {
  return (
    ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_ZONE_MANAGER")?.structureType ===
    "local_authority"
  );
}

export function hasVacantPremises(context: UrbanZoneStepContext): boolean {
  const footprint = ReadStateHelper.getStepAnswers(
    context.stepsState,
    "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
  )?.surfaceArea;
  return footprint !== undefined && footprint > 0;
}

export function hasActivity(context: UrbanZoneStepContext): boolean {
  const footprint = ReadStateHelper.getStepAnswers(
    context.stepsState,
    "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
  )?.surfaceArea;
  const totalSurfaceArea = context.siteData.surfaceArea;
  // Infinity ensures the comparison always passes when surfaceArea is unknown
  return footprint !== undefined && footprint < (totalSurfaceArea ?? Infinity);
}
