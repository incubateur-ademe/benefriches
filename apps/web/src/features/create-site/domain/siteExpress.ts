import { SiteYearlyExpense, SoilType } from "shared";
import { formatMunicipalityName } from "shared";

import { CreateSiteGatewayPayload } from "../application/createSite.actions";
import {
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computeEstimatedPropertyTaxesAmount,
  computeSecurityDefaultCost,
} from "./expenses.functions";
import { SiteExpressDraft } from "./siteFoncier.types";
import { generateSiteName } from "./siteName";

const FRANCE_AVERAGE_CITY_POPULATION = 1800;

const getExpressSiteData = (
  siteData: SiteExpressDraft,
  currentUserId: string,
): CreateSiteGatewayPayload => {
  const surfaceArea = siteData.surfaceArea;

  const {
    municipality,
    population = FRANCE_AVERAGE_CITY_POPULATION,
    ...address
  } = siteData.address;

  const soilsDistribution = {
    BUILDINGS: 0.3 * surfaceArea,
    IMPERMEABLE_SOILS: 0.2 * surfaceArea,
    MINERAL_SOIL: 0.15 * surfaceArea,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.25 * surfaceArea,
    ARTIFICIAL_TREE_FILLED: 0.1 * surfaceArea,
  };

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

  if (siteData.isFriche) {
    yearlyExpenses.push(
      {
        amount: computeIllegalDumpingDefaultCost(population),
        purpose: "illegalDumpingCost",
        bearer: "owner",
      },
      {
        amount: computeSecurityDefaultCost(surfaceArea),
        purpose: "security",
        bearer: "owner",
      },
    );
  }

  return {
    ...siteData,
    address,
    createdBy: currentUserId,
    creationMode: "express",
    soilsDistribution,
    contaminatedSoilSurface: siteData.isFriche ? 0.5 * surfaceArea : undefined,
    owner: {
      structureType: "municipality",
      name: formatMunicipalityName(municipality),
    },
    tenant: {
      structureType: "company",
      name: "Actuel locataire",
    },
    yearlyExpenses,
    yearlyIncomes: [],
    name: generateSiteName({
      address: siteData.address,
      soils: Object.keys(soilsDistribution) as SoilType[],
      isFriche: siteData.isFriche,
    }),
  };
};

export default getExpressSiteData;
