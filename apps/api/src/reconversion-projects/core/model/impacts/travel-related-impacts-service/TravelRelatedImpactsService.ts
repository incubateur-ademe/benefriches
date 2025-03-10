import {
  BuildingsUseDistribution,
  roundTo2Digits,
  roundToInteger,
  SocioEconomicImpact,
} from "shared";

import { SumOnEvolutionPeriodService } from "../SumOnEvolutionPeriodService";
import { YearlyTravelRelatedImpacts } from "./YearlyTravelRelatedImpacts";

type Props = {
  siteSquareMetersSurfaceArea: number;
  citySquareMetersSurfaceArea: number;
  cityPopulation: number;
  buildingsFloorAreaDistribution: BuildingsUseDistribution;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
};

export class TravelRelatedImpactsService extends YearlyTravelRelatedImpacts {
  protected readonly sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;

  constructor({
    buildingsFloorAreaDistribution,
    siteSquareMetersSurfaceArea,
    citySquareMetersSurfaceArea,
    cityPopulation,
    sumOnEvolutionPeriodService,
  }: Props) {
    super({
      buildingsFloorAreaDistribution,
      siteSquareMetersSurfaceArea,
      citySquareMetersSurfaceArea,
      cityPopulation,
    });

    this.sumOnEvolutionPeriodService = sumOnEvolutionPeriodService;
  }

  getAvoidedPropertyDamageExpenses() {
    return this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
      this.avoidedPropertyDamageExpensesPerYear,
    );
  }

  getTravelTimeSavedPerTraveler() {
    return this.sumOnEvolutionPeriodService.sum(this.travelTimeSavedPerTravelerPerYear);
  }

  getAvoidedKilometersPerWorkerVehicule() {
    return this.sumOnEvolutionPeriodService.sum(this.avoidedKilometersPerWorkerVehiculePerYear);
  }

  getAvoidedKilometersPerResidentVehicule() {
    return this.sumOnEvolutionPeriodService.sum(this.avoidedKilometersPerResidentVehiculePerYear);
  }

  getAvoidedKilometersPerVehicule() {
    return this.sumOnEvolutionPeriodService.sum(this.avoidedKilometersPerVehiculePerYear);
  }

  getAvoidedCarRelatedExpenses() {
    return this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
      this.avoidedKilometersPerVehiculeExpensesPerYear,
    );
  }

  getTravelTimeSavedPerTravelerExpenses() {
    return this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
      this.travelTimeAvoidedCostsPerTravelerPerYear,
    );
  }

  getAvoidedTrafficCO2EmissionsInTons() {
    return roundTo2Digits(
      this.sumOnEvolutionPeriodService.sumWithCO2EqEmittedPerVehiculeKilometerEvolution(
        this.avoidedKilometersPerVehiculePerYear,
      ) / 1000000,
    );
  }

  getAvoidedTrafficCO2EmissionsMonetaryValue() {
    return this.sumOnEvolutionPeriodService.sumWithCustomFn(
      this.avoidedKilometersPerVehiculePerYear,
      (value, yearIndex, { operationsFirstYear }) => {
        const year = operationsFirstYear + yearIndex;
        const avoidedCo2EqForYearInGrams =
          value * SumOnEvolutionPeriodService.getYearCO2EqEmittedPerVehiculeKilometerValue(year);
        return (
          (avoidedCo2EqForYearInGrams / 1000000) *
          SumOnEvolutionPeriodService.getYearCO2MonetaryValue(year) *
          SumOnEvolutionPeriodService.getDiscountFactor(yearIndex)
        );
      },
    );
  }

  getAvoidedAirPollution() {
    return this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
      this.avoidedAirPollutionHealthExpensesPerYear,
    );
  }

  getAvoidedAccidentsMinorInjuries() {
    return this.sumOnEvolutionPeriodService.sum(this.avoidedMinorInjuriesPerYear, {
      roundFn: roundToInteger,
    });
  }

  getAvoidedAccidentsSevereInjuries() {
    return this.sumOnEvolutionPeriodService.sum(this.avoidedSevereInjuriesPerYear, {
      roundFn: roundToInteger,
    });
  }

  getAvoidedAccidentsDeaths() {
    return this.sumOnEvolutionPeriodService.sum(this.avoidedDeathsPerYear, {
      roundFn: roundToInteger,
    });
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
    return this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
      this.avoidedAccidentsMinorInjuriesExpensesPerYear,
    );
  }

  getAvoidedAccidentsSevereInjuriesExpenses() {
    if (this.getAvoidedAccidentsSevereInjuries() === 0) {
      return 0;
    }
    return this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
      this.avoidedAccidentsSevereInjuriesExpensesPerYear,
    );
  }

  getAvoidedAccidentsDeathsExpenses() {
    if (this.getAvoidedAccidentsDeaths() === 0) {
      return 0;
    }
    return this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
      this.avoidedAccidentsDeathsExpensesPerYear,
    );
  }

  getAvoidedAccidentsInjuriesOrDeathsExpenses() {
    return (
      this.getAvoidedAccidentsDeathsExpenses() +
      this.getAvoidedAccidentsMinorInjuriesExpenses() +
      this.getAvoidedAccidentsSevereInjuriesExpenses()
    );
  }

  getAvoidedTrafficAccidents() {
    if (this.getAvoidedAccidentsInjuriesOrDeaths() === 0) {
      return undefined;
    }
    return {
      total: this.getAvoidedAccidentsInjuriesOrDeaths(),
      minorInjuries: this.getAvoidedAccidentsMinorInjuries(),
      severeInjuries: this.getAvoidedAccidentsSevereInjuries(),
      deaths: this.getAvoidedAccidentsDeaths(),
    };
  }

  getSocioEconomicList() {
    const socioEconomicImpacts = [
      {
        actor: "french_society",
        amount: this.getAvoidedAirPollution(),
        impact: "avoided_air_pollution",
        impactCategory: "social_monetary",
      },
      {
        actor: "local_people",
        amount: this.getAvoidedCarRelatedExpenses(),
        impact: "avoided_car_related_expenses",
        impactCategory: "economic_indirect",
      },
      {
        actor: "french_society",
        amount: this.getAvoidedPropertyDamageExpenses(),
        impact: "avoided_property_damages_expenses",
        impactCategory: "economic_indirect",
      },
      {
        actor: "local_people",
        amount: this.getTravelTimeSavedPerTravelerExpenses(),
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

  getAvoidedTrafficCO2Emissions(): { inTons: number; monetaryValue: number } | undefined {
    const avoidedCarTrafficCo2EqEmissions = this.getAvoidedTrafficCO2EmissionsInTons();
    if (avoidedCarTrafficCo2EqEmissions === 0) {
      return undefined;
    }
    return {
      inTons: avoidedCarTrafficCo2EqEmissions,
      monetaryValue: this.getAvoidedTrafficCO2EmissionsMonetaryValue(),
    };
  }
}
