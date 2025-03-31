import { v4 as uuid } from "uuid";

import { FricheActivity, generateSiteName, SiteYearlyExpense } from "..";
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

type FricheGenerationProps = SiteGenerationProps & {
  fricheActivity: FricheActivity;
};

function getSoilsDistributionForFricheActivity(
  surfaceArea: number,
  fricheActivity: FricheActivity,
): SoilsDistribution {
  switch (fricheActivity) {
    case "AGRICULTURE":
      return {
        PRAIRIE_GRASS: 0.5 * surfaceArea,
        CULTIVATION: 0.5 * surfaceArea,
      };
    case "INDUSTRY":
      return {
        BUILDINGS: 0.4 * surfaceArea,
        IMPERMEABLE_SOILS: 0.4 * surfaceArea,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.2 * surfaceArea,
      };
    case "MILITARY":
      return {
        BUILDINGS: 0.15 * surfaceArea,
        IMPERMEABLE_SOILS: 0.15 * surfaceArea,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.2 * surfaceArea,
        PRAIRIE_GRASS: 0.5 * surfaceArea,
      };
    case "BUILDING":
      return {
        BUILDINGS: 0.8 * surfaceArea,
        IMPERMEABLE_SOILS: 0.1 * surfaceArea,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.1 * surfaceArea,
      };
    case "RAILWAY":
      return {
        BUILDINGS: 0.05 * surfaceArea,
        IMPERMEABLE_SOILS: 0.4 * surfaceArea,
        MINERAL_SOIL: 0.5 * surfaceArea,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.05 * surfaceArea,
      };
    case "PORT":
      return {
        BUILDINGS: 0.8 * surfaceArea,
        IMPERMEABLE_SOILS: 0.2 * surfaceArea,
      };
    case "TIP_OR_RECYCLING_SITE":
      return {
        IMPERMEABLE_SOILS: 0.45 * surfaceArea,
        MINERAL_SOIL: 0.05 * surfaceArea,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.5 * surfaceArea,
      };
    case "OTHER":
      return {
        BUILDINGS: 0.3 * surfaceArea,
        IMPERMEABLE_SOILS: 0.2 * surfaceArea,
        MINERAL_SOIL: 0.15 * surfaceArea,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.25 * surfaceArea,
        ARTIFICIAL_TREE_FILLED: 0.1 * surfaceArea,
      };
  }
}

export class FricheGenerator implements SiteGenerator<FricheGenerationProps> {
  fromSurfaceAreaAndLocalInformation(props: FricheGenerationProps): Friche {
    const { id, surfaceArea, address, cityPopulation, fricheActivity } = props;

    const soilsDistribution = getSoilsDistributionForFricheActivity(surfaceArea, fricheActivity);

    const yearlyExpenses: SiteYearlyExpense[] = [
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

    if (soilsDistribution.BUILDINGS) {
      yearlyExpenses.push(
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
      );
    }

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
      fricheActivity,
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
      fricheActivity: "OTHER",
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
