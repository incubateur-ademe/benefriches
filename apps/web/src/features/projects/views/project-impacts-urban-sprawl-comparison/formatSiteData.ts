import { SiteImpactsDataView } from "shared";

import { SiteFeatures } from "@/features/site-features/core/siteFeatures";

export const formatSiteDataAsFeatures = (siteData: SiteImpactsDataView) => {
  return {
    ...siteData,
    address: siteData.address.value,
    accidents: {
      minorInjuries: siteData.accidentsMinorInjuries || 0,
      severyInjuries: siteData.accidentsSevereInjuries || 0,
      accidentsDeaths: siteData.accidentsDeaths || 0,
    },
    expenses: siteData.yearlyExpenses,
    incomes: siteData.yearlyIncomes,
    description: siteData.description || "",
    contaminatedSurfaceArea: siteData.contaminatedSoilSurface,
  } as SiteFeatures;
};
