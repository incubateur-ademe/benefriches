import {
  AgriculturalOperationActivity,
  computeAgriculturalOperationYearlyExpenses,
  computeAgriculturalOperationYearlyIncomes,
  formatMunicipalityName,
  generateSiteName,
  getLabelForAgriculturalOperationActivity,
  getSoilsDistributionForAgriculturalOperationActivity,
} from "shared";

import { type AgriculturalOrNaturalSite, createAgriculturalOrNaturalSite } from "./site";
import { type SiteGenerationProps, type SiteGenerator } from "./siteGeneration";

type AgriculturalOperationGenerationProps = SiteGenerationProps & {
  operationActivity: AgriculturalOperationActivity;
};

export class AgriculturalOperationGenerator implements SiteGenerator<AgriculturalOperationGenerationProps> {
  fromSurfaceAreaAndLocalInformation(
    props: AgriculturalOperationGenerationProps,
  ): AgriculturalOrNaturalSite {
    const { id, surfaceArea, address, operationActivity } = props;

    const soilsDistribution = getSoilsDistributionForAgriculturalOperationActivity(
      surfaceArea,
      operationActivity,
    );

    const result = createAgriculturalOrNaturalSite({
      id,
      address,
      nature: "AGRICULTURAL_OPERATION",
      agriculturalOperationActivity: operationActivity,
      isSiteOperated: true,
      soilsDistribution,
      owner: {
        structureType: "municipality",
        name: formatMunicipalityName(address.city),
      },
      yearlyExpenses: computeAgriculturalOperationYearlyExpenses(
        props.operationActivity,
        props.surfaceArea,
        "owner",
      ),
      yearlyIncomes: computeAgriculturalOperationYearlyIncomes(
        props.operationActivity,
        props.surfaceArea,
      ),
      name: generateSiteName({ cityName: address.city, nature: "AGRICULTURAL_OPERATION" }),
      description: getLabelForAgriculturalOperationActivity(operationActivity),
    });

    if (!result.success) {
      throw new Error(`Failed to create site`);
    }
    return result.site;
  }
}
