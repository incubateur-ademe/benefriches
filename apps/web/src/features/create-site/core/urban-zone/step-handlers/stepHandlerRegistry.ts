import { UrbanZoneSoilsContaminationHandler } from "../steps/contamination/soilsContamination.handler";
import { UrbanZoneSoilsContaminationIntroductionHandler } from "../steps/contamination/soilsContaminationIntroduction.handler";
import { LandParcelsSelectionHandler } from "../steps/land-parcels/land-parcels-selection/landParcelsSelection.handler";
import { LandParcelsSurfaceDistributionHandler } from "../steps/land-parcels/land-parcels-surface-distribution/landParcelsSurfaceDistribution.handler";
import { FullTimeJobsEquivalentHandler } from "../steps/management/full-time-jobs-equivalent/fullTimeJobsEquivalent.handler";
import { UrbanZoneManagementIntroductionHandler } from "../steps/management/management-introduction/managementIntroduction.handler";
import { UrbanZoneManagerHandler } from "../steps/management/manager/manager.handler";
import { VacantCommercialPremisesFloorAreaHandler } from "../steps/management/vacant-commercial-premises-floor-area/vacantCommercialPremisesFloorArea.handler";
import { VacantCommercialPremisesFootprintHandler } from "../steps/management/vacant-commercial-premises-footprint/vacantCommercialPremisesFootprint.handler";
import {
  createParcelBuildingsFloorAreaHandler,
  createParcelSoilsDistributionHandler,
} from "../steps/per-parcel-soils/parcelSoilsHandlerFactory";
import { SoilsAndSpacesIntroductionHandler } from "../steps/soils-and-spaces-introduction/soilsAndSpacesIntroduction.handler";
import { UrbanZoneSoilsCarbonStorageHandler } from "../steps/summary/soils-carbon-storage/soilsCarbonStorage.handler";
import { UrbanZoneSoilsSummaryHandler } from "../steps/summary/soils-summary/soilsSummary.handler";
import type { SchematizedAnswerStepId, UrbanZoneSiteCreationStep } from "../urbanZoneSteps";
import type { AnswerStepHandler, InfoStepHandler } from "./stepHandler.type";

export type UrbanZoneStepHandlerRegistry = Partial<
  Record<UrbanZoneSiteCreationStep, InfoStepHandler | AnswerStepHandler<SchematizedAnswerStepId>>
>;

export const urbanZoneStepHandlerRegistry: UrbanZoneStepHandlerRegistry = {
  URBAN_ZONE_LAND_PARCELS_SELECTION: LandParcelsSelectionHandler,
  URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION: LandParcelsSurfaceDistributionHandler,
  // Per-parcel soils distribution
  URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: createParcelSoilsDistributionHandler(
    "COMMERCIAL_ACTIVITY_AREA",
  ),
  URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION:
    createParcelSoilsDistributionHandler("PUBLIC_SPACES"),
  URBAN_ZONE_SERVICED_SURFACE_SOILS_DISTRIBUTION:
    createParcelSoilsDistributionHandler("SERVICED_SURFACE"),
  URBAN_ZONE_RESERVED_SURFACE_SOILS_DISTRIBUTION:
    createParcelSoilsDistributionHandler("RESERVED_SURFACE"),
  // Per-parcel buildings floor area
  URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA: createParcelBuildingsFloorAreaHandler(
    "COMMERCIAL_ACTIVITY_AREA",
  ),
  URBAN_ZONE_PUBLIC_SPACES_BUILDINGS_FLOOR_AREA:
    createParcelBuildingsFloorAreaHandler("PUBLIC_SPACES"),
  URBAN_ZONE_SERVICED_SURFACE_BUILDINGS_FLOOR_AREA:
    createParcelBuildingsFloorAreaHandler("SERVICED_SURFACE"),
  URBAN_ZONE_RESERVED_SURFACE_BUILDINGS_FLOOR_AREA:
    createParcelBuildingsFloorAreaHandler("RESERVED_SURFACE"),
  // Introduction
  URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION: SoilsAndSpacesIntroductionHandler,
  // Summary
  URBAN_ZONE_SOILS_SUMMARY: UrbanZoneSoilsSummaryHandler,
  URBAN_ZONE_SOILS_CARBON_STORAGE: UrbanZoneSoilsCarbonStorageHandler,
  // Contamination
  URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION: UrbanZoneSoilsContaminationIntroductionHandler,
  URBAN_ZONE_SOILS_CONTAMINATION: UrbanZoneSoilsContaminationHandler,
  // Management
  URBAN_ZONE_MANAGEMENT_INTRODUCTION: UrbanZoneManagementIntroductionHandler,
  URBAN_ZONE_MANAGER: UrbanZoneManagerHandler,
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: VacantCommercialPremisesFootprintHandler,
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA: VacantCommercialPremisesFloorAreaHandler,
  URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT: FullTimeJobsEquivalentHandler,
};
