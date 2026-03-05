import {
  computeEstimatedPropertyTaxesAmount,
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computeSecurityDefaultCost,
  createSoilSurfaceAreaDistribution,
  FricheActivity,
  formatMunicipalityName,
  generateSiteName,
  getContaminatedPercentageFromFricheActivity,
  getSoilsDistributionForFricheActivity,
  SiteYearlyExpense,
} from "shared";
import { v4 as uuid } from "uuid";

import { createFriche, type Friche } from "./site";
import { type City, type SiteGenerationProps, type SiteGenerator } from "./siteGeneration";

type FricheGenerationProps = SiteGenerationProps & {
  fricheActivity: FricheActivity;
  builtSurfaceArea?: number;
  hasContaminatedSoils?: boolean;
};

function getContaminatedSoilSurfaceFromFricheActivity(
  surfaceArea: number,
  fricheActivity: FricheActivity,
) {
  return getContaminatedPercentageFromFricheActivity(fricheActivity) * surfaceArea;
}

export class FricheGenerator implements SiteGenerator<FricheGenerationProps> {
  fromSurfaceAreaAndLocalInformation(props: FricheGenerationProps): Friche {
    const {
      id,
      surfaceArea,
      address,
      cityPopulation,
      fricheActivity,
      builtSurfaceArea,
      hasContaminatedSoils,
    } = props;

    const soilsDistributionOptions = builtSurfaceArea ? { builtSurfaceArea } : undefined;
    const soilsDistribution = getSoilsDistributionForFricheActivity(
      surfaceArea,
      fricheActivity,
      soilsDistributionOptions,
    );

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

    // assume contaminated soil surface area based on friche activity if not specified
    const contaminatedSoilSurface =
      hasContaminatedSoils === false
        ? 0
        : getContaminatedSoilSurfaceFromFricheActivity(surfaceArea, fricheActivity);

    const result = createFriche({
      id,
      address,
      soilsDistribution: createSoilSurfaceAreaDistribution(soilsDistribution),
      contaminatedSoilSurface,
      owner: {
        structureType: "municipality",
        name: formatMunicipalityName(address.city),
      },
      yearlyExpenses,
      fricheActivity,
      name: generateSiteName({ cityName: address.city, nature: "FRICHE", fricheActivity }),
    });

    if (!result.success) {
      throw new Error(`Failed to create friche`);
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
        lat: 0,
        long: 0,
        postCode: "00000",
      },
    });
  }
}
