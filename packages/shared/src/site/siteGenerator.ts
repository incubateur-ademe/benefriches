import { v4 as uuid } from "uuid";

import { generateSiteName, SiteYearlyExpense } from ".";
import { computeEstimatedPropertyTaxesAmount } from "../financial";
import { formatMunicipalityName } from "../local-authority";
import { createSoilSurfaceAreaDistribution, SoilsDistribution, SoilType } from "../soils";
import { createFriche, Friche, AgriculturalOrNaturalSite } from "./site";
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

    const result = createFriche({
      id: uuid(),
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
      soilsDistribution: createSoilSurfaceAreaDistribution(soilsDistribution),
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
      name: generateSiteName({
        cityName: city.name,
        isFriche: true,
        soils: Object.keys(soilsDistribution) as SoilType[],
      }),
    });

    if (!result.success) {
      throw new Error(`Failed to create friche, ${result.error}`);
    }
    return result.site;
  }
}

export class AgriculturalOrNaturalSiteSiteGenerator {
  fromSurfaceAreaAndCity(surfaceArea: number, city: City): AgriculturalOrNaturalSite {
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
      nature: "AGRICULTURAL",
      isFriche: false,
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
      soilsDistribution: createSoilSurfaceAreaDistribution(soilsDistribution),
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
      surfaceArea,
    };
  }
}
