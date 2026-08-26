import type { UrbanZoneStepParams } from "../../stepHandlerRegistry";
import { getVacantPremisesFootprintSurfaceArea } from "../management/managementReaders";

export function hasActivity(params: UrbanZoneStepParams): boolean {
  const footprint = getVacantPremisesFootprintSurfaceArea(params.answers);
  const totalSurfaceArea = params.context.siteData.surfaceArea;
  // Infinity ensures the comparison always passes when surfaceArea is unknown
  return footprint !== undefined && footprint < (totalSurfaceArea ?? Infinity);
}
