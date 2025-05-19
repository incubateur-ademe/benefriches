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
};

function getContaminatedSoilSurfaceFromFricheActivity(
  surfaceArea: number,
  fricheActivity: FricheActivity,
) {
  switch (fricheActivity) {
    case "INDUSTRY":
      return 0.5 * surfaceArea;
    case "MILITARY":
      return 0.05 * surfaceArea;
    case "RAILWAY":
      return 0.1 * surfaceArea;
    case "PORT":
      return 0.15 * surfaceArea;
    case "TIP_OR_RECYCLING_SITE":
      return 0.05 * surfaceArea;
    case "AGRICULTURE":
    case "BUILDING":
    case "OTHER":
      return 0;
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

    const contaminatedSoilSurface = getContaminatedSoilSurfaceFromFricheActivity(
      surfaceArea,
      fricheActivity,
    );

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
      name: generateSiteName({ cityName: address.city, nature: "FRICHE" }),
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
