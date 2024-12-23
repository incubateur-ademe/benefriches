import {
  AccidentsImpactResult,
  AvoidedFricheCostsImpact,
  SocioEconomicImpact,
  sumListWithKey,
  soilsDistributionObjToArray,
  SoilType,
} from "shared";

import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";

import { DevelopmentPlan } from "../../model/reconversionProject";
import {
  ReconversionProjectImpactsDataView,
  SiteImpactsDataView,
} from "../../usecases/computeReconversionProjectImpacts.usecase";
import { ImpactsServiceInterface } from "./ReconversionProjectImpactsServiceInterface";
import { computeEconomicBalanceImpact } from "./economic-balance/economicBalanceImpact";
import {
  EnvironmentalSoilsRelatedImpactsService,
  SoilsCarbonStorage,
} from "./environmental-soils-related/EnvironmentalSoilsRelatedImpactsService";
import { FullTimeJobsImpactService } from "./full-time-jobs/fullTimeJobsImpactService";

const FRICHE_COST_PURPOSES = [
  "security",
  "illegalDumpingCost",
  "accidentsCost",
  "otherSecuringCosts",
  "maintenance",
] as const;

type FricheCostPurpose =
  | "security"
  | "illegalDumpingCost"
  | "accidentsCost"
  | "otherSecuringCosts"
  | "maintenance";

const RENT_PURPOSE_KEY = "rent";
const TAXES_PURPOSE_KEY = "taxes";

type SoilsCarbonStorageResult = {
  totalCarbonStorage: number;
  soilsCarbonStorage: {
    surfaceArea: number;
    carbonStorage: number;
    carbonStorageInTonPerSquareMeters: number;
    type: SoilType;
  }[];
};

export interface GetSoilsCarbonStoragePerSoilsService {
  execute(input: {
    cityCode: string;
    soils: {
      surfaceArea: number;
      type: SoilType;
    }[];
  }): Promise<SoilsCarbonStorageResult>;
}

export type ReconversionProjectImpactsServiceProps = {
  reconversionProject: ReconversionProjectImpactsDataView;
  evaluationPeriodInYears: number;
  relatedSite: SiteImpactsDataView;
  dateProvider: IDateProvider;
  getSoilsCarbonStorageService: GetSoilsCarbonStoragePerSoilsService;
};
export class ReconversionProjectImpactsService implements ImpactsServiceInterface {
  protected readonly evaluationPeriodInYears: number;
  protected readonly operationsFirstYear: number;
  protected readonly reconversionProject: ReconversionProjectImpactsDataView;
  protected readonly relatedSite: SiteImpactsDataView;

  protected readonly getSoilsCarbonStorageService: GetSoilsCarbonStoragePerSoilsService;

  constructor({
    reconversionProject,
    relatedSite,
    evaluationPeriodInYears,
    dateProvider,
    getSoilsCarbonStorageService,
  }: ReconversionProjectImpactsServiceProps) {
    this.reconversionProject = reconversionProject;
    this.relatedSite = relatedSite;
    this.evaluationPeriodInYears = evaluationPeriodInYears;
    this.operationsFirstYear =
      this.reconversionProject.operationsFirstYear ?? dateProvider.now().getFullYear();

    this.getSoilsCarbonStorageService = getSoilsCarbonStorageService;
  }

  protected get economicBalance() {
    return computeEconomicBalanceImpact(
      {
        developmentPlanDeveloperName: this.reconversionProject.developmentPlanDeveloperName,
        futureOperatorName: this.reconversionProject.futureOperatorName,
        futureSiteOwnerName: this.reconversionProject.futureSiteOwnerName,
        reinstatementContractOwnerName: this.reconversionProject.reinstatementContractOwnerName,
        reinstatementCosts: this.reconversionProject.reinstatementCosts,
        yearlyProjectedCosts: this.reconversionProject.yearlyProjectedCosts,
        yearlyProjectedRevenues: this.reconversionProject.yearlyProjectedRevenues,
        sitePurchaseTotalAmount: this.reconversionProject.sitePurchaseTotalAmount,
        financialAssistanceRevenues: this.reconversionProject.financialAssistanceRevenues,
        developmentPlanInstallationCosts: this.reconversionProject.developmentPlanInstallationCosts,
        siteResaleTotalAmount: this.reconversionProject.siteResaleTotalAmount,
      },
      this.evaluationPeriodInYears,
    );
  }

  protected get fullTimeJobsImpact() {
    const fullTimeJobsImpactService = new FullTimeJobsImpactService({
      developmentPlan: {
        type: this.reconversionProject.developmentPlanType,
        features: this.reconversionProject.developmentPlanFeatures,
      } as DevelopmentPlan,
      conversionSchedule: this.reconversionProject.conversionSchedule,
      reinstatementSchedule: this.reconversionProject.reinstatementSchedule,
      reinstatementExpenses: this.reconversionProject.reinstatementCosts,
      evaluationPeriodInYears: this.evaluationPeriodInYears,
    });

    return fullTimeJobsImpactService.formatImpacts().fullTimeJobs;
  }

  protected get accidentsImpact() {
    const currentAccidents =
      (this.relatedSite.accidentsDeaths ?? 0) +
      (this.relatedSite.accidentsSevereInjuries ?? 0) +
      (this.relatedSite.accidentsMinorInjuries ?? 0);

    return {
      current: currentAccidents,
      forecast: 0,
      deaths: {
        current: this.relatedSite.accidentsDeaths ?? 0,
        forecast: 0,
      },
      severeInjuries: {
        current: this.relatedSite.accidentsSevereInjuries ?? 0,
        forecast: 0,
      },
      minorInjuries: {
        current: this.relatedSite.accidentsMinorInjuries ?? 0,
        forecast: 0,
      },
    };
  }

  protected get avoidedFricheCosts(): AvoidedFricheCostsImpact[] {
    if (!this.relatedSite.isFriche) {
      return [];
    }

    const currentFricheCosts = this.relatedSite.yearlyCosts.filter(({ purpose }) =>
      FRICHE_COST_PURPOSES.includes(purpose as (typeof FRICHE_COST_PURPOSES)[number]),
    ) as { purpose: FricheCostPurpose; amount: number }[];

    if (currentFricheCosts.length === 0) {
      return [];
    }

    const fricheCostImpactAmount = sumListWithKey(currentFricheCosts, "amount");
    return [
      {
        amount: fricheCostImpactAmount * this.evaluationPeriodInYears,
        actor: this.relatedSite.tenantName ?? this.relatedSite.ownerName,
        impact: "avoided_friche_costs",
        impactCategory: "economic_direct",
        details: currentFricheCosts.map(({ amount, purpose }) => {
          const totalAmount = amount * this.evaluationPeriodInYears;
          switch (purpose) {
            case "maintenance":
              return { amount: totalAmount, impact: "avoided_maintenance_costs" };
            case "security":
              return { amount: totalAmount, impact: "avoided_security_costs" };
            case "accidentsCost":
              return { amount: totalAmount, impact: "avoided_accidents_costs" };
            case "illegalDumpingCost":
              return { amount: totalAmount, impact: "avoided_illegal_dumping_costs" };
            case "otherSecuringCosts":
              return { amount: totalAmount, impact: "avoided_other_securing_costs" };
          }
        }),
      },
    ];
  }

  protected get rentImpacts() {
    const impacts: SocioEconomicImpact[] = [];

    const projectedRentCost = this.reconversionProject.yearlyProjectedCosts.find(
      ({ purpose }) => purpose === RENT_PURPOSE_KEY,
    );
    const currentRentCost = this.relatedSite.yearlyCosts.find(
      ({ purpose }) => purpose === RENT_PURPOSE_KEY,
    );
    if (projectedRentCost) {
      if (this.reconversionProject.futureSiteOwnerName) {
        impacts.push({
          amount: projectedRentCost.amount * this.evaluationPeriodInYears,
          actor: this.reconversionProject.futureSiteOwnerName,
          impact: "rental_income",
          impactCategory: "economic_direct",
        });
      }
      if (currentRentCost) {
        impacts.push({
          amount:
            (projectedRentCost.amount - currentRentCost.amount) * this.evaluationPeriodInYears,
          actor: this.relatedSite.ownerName,
          impact: "rental_income",
          impactCategory: "economic_direct",
        });
      }
    } else if (currentRentCost) {
      impacts.push({
        amount: -currentRentCost.amount * this.evaluationPeriodInYears,
        actor: this.relatedSite.ownerName,
        impact: "rental_income",
        impactCategory: "economic_direct",
      });
    }
    return impacts;
  }

  protected get taxesImpacts() {
    const impacts: SocioEconomicImpact[] = [];

    const currentTaxesAmount =
      this.relatedSite.yearlyCosts.find(({ purpose }) => purpose === TAXES_PURPOSE_KEY)?.amount ??
      0;
    const projectedTaxesAmount =
      this.reconversionProject.yearlyProjectedCosts.find(
        ({ purpose }) => purpose === TAXES_PURPOSE_KEY,
      )?.amount ?? 0;
    if (currentTaxesAmount || projectedTaxesAmount) {
      impacts.push({
        amount: (projectedTaxesAmount - currentTaxesAmount) * this.evaluationPeriodInYears,
        impact: "taxes_income",
        impactCategory: "economic_indirect",
        actor: "community",
      });
    }

    if (this.reconversionProject.sitePurchasePropertyTransferDutiesAmount) {
      impacts.push({
        amount: this.reconversionProject.sitePurchasePropertyTransferDutiesAmount,
        impact: "property_transfer_duties_income",
        actor: "community",
        impactCategory: "economic_direct",
      });
    }
    return impacts;
  }

  async formatImpacts() {
    const {
      socioEconomicList: soilsRelatedSocioEconomicImpacts,
      environmental: soilsRelatedEnvironmentalImpacts,
    } = await this.getEnvironmentalSoilsRelatedImpacts();
    const impacts = [
      ...this.rentImpacts,
      ...this.avoidedFricheCosts,
      ...this.taxesImpacts,
      ...soilsRelatedSocioEconomicImpacts,
    ];
    return {
      economicBalance: this.economicBalance,
      social: {
        fullTimeJobs: this.fullTimeJobsImpact,
        accidents: this.accidentsImpact as AccidentsImpactResult,
      },
      environmental: soilsRelatedEnvironmentalImpacts,
      socioeconomic: { impacts, total: sumListWithKey(impacts, "amount") },
    };
  }

  protected async getEnvironmentalSoilsRelatedImpacts() {
    let baseSoilsCarbonStorage: SoilsCarbonStorage | undefined = undefined;
    let forecastSoilsCarbonStorage: SoilsCarbonStorage | undefined = undefined;
    try {
      baseSoilsCarbonStorage = await this.getSoilsCarbonStorageService.execute({
        cityCode: this.relatedSite.addressCityCode,
        soils: soilsDistributionObjToArray(this.relatedSite.soilsDistribution),
      });
      forecastSoilsCarbonStorage = await this.getSoilsCarbonStorageService.execute({
        cityCode: this.relatedSite.addressCityCode,
        soils: soilsDistributionObjToArray(this.reconversionProject.soilsDistribution),
      });
    } catch (err) {
      console.error("Failed to compute soils carbon storage impact", err);
    }

    const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
      siteTotalSurfaceArea: this.relatedSite.surfaceArea,
      baseSoilsDistribution: this.relatedSite.soilsDistribution,
      forecastSoilsDistribution: this.reconversionProject.soilsDistribution,
      siteContaminatedSurfaceArea: this.relatedSite.contaminatedSoilSurface,
      projectDecontaminedSurfaceArea: this.reconversionProject.decontaminatedSoilSurface,
      baseSoilsCarbonStorage,
      forecastSoilsCarbonStorage,
      evaluationPeriodInYears: this.evaluationPeriodInYears,
      operationsFirstYear: this.operationsFirstYear,
    });
    return environmentalSoilsRelatedImpactService.formatImpacts();
  }
}
