import { LandParcelsSelectionHandler } from "../steps/land-parcels/land-parcels-selection/landParcelsSelection.handler";
import { LandParcelsSurfaceDistributionHandler } from "../steps/land-parcels/land-parcels-surface-distribution/landParcelsSurfaceDistribution.handler";
import {
  createParcelBuildingsFloorAreaHandler,
  createParcelSoilsDistributionHandler,
} from "../steps/per-parcel-soils/parcelSoilsHandlerFactory";
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
  // Summary
  URBAN_ZONE_SOILS_SUMMARY: UrbanZoneSoilsSummaryHandler,
};
