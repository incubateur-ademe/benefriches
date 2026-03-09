import { LandParcelsSelectionHandler } from "../steps/land-parcels/land-parcels-selection/landParcelsSelection.handler";
import { LandParcelsSurfaceDistributionHandler } from "../steps/land-parcels/land-parcels-surface-distribution/landParcelsSurfaceDistribution.handler";
import type { SchematizedAnswerStepId, UrbanZoneSiteCreationStep } from "../urbanZoneSteps";
import type { AnswerStepHandler, InfoStepHandler } from "./stepHandler.type";

export type UrbanZoneStepHandlerRegistry = Partial<
  Record<UrbanZoneSiteCreationStep, InfoStepHandler | AnswerStepHandler<SchematizedAnswerStepId>>
>;

export const urbanZoneStepHandlerRegistry: UrbanZoneStepHandlerRegistry = {
  URBAN_ZONE_LAND_PARCELS_SELECTION: LandParcelsSelectionHandler,
  URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION: LandParcelsSurfaceDistributionHandler,
};
