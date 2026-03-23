import type { SiteImpactsDataView } from "shared";

import type { SiteFeatures } from "@/features/sites/core/site.types";

export const formatSiteDataAsFeatures = (siteData: SiteImpactsDataView): SiteFeatures => {
  const base = {
    id: siteData.id,
    name: siteData.name,
    isExpressSite: siteData.isExpressSite,
    address: siteData.address.value,
    ownerName: siteData.ownerName,
    tenantName: siteData.tenantName,
    surfaceArea: siteData.surfaceArea,
    soilsDistribution: siteData.soilsDistribution,
    expenses: siteData.yearlyExpenses,
    incomes: siteData.yearlyIncomes,
    description: siteData.description,
  };

  switch (siteData.nature) {
    case "FRICHE":
      return {
        ...base,
        nature: "FRICHE",
        fricheActivity: siteData.fricheActivity,
        contaminatedSurfaceArea: siteData.contaminatedSoilSurface,
        accidents: {
          minorInjuries: siteData.accidentsMinorInjuries || 0,
          severeInjuries: siteData.accidentsSevereInjuries || 0,
          accidentsDeaths: siteData.accidentsDeaths || 0,
        },
      };
    case "AGRICULTURAL_OPERATION":
      return {
        ...base,
        nature: "AGRICULTURAL_OPERATION",
        agriculturalOperationActivity: siteData.agriculturalOperationActivity!,
      };
    case "NATURAL_AREA":
      return {
        ...base,
        nature: "NATURAL_AREA",
        naturalAreaType: siteData.naturalAreaType!,
      };
    case "URBAN_ZONE":
      return {
        ...base,
        nature: "URBAN_ZONE",
        contaminatedSurfaceArea: siteData.contaminatedSoilSurface,
      };
  }
};
