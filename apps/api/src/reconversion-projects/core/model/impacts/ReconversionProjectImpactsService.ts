import {
  AvoidedFricheCostsImpact,
  SocioEconomicImpact,
  sumListWithKey,
  SiteYearlyExpense,
  SoilsDistribution,
  ReinstatementExpense,
  FinancialAssistanceRevenue,
  DevelopmentPlanType,
  RecurringExpense,
  RecurringRevenue,
  DevelopmentPlanInstallationExpenses,
  typedObjectEntries,
  EcosystemServicesImpact,
} from "shared";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";

import { DevelopmentPlan, Schedule } from "../../model/reconversionProject";
import { ImpactsServiceInterface } from "./ReconversionProjectImpactsServiceInterface";
import { SumOnEvolutionPeriodService } from "./SumOnEvolutionPeriodService";
import { computeEconomicBalanceImpact } from "./economic-balance/economicBalanceImpact";
import { FullTimeJobsImpactService } from "./full-time-jobs/fullTimeJobsImpactService";
import { Impact } from "./impact";
import { NatureConservationImpactsService } from "./nature-conservation/NatureConservationImpactsService";
import { getNonContaminatedSurfaceAreaImpact } from "./nature-conservation/nonContaminatedSurfaceImpact";
import { getPermeableSurfaceImpact } from "./nature-conservation/permeableSurfaceAreaImpact";
import { computeSoilsCo2eqStorageImpact } from "./soilsCo2eqStorage/soilsCo2eqStorage";

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

export type InputSiteData = {
  isFriche: boolean;
  yearlyExpenses: SiteYearlyExpense[];
  ownerName: string;
  tenantName?: string;
  addressCityCode: string;
  soilsDistribution: SoilsDistribution;
  surfaceArea: number;
  contaminatedSoilSurface?: number;
  accidentsDeaths?: number;
  accidentsSevereInjuries?: number;
  accidentsMinorInjuries?: number;
  soilsCarbonStorage?: number;
};

export type InputReconversionProjectData = {
  operationsFirstYear?: number;
  developmentPlanDeveloperName?: string;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  reinstatementContractOwnerName?: string;
  reinstatementExpenses: ReinstatementExpense[];
  yearlyProjectedExpenses: RecurringExpense[];
  yearlyProjectedRevenues: RecurringRevenue[];
  sitePurchaseTotalAmount?: number;
  sitePurchasePropertyTransferDutiesAmount?: number;
  siteResaleSellingPrice?: number;
  buildingsResaleSellingPrice?: number;
  financialAssistanceRevenues: FinancialAssistanceRevenue[];
  developmentPlanType: DevelopmentPlanType;
  developmentPlanFeatures?: DevelopmentPlan["features"];
  developmentPlanInstallationExpenses: DevelopmentPlanInstallationExpenses[];
  conversionSchedule?: Schedule;
  reinstatementSchedule?: Schedule;
  soilsDistribution: SoilsDistribution;
  decontaminatedSoilSurface?: number;
  soilsCarbonStorage?: number;
};

export type ReconversionProjectImpactsServiceProps = {
  reconversionProject: InputReconversionProjectData;
  evaluationPeriodInYears: number;
  relatedSite: InputSiteData;
  dateProvider: DateProvider;
};
export class ReconversionProjectImpactsService implements ImpactsServiceInterface {
  protected readonly reconversionProject: InputReconversionProjectData;
  protected readonly relatedSite: InputSiteData;

  protected readonly sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;

  constructor({
    reconversionProject,
    relatedSite,
    evaluationPeriodInYears,
    dateProvider,
  }: ReconversionProjectImpactsServiceProps) {
    this.reconversionProject = reconversionProject;
    this.relatedSite = relatedSite;

    this.sumOnEvolutionPeriodService = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears,
      operationsFirstYear:
        reconversionProject.operationsFirstYear ?? dateProvider.now().getFullYear(),
    });
  }

  protected get economicBalance() {
    return computeEconomicBalanceImpact(
      {
        developmentPlanDeveloperName: this.reconversionProject.developmentPlanDeveloperName,
        futureOperatorName: this.reconversionProject.futureOperatorName,
        futureSiteOwnerName: this.reconversionProject.futureSiteOwnerName,
        reinstatementContractOwnerName: this.reconversionProject.reinstatementContractOwnerName,
        reinstatementCosts: this.reconversionProject.reinstatementExpenses,
        yearlyProjectedCosts: this.reconversionProject.yearlyProjectedExpenses,
        yearlyProjectedRevenues: this.reconversionProject.yearlyProjectedRevenues,
        sitePurchaseTotalAmount: this.reconversionProject.sitePurchaseTotalAmount,
        financialAssistanceRevenues: this.reconversionProject.financialAssistanceRevenues,
        developmentPlanInstallationCosts:
          this.reconversionProject.developmentPlanInstallationExpenses,
        siteResaleSellingPrice: this.reconversionProject.siteResaleSellingPrice,
        buildingsResaleSellingPrice: this.reconversionProject.buildingsResaleSellingPrice,
      },
      this.sumOnEvolutionPeriodService,
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
      reinstatementExpenses: this.reconversionProject.reinstatementExpenses,
      evaluationPeriodInYears: this.sumOnEvolutionPeriodService.evaluationPeriodInYears,
    });

    return fullTimeJobsImpactService.getFullTimeJobsImpacts();
  }

  protected get accidentsImpact() {
    const currentAccidents =
      (this.relatedSite.accidentsDeaths ?? 0) +
      (this.relatedSite.accidentsSevereInjuries ?? 0) +
      (this.relatedSite.accidentsMinorInjuries ?? 0);

    if (currentAccidents === 0) {
      return undefined;
    }

    return {
      ...Impact.get({ base: currentAccidents, forecast: 0 }),
      deaths: Impact.get({ base: this.relatedSite.accidentsDeaths ?? 0, forecast: 0 }),
      severeInjuries: Impact.get({
        base: this.relatedSite.accidentsSevereInjuries ?? 0,
        forecast: 0,
      }),
      minorInjuries: Impact.get({
        base: this.relatedSite.accidentsMinorInjuries ?? 0,
        forecast: 0,
      }),
    };
  }

  protected get avoidedFricheCosts(): AvoidedFricheCostsImpact[] {
    if (!this.relatedSite.isFriche) {
      return [];
    }

    const currentFricheCosts = this.relatedSite.yearlyExpenses.filter(({ purpose }) =>
      FRICHE_COST_PURPOSES.includes(purpose as FricheCostPurpose),
    ) as { purpose: FricheCostPurpose; amount: number; bearer: string }[];
    if (currentFricheCosts.length === 0) {
      return [];
    }

    const groupedByBearer = currentFricheCosts.reduce<
      Record<string, { purpose: FricheCostPurpose; amount: number }[]>
    >((result, currentValue) => {
      (result[currentValue.bearer] = result[currentValue.bearer] ?? []).push(currentValue);
      return result;
    }, {});

    const siteTenantName = this.relatedSite.tenantName ?? "Ancien locataire du site";

    return Object.entries(groupedByBearer).map(([bearer, costs]) => {
      const details: AvoidedFricheCostsImpact["details"] = costs.map(({ amount, purpose }) => {
        const totalAmount = this.sumOnEvolutionPeriodService.sumWithDiscountFactor(amount);
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
      });
      return {
        amount: sumListWithKey(details, "amount"),
        actor: bearer === "owner" ? this.relatedSite.ownerName : siteTenantName,
        impact: "avoided_friche_costs",
        impactCategory: "economic_direct",
        details,
      };
    });
  }

  protected get rentImpacts() {
    const impacts: SocioEconomicImpact[] = [];

    const projectedRentCost = this.reconversionProject.yearlyProjectedExpenses.find(
      ({ purpose }) => purpose === RENT_PURPOSE_KEY,
    );
    const currentRentCost = this.relatedSite.yearlyExpenses.find(
      ({ purpose }) => purpose === RENT_PURPOSE_KEY,
    );
    if (projectedRentCost) {
      if (this.reconversionProject.futureSiteOwnerName) {
        impacts.push({
          amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactor(projectedRentCost.amount),
          actor: this.reconversionProject.futureSiteOwnerName,
          impact: "rental_income",
          impactCategory: "economic_direct",
        });
      }
      if (currentRentCost) {
        impacts.push({
          amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactor(
            projectedRentCost.amount - currentRentCost.amount,
          ),
          actor: this.relatedSite.ownerName,
          impact: "rental_income",
          impactCategory: "economic_direct",
        });
      }
    } else if (currentRentCost) {
      impacts.push({
        amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactor(-currentRentCost.amount),
        actor: this.relatedSite.ownerName,
        impact: "rental_income",
        impactCategory: "economic_direct",
      });
    }
    return impacts;
  }

  protected get propertyTransferDutiesIncome() {
    const impacts: SocioEconomicImpact[] = [];

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

  protected get soilsCo2eqStorage() {
    return computeSoilsCo2eqStorageImpact(
      this.relatedSite.soilsCarbonStorage,
      this.reconversionProject.soilsCarbonStorage,
    );
  }

  protected get nonContaminatedSurfaceArea() {
    return getNonContaminatedSurfaceAreaImpact({
      siteTotalSurfaceArea: this.relatedSite.surfaceArea,
      contaminatedSurface: this.relatedSite.contaminatedSoilSurface,
      decontaminatedSurface: this.reconversionProject.decontaminatedSoilSurface,
    });
  }

  protected get permeableSurfaceArea() {
    return getPermeableSurfaceImpact(
      this.relatedSite.soilsDistribution,
      this.reconversionProject.soilsDistribution,
    );
  }

  protected get natureConservationSocioEconomicImpacts() {
    const socioEconomicList: SocioEconomicImpact[] = [];

    const natureConservationImpactsService = new NatureConservationImpactsService({
      baseSoilsDistribution: this.relatedSite.soilsDistribution,
      forecastSoilsDistribution: this.reconversionProject.soilsDistribution,
      baseDecontaminatedSurfaceArea: 0,
      forecastDecontaminedSurfaceArea: this.reconversionProject.decontaminatedSoilSurface,
      baseSoilsCo2eqStorage: this.soilsCo2eqStorage?.base,
      forecastSoilsCo2eqStorage: this.soilsCo2eqStorage?.forecast,
      sumOnEvolutionPeriodService: this.sumOnEvolutionPeriodService,
    });
    const waterRegulationMonetaryImpact =
      natureConservationImpactsService.getWaterRegulationMonetaryImpact();

    if (waterRegulationMonetaryImpact.difference) {
      socioEconomicList.push({
        impact: "water_regulation",
        impactCategory: "environmental_monetary",
        actor: "community",
        amount: waterRegulationMonetaryImpact.difference,
      });
    }

    const ecosystemServicesMonetaryImpact =
      natureConservationImpactsService.getEcosystemServicesMonetaryImpact();

    const ecosystemServicesList: EcosystemServicesImpact["details"] = typedObjectEntries(
      ecosystemServicesMonetaryImpact,
    ).reduce<EcosystemServicesImpact["details"]>((impactList, [key, value]) => {
      if (!value || value.difference === 0) {
        return impactList;
      }
      const impact = (() => {
        switch (key) {
          case "storedCo2Eq":
            return "soils_co2_eq_storage";
          case "forestRelatedProduct":
            return "forest_related_product";
          case "invasiveSpeciesRegulation":
            return "invasive_species_regulation";
          case "natureRelatedWelnessAndLeisure":
            return "nature_related_wellness_and_leisure";
          case "nitrogenCycle":
            return "nitrogen_cycle";
          case "pollination":
            return "pollination";
          case "soilErosion":
            return "soil_erosion";
          case "waterCycle":
            return "water_cycle";
        }
      })();
      return [...impactList, { amount: value.difference, impact }];
    }, []);

    if (ecosystemServicesList.length > 0) {
      socioEconomicList.push({
        impact: "ecosystem_services",
        impactCategory: "environmental_monetary",
        actor: "human_society",
        amount: sumListWithKey(ecosystemServicesList, "amount"),
        details: ecosystemServicesList,
      });
    }
    return socioEconomicList;
  }

  formatImpacts() {
    const socioEconomicList: SocioEconomicImpact[] = [
      ...this.rentImpacts,
      ...this.avoidedFricheCosts,
      ...this.propertyTransferDutiesIncome,
      ...this.natureConservationSocioEconomicImpacts,
    ];

    return {
      economicBalance: this.economicBalance,
      social: {
        fullTimeJobs: this.fullTimeJobsImpact,
        accidents: this.accidentsImpact,
      },
      environmental: {
        nonContaminatedSurfaceArea: this.nonContaminatedSurfaceArea,
        permeableSurfaceArea: this.permeableSurfaceArea,
        soilsCo2eqStorage: this.soilsCo2eqStorage,
      },
      socioeconomic: {
        impacts: socioEconomicList,
        total: sumListWithKey(socioEconomicList, "amount"),
      },
    };
  }
}
