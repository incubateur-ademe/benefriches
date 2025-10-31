import { SiteNature } from "../../../site";
import { SoilsDistribution } from "../../../soils";
import { ReconversionProjectSaveDto } from "../../reconversionProjectSchemas";

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
