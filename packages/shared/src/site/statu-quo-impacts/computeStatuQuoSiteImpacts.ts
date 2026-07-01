import { GetSiteImpactsDto } from "../../api-dtos";
import { SiteImpactsDataView } from "../../reconversion-project-impacts";
import { roundToInteger } from "../../services";
import { SoilsCarbonStorage } from "../../soils";
import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { SiteStatuQuoImpacts } from "./impacts.types";
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
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
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
