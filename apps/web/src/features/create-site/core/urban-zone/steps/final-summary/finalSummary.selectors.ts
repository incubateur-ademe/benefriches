import { createSelector } from "@reduxjs/toolkit";
import {
  type SoilsDistribution,
  type SoilType,
  type UrbanZoneLandParcelType,
  type UrbanZoneType,
  SurfaceAreaDistribution,
  typedObjectEntries,
} from "shared";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper, getSelectedParcelTypes } from "../../helpers/stateHelpers";
import { getParcelStepIds } from "../per-parcel-soils/parcelStepMapping";

type ManagerStructureType = "activity_park_manager" | "local_authority";

export type UrbanZoneFinalSummaryViewData = {
  address: string;
  urbanZoneType?: UrbanZoneType;
  totalSurfaceArea: number;
  parcelSurfaceAreas: Partial<Record<UrbanZoneLandParcelType, number>>;
  soilsDistribution: SoilsDistribution;
  hasContaminatedSoils: boolean;
  contaminatedSoilSurface?: number;
  managerStructureType?: ManagerStructureType;
  vacantPremisesFootprint?: number;
  vacantPremisesFloorArea?: number;
  fullTimeJobs?: number;
  siteName: string;
  siteDescription?: string;
};

export const selectUrbanZoneFinalSummaryViewData = createSelector(
  [
    (state: RootState) => state.siteCreation.urbanZone.steps,
    (state: RootState) => state.siteCreation.siteData,
  ],
  (steps, siteData): UrbanZoneFinalSummaryViewData => {
    const selectedTypes = getSelectedParcelTypes(steps);

    const parcelSurfaceAreas =
      ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION")
        ?.surfaceAreas ?? {};

    const aggregated = new SurfaceAreaDistribution<SoilType>();
    for (const parcelType of selectedTypes) {
      const stepId = getParcelStepIds(parcelType).soilsDistribution;
      const stepAnswers = ReadStateHelper.getStepAnswers(steps, stepId);
      const soilsDistribution = stepAnswers?.soilsDistribution;
      if (soilsDistribution) {
        for (const [soilType, area] of typedObjectEntries(soilsDistribution)) {
          aggregated.addSurface(soilType, area ?? 0);
        }
      }
    }

    const contamination = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_SOILS_CONTAMINATION");
    const manager = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_MANAGER");
    const vacantFootprint = ReadStateHelper.getStepAnswers(
      steps,
      "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
    );
    const vacantFloorArea = ReadStateHelper.getStepAnswers(
      steps,
      "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
    );
    const fullTimeJobs = ReadStateHelper.getStepAnswers(
      steps,
      "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
    );
    const naming = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_NAMING");

    return {
      address: siteData.address?.value ?? "",
      urbanZoneType: siteData.urbanZoneType,
      totalSurfaceArea: siteData.surfaceArea ?? 0,
      parcelSurfaceAreas,
      soilsDistribution: aggregated.toJSON(),
      hasContaminatedSoils: contamination?.hasContaminatedSoils ?? false,
      contaminatedSoilSurface: contamination?.contaminatedSoilSurface,
      managerStructureType: manager?.structureType,
      vacantPremisesFootprint: vacantFootprint?.surfaceArea,
      vacantPremisesFloorArea: vacantFloorArea?.surfaceArea,
      fullTimeJobs: fullTimeJobs?.fullTimeJobs,
      siteName: naming?.name ?? "",
      siteDescription: naming?.description,
    };
  },
);
