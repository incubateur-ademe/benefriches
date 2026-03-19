import type { UrbanZoneStepContext } from "../../step-handlers/stepHandler.type";
import { getVacantPremisesFootprintSurfaceArea } from "../management/managementReaders";

export function hasActivity(context: UrbanZoneStepContext): boolean {
  const footprint = getVacantPremisesFootprintSurfaceArea(context.stepsState);
  const totalSurfaceArea = context.siteData.surfaceArea;
  // Infinity ensures the comparison always passes when surfaceArea is unknown
  return footprint !== undefined && footprint < (totalSurfaceArea ?? Infinity);
}
