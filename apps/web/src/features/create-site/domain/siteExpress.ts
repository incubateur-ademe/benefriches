import { SoilType } from "shared";
import { v4 as uuid } from "uuid";
import { CreateSiteGatewayPayload } from "../application/createSite.actions";
import {
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computePropertyTaxesDefaultCost,
  computeSecurityDefaultCost,
} from "./expenses.functions";
import { Expense, SiteExpressDraft } from "./siteFoncier.types";
import { generateSiteName } from "./siteName";

import { formatMunicipalityName } from "@/shared/services/strings/formatLocalAuthorityName";

const getExpressSiteData = (
  siteData: SiteExpressDraft,
  cityPopulation: number,
  currentUserId?: string,
): CreateSiteGatewayPayload => {
  const surfaceArea = siteData.surfaceArea;

  const cityName = siteData.address.city;

  const soilsDistribution = {
    BUILDINGS: 0.3 * surfaceArea,
    IMPERMEABLE_SOILS: 0.2 * surfaceArea,
    MINERAL_SOIL: 0.15 * surfaceArea,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.25 * surfaceArea,
    ARTIFICIAL_TREE_FILLED: 0.1 * surfaceArea,
  };

  const yearlyExpenses = [
    {
      amount: computeMaintenanceDefaultCost(soilsDistribution.BUILDINGS),
      purpose: "maintenance",
      bearer: "tenant",
      purposeCategory: "site_management",
    },
    {
      amount: computePropertyTaxesDefaultCost(surfaceArea),
      purpose: "propertyTaxes",
      bearer: "tenant",
      purposeCategory: "taxes",
    },
  ];

  if (siteData.isFriche) {
    yearlyExpenses.push(
      {
        amount: computeIllegalDumpingDefaultCost(cityPopulation),
        purpose: "illegalDumpingCost",
        bearer: "owner",
        purposeCategory: "safety",
      },
      {
        amount: computeSecurityDefaultCost(surfaceArea),
        purpose: "security",
        bearer: "owner",
        purposeCategory: "safety",
      },
    );
  }

  return {
    ...siteData,
    createdBy: currentUserId ?? uuid(),
    soilsDistribution,
    contaminatedSoilSurface: siteData.isFriche ? 0.5 * surfaceArea : undefined,
    owner: {
      structureType: "municipality",
      name: cityName ? formatMunicipalityName(cityName) : "Mairie",
    },
    yearlyExpenses: yearlyExpenses as Expense[],
    yearlyIncomes: [],
    name: generateSiteName({
      address: siteData.address,
      soils: Object.keys(soilsDistribution) as SoilType[],
      isFriche: siteData.isFriche,
    }),
  };
};

export default getExpressSiteData;
