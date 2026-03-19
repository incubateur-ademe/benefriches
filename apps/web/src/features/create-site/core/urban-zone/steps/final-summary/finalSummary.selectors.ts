import { createSelector } from "@reduxjs/toolkit";
import { type SoilsDistribution, type UrbanZoneLandParcelType, type UrbanZoneType } from "shared";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../stateHelpers";
import {
  getFullTimeJobs,
  getManagerName,
  getManagerStructureType,
  getVacantPremisesFloorArea,
  getVacantPremisesFootprintSurfaceArea,
} from "../management/managementReaders";
import { aggregateSoilsDistribution } from "../summary/soilsReaders";

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
  managerName?: string;
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
    const parcelSurfaceAreas =
      ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION")
        ?.surfaceAreas ?? {};

    const contamination = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_SOILS_CONTAMINATION");
    const naming = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_NAMING");

    return {
      address: siteData.address?.value ?? "",
      urbanZoneType: siteData.urbanZoneType,
      totalSurfaceArea: siteData.surfaceArea ?? 0,
      parcelSurfaceAreas,
      soilsDistribution: aggregateSoilsDistribution(steps),
      hasContaminatedSoils: contamination?.hasContaminatedSoils ?? false,
      contaminatedSoilSurface: contamination?.contaminatedSoilSurface,
      managerStructureType: getManagerStructureType(steps),
      managerName: getManagerName(steps),
      vacantPremisesFootprint: getVacantPremisesFootprintSurfaceArea(steps),
      vacantPremisesFloorArea: getVacantPremisesFloorArea(steps),
      fullTimeJobs: getFullTimeJobs(steps),
      siteName: naming?.name ?? "",
      siteDescription: naming?.description,
    };
  },
);
