import {
  SiteYearlyExpense,
  SoilsDistribution,
  AgriculturalOperationActivity,
  SiteYearlyIncome,
  ReconversionProjectSoilsDistribution,
  getProjectSoilDistributionByType,
  SiteNature,
  sumListWithKey,
  RecurringExpense,
  DevelopmentPlanFeatures,
  IndirectEconomicImpact,
  roundToInteger,
  sumList,
} from "shared";

import { SoilsCarbonStorage } from "../../../gateways/SoilsCarbonStorageService";
import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { getNatureConservationRelatedImpacts } from "./indirect-economic-impacts/natureConservationRelatedImpacts";
import { getPhotovoltaicPowerPlantProjectImpacts } from "./indirect-economic-impacts/photovoltaicRelatedImpacts";
import { computeRentalIncomeImpacts } from "./indirect-economic-impacts/rentalIncomeImpacts";
import {
  getAvoidedFricheMaintenanceAndSecuringCosts,
  getPreviousSiteOperationBenefitLoss,
} from "./indirect-economic-impacts/siteReconversionRelatedEconomicImpacts";
import { getUrbanProjectImpacts } from "./indirect-economic-impacts/urbanProjectImpacts";

export type InputSiteData = {
  nature: SiteNature;
  agriculturalOperationActivity?: AgriculturalOperationActivity;
  isSiteOperated?: boolean;
  yearlyExpenses: SiteYearlyExpense[];
  yearlyIncomes: SiteYearlyIncome[];
  ownerName: string;
  tenantName?: string;
  soilsDistribution: SoilsDistribution;
  soilsCarbonStorage?: SoilsCarbonStorage;
  surfaceArea: number;
};

export type InputReconversionProjectData = {
  operationsFirstYear: number;
  sitePurchasePropertyTransferDutiesAmount?: number;
  siteResaleExpectedPropertyTransferDutiesAmount?: number;
  buildingsResaleExpectedPropertyTransferDutiesAmount?: number;
  soilsDistribution: ReconversionProjectSoilsDistribution;
  decontaminatedSoilSurface?: number;
  soilsCarbonStorage?: SoilsCarbonStorage;
  developmentPlan: DevelopmentPlanFeatures;
  yearlyProjectedExpenses: RecurringExpense[];
  hasSiteOwnerChange: boolean;
};

type Props = {
  reconversionProject: InputReconversionProjectData;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
  relatedSite: InputSiteData;
  siteCityData: {
    citySquareMetersSurfaceArea: number;
    cityPopulation: number;
    cityPropertyValuePerSquareMeter: number;
  };
};

export const computeCumulativeByYear = (impacts: number[]): number[] =>
  impacts.reduce<number[]>((acc, value) => {
    acc.push((acc.at(-1) ?? 0) + value);
    return acc;
  }, []);

export const getProjectIndirectsEconomicImpacts = ({
  reconversionProject,
  relatedSite,
  siteCityData,
  sumOnEvolutionPeriodService,
}: Props) => {
  const soilsDistributionByType = getProjectSoilDistributionByType(
    reconversionProject.soilsDistribution,
  );

  const impacts: IndirectEconomicImpact[] = [];

  // --- Impacts liés à la nature du site existant ---
  if (relatedSite.nature === "FRICHE") {
    impacts.push(
      ...getAvoidedFricheMaintenanceAndSecuringCosts({
        yearlyExpenses: relatedSite.yearlyExpenses,
        sumOnEvolutionPeriodService,
      }),
    );
  } else if (relatedSite.isSiteOperated && relatedSite.nature === "AGRICULTURAL_OPERATION") {
    impacts.push(
      getPreviousSiteOperationBenefitLoss({
        previousYearlyExpenses: relatedSite.yearlyExpenses,
        previousYearlyIncomes: relatedSite.yearlyIncomes,
        sumOnEvolutionPeriodService,
      }),
    );
  }

  const propertyTransferDutiesIncome = sumList([
    reconversionProject.sitePurchasePropertyTransferDutiesAmount ?? 0,
    reconversionProject.siteResaleExpectedPropertyTransferDutiesAmount ?? 0,
    reconversionProject.buildingsResaleExpectedPropertyTransferDutiesAmount ?? 0,
  ]);
  // --- Droits de mutation liés à l'achat et la revente du foncier (année 0 uniquement) ---
  if (propertyTransferDutiesIncome && propertyTransferDutiesIncome > 0) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      propertyTransferDutiesIncome,
      [],
      { endYearIndex: 1 },
    );
    impacts.push({
      name: "propertyTransferDutiesIncome",
      total: propertyTransferDutiesIncome,
      detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
    });
  }

  // --- Conservation des sols (commun à tous les types de projet) ---
  impacts.push(
    ...getNatureConservationRelatedImpacts({
      projectSoilsDistributionByType: soilsDistributionByType,
      siteSoilsDistribution: relatedSite.soilsDistribution,
      baseSoilsCarbonStorage: relatedSite.soilsCarbonStorage,
      projectSoilsCarbonStorage: reconversionProject.soilsCarbonStorage,
      projectDecontaminatedSoilSurface: reconversionProject.decontaminatedSoilSurface,
      sumOnEvolutionPeriodService,
    }),
  );

  // -- Revenus liés à la location du site
  impacts.push(
    ...computeRentalIncomeImpacts({
      yearlyProjectedExpenses: reconversionProject.yearlyProjectedExpenses,
      currentYearlyExpenses: relatedSite.yearlyExpenses,
      hasSiteOwnerChange: reconversionProject.hasSiteOwnerChange,
      sumOnEvolutionPeriodService,
    }),
  );

  // --- Impacts spécifiques au type de projet ---
  if (reconversionProject.developmentPlan.type === "URBAN_PROJECT") {
    impacts.push(
      ...getUrbanProjectImpacts({
        reconversionProject: {
          ...reconversionProject,
          developmentPlan: reconversionProject.developmentPlan,
        },
        relatedSite,
        siteCityData,
        sumOnEvolutionPeriodService,
      }),
    );
  }

  if (reconversionProject.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT") {
    impacts.push(
      ...getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...reconversionProject,
          developmentPlan: reconversionProject.developmentPlan,
        },
        sumOnEvolutionPeriodService,
      }),
    );
  }

  return { total: roundToInteger(sumListWithKey(impacts, "total")), details: impacts };
};
