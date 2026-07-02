import {
  ReconversionProjectSoilsDistribution,
  RecurringExpense,
  ReinstatementExpense,
} from "../../reconversion-projects";
import { roundToInteger, sumList, sumListWithKey } from "../../services";
import {
  AgriculturalOperationActivity,
  SiteNature,
  SiteYearlyExpense,
  SiteYearlyIncome,
} from "../../site";
import {
  getProjectSoilDistributionByType,
  SoilsCarbonStorage,
  SoilsDistribution,
} from "../../soils";
import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computeCumulativeByYear } from "../../sum-on-evolution-period/computeCumulativeByYear";
import {
  ProjectOnSiteImpactMetric,
  ReconversionProjectOnSiteIndirectEconomicImpact,
} from "../projectImpacts.types";
import { DevelopmentPlanFeatures } from "../projectImpactsDataView.types";
import { Schedule } from "./fullTimeJobs.helper";
import { getPhotovoltaicPowerPlantProjectImpacts } from "./renewable-energy/photovoltaicRelatedImpacts";
import { getReinstatementFullTimeJobs } from "./site-reconversion/siteReconversionRelatedEconomicImpacts";
import { SoilsTransformationImpactsService } from "./soils-tranformation/SoilsTransformationImpactsService";
import { getUrbanProjectImpacts } from "./urban-project/urbanProjectImpacts";

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
  conversionSchedule?: Schedule;
  reinstatementExpenses: ReinstatementExpense[];
  reinstatementSchedule?: Schedule;
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

export const getProjectMetricsAndEconomicImpacts = ({
  reconversionProject,
  relatedSite,
  siteCityData,
  sumOnEvolutionPeriodService,
}: Props) => {
  const soilsDistributionByType = getProjectSoilDistributionByType(
    reconversionProject.soilsDistribution,
  );

  const economicImpacts: ReconversionProjectOnSiteIndirectEconomicImpact[] = [];
  const impactMetrics: ProjectOnSiteImpactMetric[] = [];

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
    economicImpacts.push({
      name: "propertyTransferDutiesIncome",
      total: propertyTransferDutiesIncome,
      detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
    });
  }

  // --- Conservation des sols (commun à tous les types de projet) ---
  const soilTransformationImpatsService = new SoilsTransformationImpactsService({
    projectSoilsDistribution: soilsDistributionByType,
    siteSoilsDistribution: relatedSite.soilsDistribution,
    siteSoilsCarbonStorage: relatedSite.soilsCarbonStorage?.total,
    projectSoilsCarbonStorage: reconversionProject.soilsCarbonStorage?.total,
    projectDecontaminedSurfaceArea: reconversionProject.decontaminatedSoilSurface,
    sumOnEvolutionPeriodService,
  });
  economicImpacts.push(...soilTransformationImpatsService.getEconomicImpacts());
  impactMetrics.push(...soilTransformationImpatsService.getImpactMetrics());

  // -- Revenus liés à la location du site
  const projectedRentCost = reconversionProject.yearlyProjectedExpenses.find(
    ({ purpose }) => purpose === "rent",
  );
  if (projectedRentCost) {
    const projectedDetailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      projectedRentCost.amount,
      ["discount"],
    );
    economicImpacts.push({
      detailsByYear: projectedDetailsByYear,
      cumulativeByYear: computeCumulativeByYear(projectedDetailsByYear),
      total: sumList(projectedDetailsByYear),
      name: "projectedRentalIncome",
    });
  }

  if (reconversionProject.reinstatementSchedule) {
    const reinstatementFullTimeJobs = getReinstatementFullTimeJobs({
      reinstatementExpenses: reconversionProject.reinstatementExpenses,
      evaluationPeriodInYears: sumOnEvolutionPeriodService.evaluationPeriodInYears,
      reinstatementSchedule: reconversionProject.reinstatementSchedule,
    });
    if (reinstatementFullTimeJobs) {
      impactMetrics.push(reinstatementFullTimeJobs);
    }
  }

  // --- Impacts spécifiques au type de projet ---
  if (reconversionProject.developmentPlan.type === "URBAN_PROJECT") {
    const { impactMetrics: indirectImpactsMetrics, economicImpacts: indirectEconomicImpacts } =
      getUrbanProjectImpacts({
        reconversionProject: {
          ...reconversionProject,
          developmentPlan: reconversionProject.developmentPlan,
        },
        relatedSite,
        siteCityData,
        sumOnEvolutionPeriodService,
      });
    impactMetrics.push(...indirectImpactsMetrics);
    economicImpacts.push(...indirectEconomicImpacts);
  }

  if (reconversionProject.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT") {
    const { impactMetrics: indirectImpactsMetrics, economicImpacts: indirectEconomicImpacts } =
      getPhotovoltaicPowerPlantProjectImpacts({
        reconversionProject: {
          ...reconversionProject,
          developmentPlan: reconversionProject.developmentPlan,
        },
        sumOnEvolutionPeriodService,
      });
    impactMetrics.push(...indirectImpactsMetrics);
    economicImpacts.push(...indirectEconomicImpacts);
  }

  return {
    impactMetrics,
    economicImpacts: {
      total: roundToInteger(sumListWithKey(economicImpacts, "total")),
      details: economicImpacts,
    },
  };
};
