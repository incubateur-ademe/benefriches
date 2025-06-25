import {
  computeAgriculturalOperationEtpFromSurface,
  convertCarbonToCO2eq,
  isGreenSoil,
  isMineralSoil,
  isPermeableSoil,
  roundTo2Digits,
  SiteImpactsDataView,
  sumListWithKey,
  sumSoilsSurfaceAreasWhere,
  StatuQuoSiteImpacts,
  SiteFricheCostsImpact,
  SiteTaxesIncomeImpact,
  isPrairie,
  isWetLand,
  isSurfaceWithEcosystemBenefits,
  isPermeableSurfaceWithoutPermanentVegetation,
  isForest,
  isSurfaceWithPermanentVegetation,
} from "shared";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";

import { SoilsCarbonStorage } from "../../gateways/SoilsCarbonStorageService";
import {
  computeForestRelatedProductMonetaryValue,
  computeInvasiveSpeciesRegulationMonetaryValue,
  computeNatureRelatedWellnessAndLeisureMonetaryValue,
  computeNitrogenCycleMonetaryValue,
  computePollinisationMonetaryValue,
  computeSoilErosionMonetaryValue,
  computeWaterCycleMonetaryValue,
  computeWaterRegulationMonetaryValue,
} from "../project-impacts/nature-conservation/natureConservationYearlyMonetaryValue";
import { SumOnEvolutionPeriodService } from "../sum-on-evolution-period/SumOnEvolutionPeriodService";

const RENT_PURPOSE_KEY = "rent";

type SiteData = SiteImpactsDataView & { soilsCarbonStorage?: SoilsCarbonStorage };
type SiteImpactsServiceProps = {
  siteData: SiteData;
  evaluationPeriodInYears: number;
  dateProvider: DateProvider;
};

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

export class SiteStatuQuoImpactsService {
  protected readonly siteData: SiteData;
  protected readonly sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;

  constructor(props: SiteImpactsServiceProps) {
    this.siteData = props.siteData;

    this.sumOnEvolutionPeriodService = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: props.evaluationPeriodInYears,
      operationsFirstYear: props.dateProvider.now().getFullYear(),
    });
  }

  protected get operationBenefits() {
    return (
      sumListWithKey(this.siteData.yearlyIncomes, "amount") -
      sumListWithKey(this.siteData.yearlyExpenses, "amount")
    );
  }

  protected get fullTimeJobsImpact() {
    switch (this.siteData.nature) {
      case "FRICHE":
        return 0;
      case "AGRICULTURAL_OPERATION":
        return this.siteData.agriculturalOperationActivity && this.siteData.isSiteOperated
          ? computeAgriculturalOperationEtpFromSurface({
              surfaceArea: this.siteData.surfaceArea,
              operationActivity: this.siteData.agriculturalOperationActivity,
            })
          : 0;
      case "NATURAL_AREA":
        return 0;
    }
  }

  protected get accidentsImpact() {
    if (this.siteData.nature !== "FRICHE") {
      return undefined;
    }
    const accidents =
      (this.siteData.accidentsDeaths ?? 0) +
      (this.siteData.accidentsSevereInjuries ?? 0) +
      (this.siteData.accidentsMinorInjuries ?? 0);

    if (accidents === 0) {
      return undefined;
    }

    return {
      total: accidents,
      deaths: this.siteData.accidentsDeaths ?? 0,
      severeInjuries: this.siteData.accidentsSevereInjuries ?? 0,
      minorInjuries: this.siteData.accidentsMinorInjuries ?? 0,
    };
  }

  protected get fricheCosts(): SiteFricheCostsImpact[] {
    if (this.siteData.nature !== "FRICHE") {
      return [];
    }

    const currentFricheCosts = this.siteData.yearlyExpenses.filter(({ purpose }) =>
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

    const siteTenantName = this.siteData.tenantName ?? "Ancien locataire du site";

    return Object.entries(groupedByBearer).map(([bearer, costs]) => {
      const details: SiteFricheCostsImpact["details"] = costs.map(({ amount, purpose }) => {
        const totalAmount = -this.sumOnEvolutionPeriodService.sumWithDiscountFactor(amount);
        switch (purpose) {
          case "maintenance":
            return { amount: totalAmount, impact: "site_statu_quo_maintenance_costs" };
          case "security":
            return { amount: totalAmount, impact: "site_statu_quo_security_costs" };
          case "accidentsCost":
            return { amount: totalAmount, impact: "site_statu_quo_accidents_costs" };
          case "illegalDumpingCost":
            return { amount: totalAmount, impact: "site_statu_quo_illegal_dumping_costs" };
          case "otherSecuringCosts":
            return { amount: totalAmount, impact: "site_statu_quo_other_securing_costs" };
        }
      });
      return {
        amount: sumListWithKey(details, "amount"),
        actor: bearer === "owner" ? this.siteData.ownerName : siteTenantName,
        details,
      };
    });
  }

  protected get taxesIncomeImpact(): SiteTaxesIncomeImpact | undefined {
    const taxes = this.siteData.yearlyExpenses.filter(
      ({ purpose }) =>
        purpose === "taxes" || purpose === "operationsTaxes" || purpose === "propertyTaxes",
    );

    if (taxes.length !== 0) {
      return {
        amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
          sumListWithKey(taxes, "amount"),
        ),
        details: taxes.map(({ amount, purpose }) => ({
          amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(amount),
          impact: (() => {
            switch (purpose) {
              case "propertyTaxes":
                return "site_statu_quo_property_taxes";
              case "operationsTaxes":
                return "site_statu_quo_operation_taxes";
              case "taxes":
                return "site_statu_quo_taxes";
            }
          })(),
        })),
      } as SiteTaxesIncomeImpact;
    }

    return undefined;
  }

  protected get rentImpact() {
    const currentRentCost = this.siteData.yearlyExpenses.find(
      ({ purpose }) => purpose === RENT_PURPOSE_KEY,
    );

    if (currentRentCost) {
      return {
        amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactor(currentRentCost.amount),
        actor: this.siteData.ownerName,
      };
    }
    return undefined;
  }

  protected get soilsCo2eqStorage() {
    if (!this.siteData.soilsCarbonStorage) {
      return undefined;
    }
    return roundTo2Digits(convertCarbonToCO2eq(this.siteData.soilsCarbonStorage.total));
  }

  protected get soilsCarbonStorage() {
    if (!this.siteData.soilsCarbonStorage) {
      return undefined;
    }

    return this.siteData.soilsCarbonStorage;
  }

  protected get contaminatedSurfaceArea() {
    if (this.siteData.nature !== "FRICHE") {
      return undefined;
    }
    return this.siteData.contaminatedSoilSurface;
  }

  protected get permeableSurfaceArea() {
    return {
      total: sumSoilsSurfaceAreasWhere(this.siteData.soilsDistribution, isPermeableSoil),
      greenSoil: sumSoilsSurfaceAreasWhere(this.siteData.soilsDistribution, isGreenSoil),
      mineralSoil: sumSoilsSurfaceAreasWhere(this.siteData.soilsDistribution, isMineralSoil),
    };
  }

  protected get waterRegulationMonetaryImpact() {
    if (!this.siteData.contaminatedSoilSurface) {
      return undefined;
    }

    const waterRegulationMonetaryImpact = computeWaterRegulationMonetaryValue({
      decontaminatedSurfaceArea: -this.siteData.contaminatedSoilSurface,
    });

    return this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
      waterRegulationMonetaryImpact,
    );
  }

  protected get ecosystemicServicesImpact() {
    const surfaceWithEcosystemBenefits = sumSoilsSurfaceAreasWhere(
      this.siteData.soilsDistribution,
      isSurfaceWithEcosystemBenefits,
    );
    const prairieSurface = sumSoilsSurfaceAreasWhere(this.siteData.soilsDistribution, isPrairie);
    const forestSurface = sumSoilsSurfaceAreasWhere(this.siteData.soilsDistribution, isForest);
    const wetLandSurface = sumSoilsSurfaceAreasWhere(this.siteData.soilsDistribution, isWetLand);

    return {
      storedCo2Eq: this.soilsCo2eqStorage
        ? this.soilsCo2eqStorage *
          SumOnEvolutionPeriodService.getYearCO2MonetaryValue(
            this.sumOnEvolutionPeriodService.operationsFirstYear,
          )
        : undefined,
      natureRelatedWelnessAndLeisure:
        this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
          computeNatureRelatedWellnessAndLeisureMonetaryValue({
            prairieSurfaceArea: prairieSurface,
            forestSurfaceArea: forestSurface,
            wetLandSurfaceArea: wetLandSurface,
          }),
        ),
      forestRelatedProduct: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
        computeForestRelatedProductMonetaryValue(forestSurface),
      ),
      pollination: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
        computePollinisationMonetaryValue(surfaceWithEcosystemBenefits),
      ),
      invasiveSpeciesRegulation:
        this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
          computeInvasiveSpeciesRegulationMonetaryValue(surfaceWithEcosystemBenefits),
        ),
      waterCycle: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
        computeWaterCycleMonetaryValue(
          sumSoilsSurfaceAreasWhere(
            this.siteData.soilsDistribution,
            isSurfaceWithPermanentVegetation,
          ),
          sumSoilsSurfaceAreasWhere(
            this.siteData.soilsDistribution,
            isPermeableSurfaceWithoutPermanentVegetation,
          ),
        ),
      ),
      nitrogenCycle: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
        computeNitrogenCycleMonetaryValue({
          prairieSurfaceArea: prairieSurface,
          wetLandSurfaceArea: wetLandSurface,
        }),
      ),
      soilErosion: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
        computeSoilErosionMonetaryValue(surfaceWithEcosystemBenefits),
      ),
    };
  }

  formatImpacts(): StatuQuoSiteImpacts {
    return {
      social: {
        fullTimeJobs: this.fullTimeJobsImpact,
        accidents: this.accidentsImpact,
      },
      environmental: {
        contaminatedSurfaceArea: this.contaminatedSurfaceArea,
        permeableSurfaceArea: this.permeableSurfaceArea,
        soilsCo2eqStorage: this.soilsCo2eqStorage,
        soilsCarbonStorage: this.soilsCarbonStorage,
      },
      socioEconomic: {
        direct: {
          rentalIncome: this.rentImpact,
          fricheCosts: this.fricheCosts,
        },
        indirect: {
          taxesIncomes: this.taxesIncomeImpact,
        },
        environmentalMonetary: {
          waterRegulation: this.waterRegulationMonetaryImpact,
          ecosystemServices: this.ecosystemicServicesImpact,
        },
      },
    };
  }
}
