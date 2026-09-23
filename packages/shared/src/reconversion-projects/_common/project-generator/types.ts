import type { SiteNature } from "../../../site";
import type { SoilsDistribution } from "../../../soils";
import type { ReconversionProjectSaveDto } from "../../reconversionProjectSchemas";

export type SiteData = {
  id: string;
  nature: SiteNature;
  surfaceArea: number;
  soilsDistribution: SoilsDistribution;
  contaminatedSoilSurface?: number;
  owner: {
    structureType: string;
    name?: string;
  };
};
export type ReconversionProject = ReconversionProjectSaveDto;
