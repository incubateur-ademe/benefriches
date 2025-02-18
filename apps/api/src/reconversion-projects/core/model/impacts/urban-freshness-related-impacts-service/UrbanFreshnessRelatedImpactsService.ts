import {
  AvoidedCO2EqEmissions,
  BuildingsUseDistribution,
  getAnnualizedCO2MonetaryValueForDuration,
  roundTo2Digits,
  SocioEconomicImpact,
  SpacesDistribution,
} from "shared";

import { PartialImpactsServiceInterface } from "../ReconversionProjectImpactsServiceInterface";
import { YearlyUrbanFreshnessRelatedImpacts } from "./YearlyUrbanFreshnessRelatedImpacts";

type Props = {
  siteSquareMetersSurfaceArea: number;
  citySquareMetersSurfaceArea: number;
  cityPopulation: number;
  buildingsFloorAreaDistribution: BuildingsUseDistribution;
  spacesDistribution: SpacesDistribution;
  evaluationPeriodInYears: number;
  operationsFirstYear: number;
};

export class UrbanFreshnessRelatedImpactsService
  extends YearlyUrbanFreshnessRelatedImpacts
  implements PartialImpactsServiceInterface
{
  protected readonly evaluationPeriodInYears: number;
  protected readonly operationsFirstYear: number;

  constructor({
    siteSquareMetersSurfaceArea,
    citySquareMetersSurfaceArea,
    cityPopulation,
    buildingsFloorAreaDistribution,
    spacesDistribution,
    evaluationPeriodInYears,
    operationsFirstYear,
  }: Props) {
    super({
      siteSquareMetersSurfaceArea,
      citySquareMetersSurfaceArea,
      cityPopulation,
      buildingsFloorAreaDistribution,
      spacesDistribution,
    });

    this.evaluationPeriodInYears = evaluationPeriodInYears;
    this.operationsFirstYear = operationsFirstYear;
  }

  getAvoidedInhabitantsAirConditioningExpenses() {
    return this.avoidedInhabitantsAirConditioningExpensesPerYear * this.evaluationPeriodInYears;
  }

  getAvoidedBusinessBuildingsAirConditioningExpenses() {
    return (
      this.avoidedBusinessBuildingsAirConditioningExpensesPerYear * this.evaluationPeriodInYears
    );
  }

  getAvoidedAirConditioningExpenses() {
    return (
      this.getAvoidedInhabitantsAirConditioningExpenses() +
      this.getAvoidedBusinessBuildingsAirConditioningExpenses()
    );
  }

  getHousingAvoidedAirConditioningCo2EmissionsInTons() {
    return (
      this.housingAvoidedAirConditioningCo2EmissionsInTonsPerYear * this.evaluationPeriodInYears
    );
  }

  getBusinessBuildingsAvoidedAirConditioningCo2EmissionsInTons() {
    return (
      this.businessBuildingsAvoidedAirConditioningCo2EmissionsInTonsPerYear *
      this.evaluationPeriodInYears
    );
  }

  getAvoidedAirConditioningCo2EmissionsInTons() {
    return this.avoidedAirConditioningCo2EmissionsInTonsPerYear * this.evaluationPeriodInYears;
  }

  getAvoidedAirConditioningCo2EmissionsMonetaryValue() {
    return getAnnualizedCO2MonetaryValueForDuration(
      this.avoidedAirConditioningCo2EmissionsInTonsPerYear,
      this.operationsFirstYear,
      this.evaluationPeriodInYears,
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
