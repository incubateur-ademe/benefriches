import { formatMunicipalityName } from "../../local-authority";
import { createSoilSurfaceAreaDistribution, SoilsDistribution } from "../../soils";
import { generateSiteName } from "../name";
import { getLabelForNaturalAreaType } from "../natural-area/naturalAreaType";
import { AgriculturalOrNaturalSite, createAgriculturalOrNaturalSite } from "../site";
import { SiteGenerationProps, SiteGenerator } from "../site-generation";

type NaturalAreaType = "PRAIRIE" | "FOREST" | "WET_LAND" | "MIXED_NATURAL_AREA";

export function getSoilsDistributionForNaturalAreaType(
  surfaceArea: number,
  naturalAreaType: NaturalAreaType,
): SoilsDistribution {
  switch (naturalAreaType) {
    case "PRAIRIE":
      return {
        PRAIRIE_BUSHES: surfaceArea,
      };
    case "FOREST":
      return {
        FOREST_MIXED: surfaceArea,
      };
    case "WET_LAND":
      return {
        WET_LAND: surfaceArea,
      };
    case "MIXED_NATURAL_AREA":
      return {
        PRAIRIE_BUSHES: 0.3 * surfaceArea,
        FOREST_MIXED: 0.3 * surfaceArea,
        WATER: 0.1 * surfaceArea,
        MINERAL_SOIL: 0.3 * surfaceArea,
      };
  }
}

type NaturalAreaGenerationProps = SiteGenerationProps & {
  naturalAreaType: NaturalAreaType;
};

export class NaturalAreaGenerator implements SiteGenerator<NaturalAreaGenerationProps> {
  fromSurfaceAreaAndLocalInformation(props: NaturalAreaGenerationProps): AgriculturalOrNaturalSite {
    const { id, surfaceArea, address, naturalAreaType } = props;

    const soilsDistribution = getSoilsDistributionForNaturalAreaType(surfaceArea, naturalAreaType);

    const result = createAgriculturalOrNaturalSite({
      id,
      address,
      nature: "NATURAL_AREA",
      naturalAreaType,
      soilsDistribution: createSoilSurfaceAreaDistribution(soilsDistribution),
      owner: {
        structureType: "municipality",
        name: formatMunicipalityName(address.city),
      },
      yearlyExpenses: [],
      yearlyIncomes: [],
      name: generateSiteName({ cityName: address.city, nature: "NATURAL_AREA", naturalAreaType }),
      description: getLabelForNaturalAreaType(naturalAreaType),
    });

    if (!result.success) {
      throw new Error(`Failed to create site, ${result.error}`);
    }
    return result.site;
  }
}
