import { v4 as uuid } from "uuid";

import {
  City,
  FricheActivity,
  generateSiteName,
  SiteGenerationProps,
  SiteGenerator,
  SiteYearlyExpense,
} from "..";
import { computeEstimatedPropertyTaxesAmount } from "../../financial";
import { formatMunicipalityName } from "../../local-authority";
import { createSoilSurfaceAreaDistribution } from "../../soils";
import { getSoilsDistributionForFricheActivity } from "../friche/spaces";
import { createFriche, Friche } from "../site";
import {
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computeSecurityDefaultCost,
} from "../yearlyExpenses";

type FricheGenerationProps = SiteGenerationProps & {
  fricheActivity: FricheActivity;
  builtSurfaceArea?: number;
  hasContaminatedSoils?: boolean;
};

export const getContaminatedPercentageFromFricheActivity = (fricheActivity: FricheActivity) => {
  switch (fricheActivity) {
    case "INDUSTRY":
      return 0.5;
    case "MILITARY":
      return 0.05;
    case "RAILWAY":
      return 0.1;
    case "PORT":
      return 0.15;
    case "TIP_OR_RECYCLING_SITE":
      return 0.05;
    case "AGRICULTURE":
    case "BUILDING":
    case "OTHER":
      return 0;
  }
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
