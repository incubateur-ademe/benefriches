import {
  BuildingsUseDistribution,
  roundTo2Digits,
  SocioEconomicImpact,
  LEGACY_SpacesDistribution,
} from "shared";

import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { YearlyUrbanFreshnessRelatedImpacts } from "./YearlyUrbanFreshnessRelatedImpacts";

type Props = {
  siteSquareMetersSurfaceArea: number;
  citySquareMetersSurfaceArea: number;
  cityPopulation: number;
  buildingsFloorAreaDistribution: BuildingsUseDistribution;
  spacesDistribution: LEGACY_SpacesDistribution;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
};

export class UrbanFreshnessRelatedImpactsService extends YearlyUrbanFreshnessRelatedImpacts {
  protected readonly sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;

  constructor({
    siteSquareMetersSurfaceArea,
    citySquareMetersSurfaceArea,
    cityPopulation,
    buildingsFloorAreaDistribution,
    spacesDistribution,
    sumOnEvolutionPeriodService,
  }: Props) {
    super({
      siteSquareMetersSurfaceArea,
      citySquareMetersSurfaceArea,
      cityPopulation,
      buildingsFloorAreaDistribution,
      spacesDistribution,
    });

    this.sumOnEvolutionPeriodService = sumOnEvolutionPeriodService;
  }

  getAvoidedInhabitantsAirConditioningExpenses() {
    return this.sumOnEvolutionPeriodService.sumWithDiscountFactor(
      this.avoidedInhabitantsAirConditioningExpensesPerYear,
    );
  }

  getAvoidedBusinessBuildingsAirConditioningExpenses() {
    return this.sumOnEvolutionPeriodService.sumWithDiscountFactor(
      this.avoidedBusinessBuildingsAirConditioningExpensesPerYear,
    );
  }

  getAvoidedAirConditioningExpenses() {
    return (
      this.getAvoidedInhabitantsAirConditioningExpenses() +
      this.getAvoidedBusinessBuildingsAirConditioningExpenses()
    );
  }

  getHousingAvoidedAirConditioningCo2EmissionsInTons() {
    return this.sumOnEvolutionPeriodService.sum(
      this.housingAvoidedAirConditioningCo2EmissionsInTonsPerYear,
    );
  }

  getBusinessBuildingsAvoidedAirConditioningCo2EmissionsInTons() {
    return this.sumOnEvolutionPeriodService.sum(
      this.businessBuildingsAvoidedAirConditioningCo2EmissionsInTonsPerYear,
    );
  }

  getAvoidedAirConditioningCo2EmissionsInTons() {
    return this.sumOnEvolutionPeriodService.sum(
      this.avoidedAirConditioningCo2EmissionsInTonsPerYear,
    );
  }

  getAvoidedAirConditioningCo2EmissionsMonetaryValue() {
    return this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndCO2ValueEvolution(
      this.avoidedAirConditioningCo2EmissionsInTonsPerYear,
    );
  }

  getSocioEconomicList(): SocioEconomicImpact[] {
    if (!this.hasUrbanFreshnessImpact) {
      return [];
    }

    const socioeconomic: SocioEconomicImpact[] = [
      {
        actor: "local_people",
        amount: roundTo2Digits(this.getAvoidedInhabitantsAirConditioningExpenses()),
        impact: "avoided_air_conditioning_expenses",
        impactCategory: "economic_indirect",
      },
      {
        actor: "local_companies",
        amount: roundTo2Digits(this.getAvoidedBusinessBuildingsAirConditioningExpenses()),
        impact: "avoided_air_conditioning_expenses",
        impactCategory: "economic_indirect",
      },
    ];

    return socioeconomic.filter(({ amount }) => amount > 0);
  }

  getAvoidedAirConditioningCo2Emissions(): { inTons: number; monetaryValue: number } | undefined {
    if (!this.hasUrbanFreshnessImpact) {
      return undefined;
    }

    return {
      inTons: this.getAvoidedAirConditioningCo2EmissionsInTons(),
      monetaryValue: this.getAvoidedAirConditioningCo2EmissionsMonetaryValue(),
    };
  }
}
