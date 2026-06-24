import type { GetSiteImpactsDto, SiteImpactsDataView, SiteStatuQuoImpacts } from "shared";
import { roundToInteger } from "shared";

import type { SoilsCarbonStorage } from "src/reconversion-projects/core/gateways/SoilsCarbonStorageService";
import { SumOnEvolutionPeriodService } from "src/reconversion-projects/core/model/sum-on-evolution-period/SumOnEvolutionPeriodService";

import { getSiteStatuQuoIndirectsImpacts } from "./siteIndirectImpacts";
import { getSiteStatuQuoOperatingEconomicBalance } from "./siteOperatingEconomicBalance";

export const computeStatuQuoSiteImpacts = ({
  evaluationPeriodInYears,
  operationsFirstYear,
  site,
  siteSoilsCarbonStorage,
}: {
  evaluationPeriodInYears: number;
  operationsFirstYear: number;
  site: Omit<SiteImpactsDataView, "address">;
  siteSoilsCarbonStorage?: SoilsCarbonStorage;
}): SiteStatuQuoImpacts => {
  const stakeholders = {
    owner: {
      structureType: site.ownerStructureType,
      structureName: site.ownerName,
    },
    operator: site.isSiteOperated
      ? site.tenantStructureType
        ? {
            structureType: site.tenantStructureType,
            structureName: site.tenantName,
          }
        : {
            structureType: site.ownerStructureType,
            structureName: site.ownerName,
          }
      : undefined,
    tenant: {
      structureType: site.tenantStructureType,
      structureName: site.tenantName,
    },
  } as GetSiteImpactsDto["stakeholders"];

  const sumOnEvolutionPeriodService = new SumOnEvolutionPeriodService({
    evaluationPeriodInYears,
    operationsFirstYear,
  });

  const { economicImpacts: indirectEconomicImpacts, impactMetrics } =
    getSiteStatuQuoIndirectsImpacts({
      siteData: { ...site, soilsCarbonStorage: siteSoilsCarbonStorage },
      sumOnEvolutionPeriodService,
    });

  const operatingEconomicBalance = getSiteStatuQuoOperatingEconomicBalance({
    yearlyExpenses: site.yearlyExpenses,
    yearlyIncomes: site.yearlyIncomes,
    sumOnEvolutionPeriodService,
  });

  const shouldCountOperatingEconomicBalance = site.isSiteOperated;

  const economicImpacts = shouldCountOperatingEconomicBalance
    ? {
        details: [...indirectEconomicImpacts.details, ...operatingEconomicBalance.details],
        total: roundToInteger(indirectEconomicImpacts.total + operatingEconomicBalance.total),
      }
    : indirectEconomicImpacts;

  return {
    projectionYears: sumOnEvolutionPeriodService.getProjectionYears(),
    economicImpacts,
    impactMetrics,
    stakeholders,
  };
};
