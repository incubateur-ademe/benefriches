import {
  DevelopmentPlanFeatures,
  isSameStakeholders,
  isStakeholderLocalAuthority,
  ReconversionProjectImpactsBreakEvenLevel,
  roundToInteger,
  SiteImpactsDataView,
  sumListWithKey,
} from "shared";

import { CityStats } from "src/reconversion-projects/core/gateways/CityStatsProvider";
import { SoilsCarbonStorage } from "src/reconversion-projects/core/gateways/SoilsCarbonStorageService";
import { ApiReconversionProjectImpactsDataView } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";

import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { getProjectDevelopmentEconomicBalance } from "./projectDevelopmentEconomicBalance";
import { getProjectIndirectsEconomicImpacts } from "./projectIndirectEconomicImpacts";
import { getProjectOperatingEconomicBalance } from "./projectOperatingEconomicBalance";

export type ReconversionProjectImpactsWithBreakEvenLevelInput =
  ApiReconversionProjectImpactsDataView & {
    operationsFirstYear: number;
    projectSoilsCarbonStorage?: SoilsCarbonStorage;
  };
type SiteInputData = Omit<SiteImpactsDataView, "address"> & {
  siteSoilsCarbonStorage?: SoilsCarbonStorage;
};

export const computeProjectImpactsWithBreakEvenLevel = ({
  reconversionProject,
  relatedSite,
  cityStats,
  evaluationPeriodInYears,
}: {
  reconversionProject: ReconversionProjectImpactsWithBreakEvenLevelInput;
  relatedSite: SiteInputData;
  cityStats: CityStats;
  evaluationPeriodInYears: number;
}) => {
  const { operationsFirstYear } = reconversionProject;

  // Build stakeholders
  const stakeholders = {
    current: {
      owner: {
        structureType: relatedSite.ownerStructureType,
        structureName: relatedSite.ownerName,
      },
      operator: {
        structureType: relatedSite.ownerStructureType,
        structureName: relatedSite.ownerName,
      },
      tenant: {
        structureType: relatedSite.tenantStructureType,
        structureName: relatedSite.tenantName,
      },
    },
    future: {
      operator: {
        structureType: reconversionProject.futureOperatorStructureType,
        structureName: reconversionProject.futureOperatorName,
      },
      owner: {
        structureType: reconversionProject.futureSiteOwnerStructureType,
        structureName: reconversionProject.futureSiteOwnerName,
      },
    },
    project: {
      developer: {
        structureType: reconversionProject.developmentPlan.developerStructureType,
        structureName: reconversionProject.developmentPlan.developerName,
      },
      reinstatementContractOwner: {
        structureType: reconversionProject.reinstatementContractOwnerStructureType,
        structureName: reconversionProject.reinstatementContractOwnerName,
      },
    },
  } as ReconversionProjectImpactsBreakEvenLevel["stakeholders"];

  const developmentEconomicBalance = getProjectDevelopmentEconomicBalance({
    developmentPlanType: reconversionProject.developmentPlan.type,
    stakeholders,
    costs: {
      reinstatementCosts: reconversionProject.reinstatementExpenses,
      developmentPlanInstallationCosts: reconversionProject.developmentPlan.installationCosts,
      sitePurchaseTotalAmount: reconversionProject.sitePurchaseTotalAmount,
      buildingsConstructionAndRehabilitationCosts:
        reconversionProject.buildingsConstructionAndRehabilitationExpenses,
    },
    revenues: {
      financialAssistanceRevenues: reconversionProject.financialAssistanceRevenues,
      buildingsResaleSellingPrice: reconversionProject.buildingsResaleSellingPrice,
      siteResaleSellingPrice: reconversionProject.siteResaleSellingPrice,
    },
  });

  const sumOnEvolutionPeriodService = new SumOnEvolutionPeriodService({
    evaluationPeriodInYears,
    operationsFirstYear,
  });

  const indirectEconomicImpacts = getProjectIndirectsEconomicImpacts({
    reconversionProject: {
      ...reconversionProject,
      hasSiteOwnerChange: reconversionProject.futureSiteOwnerStructureType !== undefined,
      developmentPlan: {
        type: reconversionProject.developmentPlan.type,
        features: reconversionProject.developmentPlan.features,
      } as DevelopmentPlanFeatures,
      operationsFirstYear,
      soilsCarbonStorage: reconversionProject.projectSoilsCarbonStorage,
    },
    relatedSite: { ...relatedSite, soilsCarbonStorage: relatedSite.siteSoilsCarbonStorage },
    sumOnEvolutionPeriodService,
    siteCityData: {
      cityPropertyValuePerSquareMeter: cityStats.propertyValueMedianPricePerSquareMeters,
      citySquareMetersSurfaceArea: cityStats.surfaceAreaSquareMeters,
      cityPopulation: cityStats.population,
    },
  });

  // Compute operating economic balance
  const operatingEconomicBalance = getProjectOperatingEconomicBalance({
    yearlyProjectedCosts: reconversionProject.yearlyProjectedExpenses,
    yearlyProjectedRevenues: reconversionProject.yearlyProjectedRevenues,
    sumOnEvolutionPeriodService,
  });

  const totalOperatingEconomicBalance = sumListWithKey(operatingEconomicBalance, "total");

  // Compute break even year
  const isFutureOperatorLocalAuthority =
    !!stakeholders.future.operator && isStakeholderLocalAuthority(stakeholders.future.operator);

  const isFutureOperatorSameAsDeveloper =
    !!stakeholders.future.operator &&
    isSameStakeholders(stakeholders.project.developer, stakeholders.future.operator);

  const shouldCountOperatingEconomicBalance =
    isFutureOperatorLocalAuthority || isFutureOperatorSameAsDeveloper;

  const monetaryImpactsList = shouldCountOperatingEconomicBalance
    ? [...indirectEconomicImpacts.details, ...operatingEconomicBalance]
    : indirectEconomicImpacts.details;

  const cumulativeBalanceByYear = monetaryImpactsList
    .reduce<number[]>((total, impact) => {
      impact.cumulativeByYear.forEach((value, index) => {
        total[index] = (total[index] ?? 0) + value;
      });
      return total;
    }, [])
    .map((val) => val + developmentEconomicBalance.total);

  const projectionYears = cumulativeBalanceByYear.map(
    (_, index) => `${operationsFirstYear + index}`,
  );
  const breakEvenIndex = cumulativeBalanceByYear.findIndex(
    (v, i, arr) => v >= 0 && (i === 0 || (arr?.[i - 1] ?? 0) < 0),
  );

  const breakEvenYear = projectionYears[breakEvenIndex];

  // Assign operatingEconomicBalance to economicBalance or indirectEconomicImpacts
  // depending on the future operator type
  const economicBalance =
    isFutureOperatorSameAsDeveloper && !isFutureOperatorLocalAuthority
      ? {
          total: roundToInteger(developmentEconomicBalance.total + totalOperatingEconomicBalance),
          details: [...developmentEconomicBalance.details, ...operatingEconomicBalance],
        }
      : developmentEconomicBalance;

  const indirectImpacts = isFutureOperatorLocalAuthority
    ? {
        total: roundToInteger(indirectEconomicImpacts.total + totalOperatingEconomicBalance),
        details: [...indirectEconomicImpacts.details, ...operatingEconomicBalance],
      }
    : indirectEconomicImpacts;

  return {
    breakEvenYear,
    breakEvenIndex: breakEvenIndex === -1 ? undefined : breakEvenIndex,
    cumulativeBalanceByYear,
    projectionYears,
    economicBalance,
    indirectEconomicImpacts: indirectImpacts,
    operationsFirstYear,
    stakeholders,
  };
};
