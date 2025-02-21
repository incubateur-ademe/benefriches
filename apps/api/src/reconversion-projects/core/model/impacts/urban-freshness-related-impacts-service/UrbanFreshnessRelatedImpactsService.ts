import {
  AvoidedCO2EqEmissions,
  BuildingsUseDistribution,
  roundTo2Digits,
  SocioEconomicImpact,
  SpacesDistribution,
} from "shared";

import { PartialImpactsServiceInterface } from "../ReconversionProjectImpactsServiceInterface";
import { SumOnEvolutionPeriodService } from "../SumOnEvolutionPeriodService";
import { YearlyUrbanFreshnessRelatedImpacts } from "./YearlyUrbanFreshnessRelatedImpacts";

type Props = {
  siteSquareMetersSurfaceArea: number;
  citySquareMetersSurfaceArea: number;
  cityPopulation: number;
  buildingsFloorAreaDistribution: BuildingsUseDistribution;
  spacesDistribution: SpacesDistribution;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
};

export class UrbanFreshnessRelatedImpactsService
  extends YearlyUrbanFreshnessRelatedImpacts
  implements PartialImpactsServiceInterface
{
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

  getAvoidedCo2EqEmissionsDetails(): AvoidedCO2EqEmissions["details"] {
    if (!this.hasUrbanFreshnessImpact) {
      return [];
    }

    return [
      {
        impact: "avoided_air_conditioning_co2_eq_emissions",
        amount: roundTo2Digits(this.getAvoidedAirConditioningCo2EmissionsMonetaryValue()),
      },
    ];
  }
  getEnvironmentalImpacts() {
    if (!this.hasUrbanFreshnessImpact) {
      return {};
    }

    return {
      avoidedAirConditioningCo2EqEmissions: roundTo2Digits(
        this.getAvoidedAirConditioningCo2EmissionsInTons(),
      ),
    };
  }
}
