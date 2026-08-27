import { ReadStateHelper } from "../../stateHelpers";
import type { UrbanZoneStepParams } from "../../stepHandlerRegistry";
import type { UrbanZoneStepsState } from "../../urbanZoneSteps";

export function getManagerStructureType(
  stepsState: UrbanZoneStepsState,
): "activity_park_manager" | "local_authority" | undefined {
  return ReadStateHelper.getStepAnswers(stepsState, "URBAN_ZONE_MANAGER")?.structureType;
}

export function getManagerName(stepsState: UrbanZoneStepsState): string | undefined {
  const manager = ReadStateHelper.getStepAnswers(stepsState, "URBAN_ZONE_MANAGER");
  return manager?.structureType === "local_authority" ? manager.localAuthorityName : undefined;
}

export function getVacantPremisesFootprintSurfaceArea(
  stepsState: UrbanZoneStepsState,
): number | undefined {
  return ReadStateHelper.getStepAnswers(
    stepsState,
    "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
  )?.surfaceArea;
}

export function getVacantPremisesFloorArea(stepsState: UrbanZoneStepsState): number | undefined {
  return ReadStateHelper.getStepAnswers(
    stepsState,
    "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
  )?.surfaceArea;
}

export function getFullTimeJobs(stepsState: UrbanZoneStepsState): number | undefined {
  return ReadStateHelper.getStepAnswers(stepsState, "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT")
    ?.fullTimeJobs;
}

export function isActivityParkManager(params: UrbanZoneStepParams): boolean {
  return getManagerStructureType(params.answers) === "activity_park_manager";
}

export function isLocalAuthority(params: UrbanZoneStepParams): boolean {
  return getManagerStructureType(params.answers) === "local_authority";
}

export function hasVacantPremises(params: UrbanZoneStepParams): boolean {
  const footprint = getVacantPremisesFootprintSurfaceArea(params.answers);
  return footprint !== undefined && footprint > 0;
}
