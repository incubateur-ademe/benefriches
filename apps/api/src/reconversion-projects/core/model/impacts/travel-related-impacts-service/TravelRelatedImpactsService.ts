import {
  AvoidedCO2EqEmissions,
  BuildingsUseDistribution,
  getAnnualizedCO2MonetaryValueForDuration,
  roundTo1Digit,
  roundTo2Digits,
  roundToInteger,
  SocioEconomicImpact,
} from "shared";

import { PartialImpactsServiceInterface } from "../ReconversionProjectImpactsServiceInterface";
import { YearlyTravelRelatedImpacts } from "./YearlyTravelRelatedImpacts";

type Props = {
  siteSquareMetersSurfaceArea: number;
  citySquareMetersSurfaceArea: number;
  cityPopulation: number;
  buildingsFloorAreaDistribution: BuildingsUseDistribution;
  evaluationPeriodInYears: number;
  operationsFirstYear: number;
};

export class TravelRelatedImpactsService
  extends YearlyTravelRelatedImpacts
  implements PartialImpactsServiceInterface
{
  protected readonly evaluationPeriodInYears: number;
  protected readonly operationsFirstYear: number;

  constructor({
    buildingsFloorAreaDistribution,
    siteSquareMetersSurfaceArea,
    citySquareMetersSurfaceArea,
    cityPopulation,
    evaluationPeriodInYears,
    operationsFirstYear,
  }: Props) {
    super({
      buildingsFloorAreaDistribution,
      siteSquareMetersSurfaceArea,
      citySquareMetersSurfaceArea,
      cityPopulation,
    });

    this.evaluationPeriodInYears = evaluationPeriodInYears;
    this.operationsFirstYear = operationsFirstYear;
  }

  getAvoidedPropertyDamageExpenses() {
    return this.avoidedPropertyDamageExpensesPerYear * this.evaluationPeriodInYears;
  }

  getTravelTimeSavedPerTraveler() {
    return this.travelTimeSavedPerTravelerPerYear * this.evaluationPeriodInYears;
  }

  getAvoidedKilometersPerWorkerVehicule() {
    return this.evaluationPeriodInYears * this.avoidedKilometersPerWorkerVehiculePerYear;
  }

  getAvoidedKilometersPerResidentVehicule() {
    return this.evaluationPeriodInYears * this.avoidedKilometersPerResidentVehiculePerYear;
  }

  getAvoidedKilometersPerVehicule() {
    return this.avoidedKilometersPerVehiculePerYear * this.evaluationPeriodInYears;
  }

  getAvoidedCarRelatedExpenses() {
    return this.avoidedKilometersPerVehiculeExpensesPerYear * this.evaluationPeriodInYears;
  }

  getTravelTimeSavedPerTravelerExpenses() {
    return this.travelTimeAvoidedCostsPerTravelerPerYear * this.evaluationPeriodInYears;
  }

  getAvoidedTrafficCO2EmissionsInTons() {
    return (
      ((this.avoidedKilometersPerVehiculePerYear * 157.2) / 1000000) * this.evaluationPeriodInYears
    );
  }

  getAvoidedTrafficCO2EmissionsMonetaryValue() {
    return getAnnualizedCO2MonetaryValueForDuration(
      (this.avoidedKilometersPerVehiculePerYear * 157.2) / 1000000,
      this.operationsFirstYear,
      this.evaluationPeriodInYears,
    );
  }

  getAvoidedAirPollution() {
    return this.avoidedAirPollutionHealthExpensesPerYear * this.evaluationPeriodInYears;
  }

  getAvoidedAccidentsMinorInjuries() {
    return roundToInteger(this.avoidedMinorInjuriesPerYear * this.evaluationPeriodInYears);
  }

  getAvoidedAccidentsSevereInjuries() {
    return roundToInteger(this.avoidedSevereInjuriesPerYear * this.evaluationPeriodInYears);
  }

  getAvoidedAccidentsDeaths() {
    return roundToInteger(this.avoidedDeathsPerYear * this.evaluationPeriodInYears);
  }

  getAvoidedAccidentsInjuriesOrDeaths() {
    return (
      this.getAvoidedAccidentsDeaths() +
      this.getAvoidedAccidentsMinorInjuries() +
      this.getAvoidedAccidentsSevereInjuries()
    );
  }

  getAvoidedAccidentsMinorInjuriesExpenses() {
    if (this.getAvoidedAccidentsMinorInjuries() === 0) {
      return 0;
    }
    return roundToInteger(
      this.avoidedAccidentsMinorInjuriesExpensesPerYear * this.evaluationPeriodInYears,
    );
  }

  getAvoidedAccidentsSevereInjuriesExpenses() {
    if (this.getAvoidedAccidentsSevereInjuries() === 0) {
      return 0;
    }
    return roundToInteger(
      this.avoidedAccidentsSevereInjuriesExpensesPerYear * this.evaluationPeriodInYears,
    );
  }

  getAvoidedAccidentsDeathsExpenses() {
    if (this.getAvoidedAccidentsDeaths() === 0) {
      return 0;
    }
    return roundToInteger(
      this.avoidedAccidentsDeathsExpensesPerYear * this.evaluationPeriodInYears,
    );
  }

  getAvoidedAccidentsInjuriesOrDeathsExpenses() {
    return (
      this.getAvoidedAccidentsDeathsExpenses() +
      this.getAvoidedAccidentsMinorInjuriesExpenses() +
      this.getAvoidedAccidentsSevereInjuriesExpenses()
    );
  }

  getSocioEconomicList() {
    const socioEconomicImpacts = [
      {
        actor: "french_society",
        amount: roundTo2Digits(this.getAvoidedAirPollution()),
        impact: "avoided_air_pollution",
        impactCategory: "social_monetary",
      },
      {
        actor: "local_people",
        amount: roundTo2Digits(this.getAvoidedCarRelatedExpenses()),
        impact: "avoided_car_related_expenses",
        impactCategory: "economic_indirect",
      },
      {
        actor: "french_society",
        amount: roundTo2Digits(this.getAvoidedPropertyDamageExpenses()),
        impact: "avoided_property_damages_expenses",
        impactCategory: "economic_indirect",
      },
      {
        actor: "local_people",
        amount: roundTo2Digits(this.getTravelTimeSavedPerTravelerExpenses()),
        impact: "travel_time_saved",
        impactCategory: "social_monetary",
      },
      {
        actor: "french_society",
        amount: this.getAvoidedAccidentsInjuriesOrDeathsExpenses(),
        impact: "avoided_traffic_accidents",
        impactCategory: "social_monetary",
        details: [
          {
            amount: this.getAvoidedAccidentsMinorInjuriesExpenses(),
            impact: "avoided_traffic_minor_injuries",
          },
          {
            amount: this.getAvoidedAccidentsSevereInjuriesExpenses(),
            impact: "avoided_traffic_severe_injuries",
          },
          {
            amount: this.getAvoidedAccidentsDeathsExpenses(),
            impact: "avoided_traffic_deaths",
          },
        ],
      },
    ];

    return socioEconomicImpacts.filter(({ amount }) => amount > 0) as SocioEconomicImpact[];
  }

  getAvoidedCo2EqEmissionsDetails(): AvoidedCO2EqEmissions["details"] {
    return [
      {
        amount: roundTo2Digits(this.getAvoidedTrafficCO2EmissionsMonetaryValue()),
        impact: "avoided_traffic_co2_eq_emissions",
      },
    ];
  }

  getSocialImpacts() {
    const avoidedTrafficAccidents = {
      total: roundTo1Digit(this.getAvoidedAccidentsInjuriesOrDeaths()),
      minorInjuries: roundTo1Digit(this.getAvoidedAccidentsMinorInjuries()),
      severeInjuries: roundTo1Digit(this.getAvoidedAccidentsSevereInjuries()),
      deaths: roundTo1Digit(this.getAvoidedAccidentsDeaths()),
    };

    return {
      avoidedVehiculeKilometers: roundTo2Digits(this.getAvoidedKilometersPerVehicule()),
      travelTimeSaved: roundTo2Digits(this.getTravelTimeSavedPerTraveler()),
      avoidedTrafficAccidents:
        avoidedTrafficAccidents.total > 0 ? avoidedTrafficAccidents : undefined,
    };
  }

  getEnvironmentalImpacts() {
    const avoidedCarTrafficCo2EqEmissions = roundTo2Digits(
      this.getAvoidedTrafficCO2EmissionsInTons(),
    );
    if (avoidedCarTrafficCo2EqEmissions === 0) {
      return {};
    }
    return {
      avoidedCarTrafficCo2EqEmissions,
    };
  }
}
