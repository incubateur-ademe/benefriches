import { v4 as uuid } from "uuid";

import { relatedSiteData } from "../../__tests__/siteData.mock";
import { ProjectCreationState } from "../../createProject.reducer";

export const mockSiteData: Exclude<ProjectCreationState["siteData"], undefined> = {
  id: uuid(),
  name: "Friche de blajan",
  address: relatedSiteData.address,
  isExpressSite: false,
  surfaceArea: 10000,
  nature: "FRICHE" as const,
  hasContaminatedSoils: true,
  contaminatedSoilSurface: 2000,
  owner: {
    name: "Ville de Test",
    structureType: "municipality" as const,
  },
  soilsDistribution: {
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1000,
    BUILDINGS: 2000,
    IMPERMEABLE_SOILS: 3000,
    MINERAL_SOIL: 2000,
    PRAIRIE_GRASS: 2000,
  },
};
