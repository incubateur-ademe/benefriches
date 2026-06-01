import {
  GetSiteImpactsDto,
  isStakeholderLocalAuthority,
  roundToInteger,
  SiteImpactsDataView,
} from "shared";

import { SoilsCarbonStorage } from "src/reconversion-projects/core/gateways/SoilsCarbonStorageService";
import { SumOnEvolutionPeriodService } from "src/reconversion-projects/core/model/sum-on-evolution-period/SumOnEvolutionPeriodService";

import { getSiteStatuQuoIndirectsEconomicImpacts } from "./siteIndirectEconomicImpacts";
import { getSiteStatuQuoOperatingEconomicBalance } from "./siteOperatingEconomicBalance";

export const computeStatuQuoSiteImpacts = ({
  evaluationPeriodInYears,
  operationsFirstYear,
  site,
  siteSoilsCarbonStorage,
}: {
  evaluationPeriodInYears: number;
  operationsFirstYear: number;
  site: SiteImpactsDataView;
  siteSoilsCarbonStorage?: SoilsCarbonStorage;
}) => {
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

  const indirectEconomicImpacts: GetSiteImpactsDto["indirectEconomicImpacts"] =
    getSiteStatuQuoIndirectsEconomicImpacts({
      siteData: { ...site, soilsCarbonStorage: siteSoilsCarbonStorage },
      sumOnEvolutionPeriodService,
    });

  const operatingEconomicBalance = getSiteStatuQuoOperatingEconomicBalance({
    yearlyExpenses: site.yearlyExpenses,
    yearlyIncomes: site.yearlyIncomes,
    sumOnEvolutionPeriodService,
  });

  const isOperatorLocalAuthority =
    !!stakeholders.operator && isStakeholderLocalAuthority(stakeholders.operator);

  const shouldCountOperatingEconomicBalance = isOperatorLocalAuthority;

  const monetaryImpactsList = shouldCountOperatingEconomicBalance
    ? [...indirectEconomicImpacts.details, ...operatingEconomicBalance.details]
    : indirectEconomicImpacts.details;

  const cumulativeBalanceByYear = monetaryImpactsList.reduce<number[]>((total, impact) => {
    impact.cumulativeByYear.forEach((value, index) => {
      total[index] = (total[index] ?? 0) + value;
    });
    return total;
  }, []);

  const projectionYears = cumulativeBalanceByYear.map(
    (_, index) => `${operationsFirstYear + index}`,
  );

  const indirectImpacts = isOperatorLocalAuthority
    ? {
        total: roundToInteger(indirectEconomicImpacts.total + operatingEconomicBalance.total),
        details: [...indirectEconomicImpacts.details, ...operatingEconomicBalance.details],
      }
    : indirectEconomicImpacts;

  return {
    cumulativeBalanceByYear,
    projectionYears,
    operatingEconomicBalance,
    indirectEconomicImpacts: indirectImpacts,
    operationsFirstYear,
    stakeholders,
  };
};
