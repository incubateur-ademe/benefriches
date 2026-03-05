import {
  createSoilSurfaceAreaDistribution,
  formatMunicipalityName,
  generateSiteName,
  getLabelForNaturalAreaType,
  getSoilsDistributionForNaturalAreaType,
  NaturalAreaType,
} from "shared";

import { type AgriculturalOrNaturalSite, createAgriculturalOrNaturalSite } from "./site";
import { type SiteGenerationProps, type SiteGenerator } from "./siteGeneration";

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
      throw new Error(`Failed to create site`);
    }
    return result.site;
  }
}
