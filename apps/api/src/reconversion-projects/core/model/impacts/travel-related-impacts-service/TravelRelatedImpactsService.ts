import {
  AvoidedCO2EqEmissions,
  BuildingFloorAreaUsageDistribution,
  ECONOMIC_ACTIVITY_BUILDINGS_USE,
  filterObjectWithKeys,
  getAnnualizedCO2MonetaryValueForDuration,
  roundTo1Digit,
  roundTo2Digits,
  SocioEconomicImpact,
  sumObjectValues,
} from "shared";

import { PartialImpactsServiceInterface } from "../ReconversionProjectImpactsServiceInterface";
import { InfluenceAreaService } from "../influence-area-service/InfluenceAreaService";

const AVOIDED_KILOMETER_FOR_TRAVELERS = 1.2;
const PERCENT_OF_PEOPLE_IMPACTED = 0.5;
const PEOPLE_PER_VEHICULE = 1.45;
const AVERAGE_TIME_SAVED_IN_HOURS = 2 / 60;
const DAYS_IMPACTED_PER_YEAR_FOR_INHABITANTS = 365;
const DAYS_IMPACTED_PER_YEAR_FOR_WORKERS = 220;

type Props = {
  siteSquareMetersSurfaceArea: number;
  citySquareMetersSurfaceArea: number;
  cityPopulation: number;
  buildingsFloorAreaDistribution: BuildingFloorAreaUsageDistribution;
  evaluationPeriodInYears: number;
  operationsFirstYear: number;
};

export class TravelRelatedImpactsService
  extends InfluenceAreaService
  implements PartialImpactsServiceInterface
{
  private readonly projectHousingSurfaceArea: number;
  private readonly projectTertiaryActivitySurface: number;
  private readonly projectOtherEconomicActivitySurface: number;
  private readonly publicCulturalAndSportsFacilitiesSurface: number;
  private readonly evaluationPeriodInYears: number;
  private readonly operationsFirstYear: number;

  constructor({
    buildingsFloorAreaDistribution,
    siteSquareMetersSurfaceArea,
    citySquareMetersSurfaceArea,
    cityPopulation,
    evaluationPeriodInYears,
    operationsFirstYear,
  }: Props) {
    super({
      siteSquareMetersSurfaceArea,
      citySquareMetersSurfaceArea,
      cityPopulation,
    });
    const {
      RESIDENTIAL = 0,
      TERTIARY_ACTIVITIES = 0,
      SOCIO_CULTURAL_PLACE = 0,
      SPORTS_FACILITIES = 0,
    } = buildingsFloorAreaDistribution;
    this.projectHousingSurfaceArea = RESIDENTIAL;
    this.projectTertiaryActivitySurface = TERTIARY_ACTIVITIES;

    const economicActivityBuildings = filterObjectWithKeys(
      buildingsFloorAreaDistribution,
      ECONOMIC_ACTIVITY_BUILDINGS_USE.filter((use) => use !== "TERTIARY_ACTIVITIES"),
    );

    this.projectOtherEconomicActivitySurface = sumObjectValues(economicActivityBuildings);
    this.publicCulturalAndSportsFacilitiesSurface = SPORTS_FACILITIES + SOCIO_CULTURAL_PLACE;
    this.evaluationPeriodInYears = evaluationPeriodInYears;
    this.operationsFirstYear = operationsFirstYear;

    this.influenceRadius = this.travelInfluenceRadius;
  }

  protected get travelInfluenceRadius() {
    if (
      this.economicActivityBuildingSurface === 0 &&
      this.publicCulturalAndSportsFacilitiesSurface === 0
    ) {
      return 0;
    }

    if (
      this.economicActivityBuildingSurface < 151 &&
      this.publicCulturalAndSportsFacilitiesSurface === 0
    ) {
      return 100;
    }

    if (
      this.economicActivityBuildingSurface < 300 &&
      this.publicCulturalAndSportsFacilitiesSurface === 0
    ) {
      return 200;
    }

    return 500;
  }

  private get economicActivityBuildingSurface() {
    return this.projectTertiaryActivitySurface + this.projectOtherEconomicActivitySurface;
  }

  private get impactedInhabitants() {
    return InfluenceAreaService.getInhabitantsFromHousingSurface(
      this.projectHousingSurfaceArea + this.getInfluenceAreaSquareMetersHousingSurface(),
    );
  }

  private get impactedTertiaryActivityEmployees() {
    return this.projectTertiaryActivitySurface / 15;
  }

  private get impactedOtherActivityEmployees() {
    return this.projectOtherEconomicActivitySurface / 70;
  }

  private get avoidedKilometersPerInhabitantTraveler() {
    return (
      AVOIDED_KILOMETER_FOR_TRAVELERS *
      this.impactedInhabitants *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_INHABITANTS
    );
  }

  private get avoidedKilometersPerTertiaryActivityEmployeeTraveler() {
    return (
      AVOIDED_KILOMETER_FOR_TRAVELERS *
      this.impactedTertiaryActivityEmployees *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_WORKERS
    );
  }

  private get avoidedKilometersPerOtherActivityEmployeeTraveler() {
    return (
      AVOIDED_KILOMETER_FOR_TRAVELERS *
      this.impactedOtherActivityEmployees *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_WORKERS
    );
  }

  private get avoidedKilometersPerTravelerPerYear() {
    return (
      this.avoidedKilometersPerInhabitantTraveler +
      this.avoidedKilometersPerOtherActivityEmployeeTraveler +
      this.avoidedKilometersPerTertiaryActivityEmployeeTraveler
    );
  }

  private get avoidedKilometersPerWorkerVehiculePerYear() {
    return (
      (this.avoidedKilometersPerOtherActivityEmployeeTraveler +
        this.avoidedKilometersPerTertiaryActivityEmployeeTraveler) /
      PEOPLE_PER_VEHICULE
    );
  }

  private get avoidedKilometersPerResidentVehiculePerYear() {
    return this.avoidedKilometersPerInhabitantTraveler / PEOPLE_PER_VEHICULE;
  }

  private get avoidedKilometersPerVehiculePerYear() {
    return this.avoidedKilometersPerTravelerPerYear / PEOPLE_PER_VEHICULE;
  }

  private get travelTimeSavedPerInhabitantTraveler() {
    return (
      AVERAGE_TIME_SAVED_IN_HOURS *
      this.impactedInhabitants *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_INHABITANTS
    );
  }

  private get travelTimeSavedPerOtherActivityEmployeeTraveler() {
    return (
      AVERAGE_TIME_SAVED_IN_HOURS *
      this.impactedTertiaryActivityEmployees *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_WORKERS
    );
  }

  private get travelTimeSavedPerTertiaryActivityEmployeeTraveler() {
    return (
      AVERAGE_TIME_SAVED_IN_HOURS *
      this.impactedOtherActivityEmployees *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_WORKERS
    );
  }

  private get travelTimeSavedPerTravelerPerYear() {
    return (
      this.travelTimeSavedPerInhabitantTraveler +
      this.travelTimeSavedPerTertiaryActivityEmployeeTraveler +
      this.travelTimeSavedPerOtherActivityEmployeeTraveler
    );
  }

  private get localPollutionPerVehiculeKilometer() {
    const municipalDensity = this.municipalDensityInhabitantPerSquareMeter * 1000000;

    if (municipalDensity < 37) {
      return 0.97 / 100;
    } else if (municipalDensity < 450) {
      return 1.33 / 100;
    } else if (municipalDensity < 1500) {
      return 1.58 / 100;
    } else if (municipalDensity < 4500) {
      return 3.88 / 100;
    } else {
      return 14.05 / 100;
    }
  }

  private get deathsRatioPerAccident() {
    if (this.cityPopulation < 5000) {
      return 9.6 / 100;
    } else if (this.cityPopulation < 20000) {
      return 4.8 / 100;
    } else if (this.cityPopulation < 50000) {
      return 3 / 100;
    } else if (this.cityPopulation < 100000) {
      return 3.1 / 100;
    } else {
      return 2.3 / 100;
    }
  }

  private get severeInjuriesRatioPerAccident() {
    if (this.cityPopulation < 5000) {
      return 37.4 / 100;
    } else if (this.cityPopulation < 20000) {
      return 23.4 / 100;
    } else if (this.cityPopulation < 50000) {
      return 12.3 / 100;
    } else if (this.cityPopulation < 100000) {
      return 11.9 / 100;
    } else {
      return 7.7 / 100;
    }
  }

  private get minorInjuriesRatioPerAccident() {
    if (this.cityPopulation < 5000) {
      return 101.6 / 100;
    } else if (this.cityPopulation < 20000) {
      return 106.3 / 100;
    } else if (this.cityPopulation < 50000) {
      return 115.8 / 100;
    } else if (this.cityPopulation < 100000) {
      return 110.9 / 100;
    } else {
      return 123.2 / 100;
    }
  }

  private get avoidedAccidentsPerYearForHundredMillionOfVehicule() {
    return this.avoidedKilometersPerVehiculePerYear * 4.77;
  }

  private get avoidedAccidentsPerYear() {
    return this.avoidedAccidentsPerYearForHundredMillionOfVehicule / 100000000;
  }

  private get avoidedCO2EmissionsGramPerKilometerPerYear() {
    return this.avoidedKilometersPerVehiculePerYear * 157.2;
  }

  getAvoidedPropertyDamageCosts() {
    return this.avoidedAccidentsPerYear * 6264 * this.evaluationPeriodInYears;
  }

  getTravelTimeSavedPerTraveler() {
    return this.evaluationPeriodInYears * this.travelTimeSavedPerTravelerPerYear;
  }

  getTravelTimeSavedPerInhabitantTraveler() {
    return this.evaluationPeriodInYears * this.travelTimeSavedPerInhabitantTraveler;
  }

  getTravelTimeSavedPerWorkerTraveler() {
    return (
      (this.travelTimeSavedPerTertiaryActivityEmployeeTraveler +
        this.travelTimeSavedPerOtherActivityEmployeeTraveler) *
      this.evaluationPeriodInYears
    );
  }

  getAvoidedKilometersPerWorkerVehicule() {
    return this.evaluationPeriodInYears * this.avoidedKilometersPerWorkerVehiculePerYear;
  }

  getAvoidedKilometersPerResidentVehicule() {
    return this.evaluationPeriodInYears * this.avoidedKilometersPerResidentVehiculePerYear;
  }

  getAvoidedKilometersPerVehicule() {
    return (
      this.getAvoidedKilometersPerResidentVehicule() + this.getAvoidedKilometersPerWorkerVehicule()
    );
  }

  getAvoidedKilometersPerWorkerVehiculeMonetaryAmount() {
    return this.getAvoidedKilometersPerWorkerVehicule() * 0.1;
  }

  getAvoidedKilometersPerResidentVehiculeMonetaryAmount() {
    return this.getAvoidedKilometersPerResidentVehicule() * 0.1;
  }

  getAvoidedKilometersPerVehiculeMonetaryAmount() {
    return (
      this.getAvoidedKilometersPerWorkerVehiculeMonetaryAmount() +
      this.getAvoidedKilometersPerResidentVehiculeMonetaryAmount()
    );
  }

  getTravelTimeSavedPerInhabitantTravelerMonetaryAmount() {
    return this.getTravelTimeSavedPerInhabitantTraveler() * 10;
  }

  getTravelTimeSavedPerWorkerTravelerMonetaryAmount() {
    return this.getTravelTimeSavedPerWorkerTraveler() * 10;
  }

  getAvoidedTrafficCO2EmissionsInTons() {
    return (
      (this.avoidedCO2EmissionsGramPerKilometerPerYear / 1000000) * this.evaluationPeriodInYears
    );
  }

  getAvoidedTrafficCO2EmissionsMonetaryValue() {
    return getAnnualizedCO2MonetaryValueForDuration(
      this.avoidedCO2EmissionsGramPerKilometerPerYear / 1000000,
      this.operationsFirstYear,
      this.evaluationPeriodInYears,
    );
  }

  getAvoidedAirPollution() {
    return this.getAvoidedKilometersPerVehicule() * this.localPollutionPerVehiculeKilometer;
  }

  getAvoidedAccidentsMinorInjuries() {
    return Math.floor(
      this.avoidedAccidentsPerYear *
        this.minorInjuriesRatioPerAccident *
        this.evaluationPeriodInYears,
    );
  }

  getAvoidedAccidentsSevereInjuries() {
    return Math.floor(
      this.avoidedAccidentsPerYear *
        this.severeInjuriesRatioPerAccident *
        this.evaluationPeriodInYears,
    );
  }

  getAvoidedAccidentsDeaths() {
    return Math.floor(
      this.avoidedAccidentsPerYear * this.deathsRatioPerAccident * this.evaluationPeriodInYears,
    );
  }

  getAvoidedAccidentsInjuriesOrDeaths() {
    return (
      this.getAvoidedAccidentsDeaths() +
      this.getAvoidedAccidentsMinorInjuries() +
      this.getAvoidedAccidentsSevereInjuries()
    );
  }

  getAvoidedAccidentsMinorInjuriesMonetaryValue() {
    return this.getAvoidedAccidentsMinorInjuries() * 16000;
  }

  getAvoidedAccidentsSevereInjuriesMonetaryValue() {
    return this.getAvoidedAccidentsSevereInjuries() * 400000;
  }

  getAvoidedAccidentsDeathsMonetaryValue() {
    return this.getAvoidedAccidentsDeaths() * 3200000;
  }

  getAvoidedAccidentsInjuriesOrDeathsMonetaryValue() {
    return (
      this.getAvoidedAccidentsDeathsMonetaryValue() +
      this.getAvoidedAccidentsMinorInjuriesMonetaryValue() +
      this.getAvoidedAccidentsSevereInjuriesMonetaryValue()
    );
  }

  getSocioEconomicList() {
    const socioEconomicImpacts = [
      {
        actor: "human_society",
        amount: roundTo2Digits(this.getAvoidedAirPollution()),
        impact: "avoided_air_pollution",
        impactCategory: "social_monetary",
      },
      {
        actor: "local_people",
        amount: roundTo2Digits(
          this.getAvoidedKilometersPerResidentVehiculeMonetaryAmount() +
            this.getAvoidedKilometersPerWorkerVehiculeMonetaryAmount(),
        ),
        impact: "avoided_car_related_expenses",
        impactCategory: "economic_indirect",
      },
      {
        actor: "french_society",
        amount: roundTo2Digits(this.getAvoidedPropertyDamageCosts()),
        impact: "avoided_property_damages_expenses",
        impactCategory: "economic_indirect",
      },
      {
        actor: "local_people",
        amount: roundTo2Digits(
          this.getTravelTimeSavedPerInhabitantTravelerMonetaryAmount() +
            this.getTravelTimeSavedPerWorkerTravelerMonetaryAmount(),
        ),
        impact: "travel_time_saved",
        impactCategory: "social_monetary",
      },
      {
        actor: "french_society",
        amount: roundTo2Digits(this.getAvoidedAccidentsInjuriesOrDeathsMonetaryValue()),
        impact: "avoided_traffic_accidents",
        impactCategory: "social_monetary",
        details: [
          {
            amount: roundTo2Digits(this.getAvoidedAccidentsMinorInjuriesMonetaryValue()),
            impact: "avoided_traffic_minor_injuries",
          },
          {
            amount: roundTo2Digits(this.getAvoidedAccidentsSevereInjuriesMonetaryValue()),
            impact: "avoided_traffic_severe_injuries",
          },
          {
            amount: roundTo2Digits(this.getAvoidedAccidentsDeathsMonetaryValue()),
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
