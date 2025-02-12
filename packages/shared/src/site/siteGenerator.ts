import { v4 as uuid } from "uuid";

import { generateSiteName, SiteYearlyExpense } from ".";
import { computeEstimatedPropertyTaxesAmount } from "../financial";
import { formatMunicipalityName } from "../local-authority";
import { SoilsDistribution, SoilType } from "../soils";
import { Friche, NonFriche } from "./site";
import {
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computeSecurityDefaultCost,
} from "./yearlyExpenses";

type City = {
  name: string;
  cityCode: string;
  population: number;
};

export class FricheGenerator {
  fromSurfaceAreaAndCity(surfaceArea: number, city: City): Friche {
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
        amount: computeIllegalDumpingDefaultCost(city.population),
        purpose: "illegalDumpingCost",
        bearer: "owner",
      },
      {
        amount: computeSecurityDefaultCost(surfaceArea),
        purpose: "security",
        bearer: "owner",
      },
    ];

    return {
      id: uuid(),
      address: {
        city: city.name,
        label: city.name,
        cityCode: city.cityCode,
      },
      soilsDistribution,
      hasContaminatedSoils: true,
      contaminatedSoilSurface: 0.5 * surfaceArea,
      owner: {
        structureType: "municipality",
        name: formatMunicipalityName(city.name),
      },
      tenant: {
        structureType: "company",
        name: "Actuel locataire",
      },
      yearlyExpenses,
      yearlyIncomes: [],
      name: generateSiteName({
        cityName: city.name,
        isFriche: true,
        soils: Object.keys(soilsDistribution) as SoilType[],
      }),
      fricheActivity: "OTHER",
      isFriche: true,
      surfaceArea,
    };
  }
}

export class NonFricheSiteGenerator {
  fromSurfaceAreaAndCity(surfaceArea: number, city: City): NonFriche {
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
    ];

    return {
      id: uuid(),
      address: {
        city: city.name,
        label: city.name,
        cityCode: city.cityCode,
      },
      soilsDistribution,
      owner: {
        structureType: "municipality",
        name: formatMunicipalityName(city.name),
      },
      tenant: {
        structureType: "company",
        name: "Actuel locataire",
      },
      yearlyExpenses,
      yearlyIncomes: [],
      name: generateSiteName({
        cityName: city.name,
        isFriche: false,
        soils: Object.keys(soilsDistribution) as SoilType[],
      }),
      isFriche: false,
      surfaceArea,
    };
  }
}
