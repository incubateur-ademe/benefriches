import { v4 as uuid } from "uuid";

import { generateSiteName, SiteYearlyExpense } from "..";
import { computeEstimatedPropertyTaxesAmount } from "../../financial";
import { formatMunicipalityName } from "../../local-authority";
import { createSoilSurfaceAreaDistribution, SoilsDistribution, SoilType } from "../../soils";
import { createFriche, Friche } from "../site";
import {
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computeSecurityDefaultCost,
} from "../yearlyExpenses";
import { City, SiteGenerationProps, SiteGenerator } from "./siteGenerator";

type FricheGenerationProps = SiteGenerationProps;

export class FricheGenerator implements SiteGenerator<FricheGenerationProps> {
  fromSurfaceAreaAndLocalInformation(props: FricheGenerationProps): Friche {
    const { id, surfaceArea, address, cityPopulation } = props;

    const soilsDistribution = {
      BUILDINGS: 0.3 * surfaceArea,
      IMPERMEABLE_SOILS: 0.2 * surfaceArea,
      MINERAL_SOIL: 0.15 * surfaceArea,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.25 * surfaceArea,
      ARTIFICIAL_TREE_FILLED: 0.1 * surfaceArea,
    } as const satisfies SoilsDistribution;

    const yearlyExpenses: SiteYearlyExpense[] = [
      {
        amount: computeMaintenanceDefaultCost(soilsDistribution.BUILDINGS),
        purpose: "maintenance",
        bearer: "owner",
      },
      {
        amount: computeEstimatedPropertyTaxesAmount(soilsDistribution.BUILDINGS),
        purpose: "propertyTaxes",
        bearer: "owner",
      },
      {
        amount: computeIllegalDumpingDefaultCost(cityPopulation),
        purpose: "illegalDumpingCost",
        bearer: "owner",
      },
      {
        amount: computeSecurityDefaultCost(surfaceArea),
        purpose: "security",
        bearer: "owner",
      },
    ];

    const result = createFriche({
      id,
      address,
      soilsDistribution: createSoilSurfaceAreaDistribution(soilsDistribution),
      contaminatedSoilSurface: 0.5 * surfaceArea,
      owner: {
        structureType: "municipality",
        name: formatMunicipalityName(address.city),
      },
      yearlyExpenses,
      name: generateSiteName({
        cityName: address.city,
        isFriche: true,
        soils: Object.keys(soilsDistribution) as SoilType[],
      }),
    });

    if (!result.success) {
      throw new Error(`Failed to create friche, ${result.error}`);
    }
    return result.site;
  }

  fromSurfaceAreaAndCity(surfaceArea: number, city: City): Friche {
    return this.fromSurfaceAreaAndLocalInformation({
      id: uuid(),
      surfaceArea,
      cityPopulation: city.population,
      address: {
        city: city.name,
        value: city.name,
        cityCode: city.cityCode,
        // todo: mandatory data from Address type/schema but not used here, maybe simplify Address
        banId: uuid(),
        lat: 0,
        long: 0,
        postCode: "00000",
      },
    });
  }
}
