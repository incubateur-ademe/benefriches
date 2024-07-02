import { GetInfluenceAreaValuesServiceInterface } from "../../../gateways/GetInfluenceAreaValuesService";
import { CO2eqMonetaryValueService } from "./CO2eqMonetaryValueService";

const AVOIDED_KILOMETER_FOR_TRAVELERS = 1.2;
const PERCENT_OF_PEOPLE_IMPACTED = 0.5;
const PEOPLE_PER_VEHICULE = 1.45;
const AVERAGE_TIME_SAVED_IN_HOURS = 2 / 60;
const DAYS_IMPACTED_PER_YEAR_FOR_INHABITANTS = 365;
const DAYS_IMPACTED_PER_YEAR_FOR_WORKERS = 220;

export class TravelRelatedImpactsService {
  projectHousingSurfaceArea: number;
  projectTertiaryActivitySurface: number;
  projectOtherActivitySurface: number;
  durationInYears: number;
  operationFirstYear: number;

  constructor(
    private readonly influenceAreaValuesService: GetInfluenceAreaValuesServiceInterface,
    private readonly co2eqMonetaryValueService: CO2eqMonetaryValueService,
    projectHousingSurfaceArea: number,
    projectTertiaryActivitySurface: number,
    projectOtherActivitySurface: number,
    durationInYears: number,
    operationFirstYear: number,
  ) {
    this.projectHousingSurfaceArea = projectHousingSurfaceArea;
    this.projectTertiaryActivitySurface = projectTertiaryActivitySurface;
    this.projectOtherActivitySurface = projectOtherActivitySurface;
    this.durationInYears = durationInYears;
    this.operationFirstYear = operationFirstYear;
  }

  get impactedInhabitants() {
    return this.influenceAreaValuesService.getInhabitantsFromHousingSurface(
      this.projectHousingSurfaceArea +
        this.influenceAreaValuesService.getInfluenceAreaSquareMetersHousingSurface(),
    );
  }

  get impactedTertiaryActivityEmployees() {
    return this.projectTertiaryActivitySurface / 15;
  }

  get impactedOtherActivityEmployees() {
    return this.projectOtherActivitySurface / 70;
  }

  get avoidedKilometersPerInhabitantTraveler() {
    return (
      AVOIDED_KILOMETER_FOR_TRAVELERS *
      this.impactedInhabitants *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_INHABITANTS
    );
  }

  get avoidedKilometersPerTertiaryActivityEmployeeTraveler() {
    return (
      AVOIDED_KILOMETER_FOR_TRAVELERS *
      this.impactedTertiaryActivityEmployees *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_WORKERS
    );
  }

  get avoidedKilometersPerOtherActivityEmployeeTraveler() {
    return (
      AVOIDED_KILOMETER_FOR_TRAVELERS *
      this.impactedOtherActivityEmployees *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_WORKERS
    );
  }

  get avoidedKilometersPerTravelerPerYear() {
    return (
      this.avoidedKilometersPerInhabitantTraveler +
      this.avoidedKilometersPerOtherActivityEmployeeTraveler +
      this.avoidedKilometersPerTertiaryActivityEmployeeTraveler
    );
  }

  get avoidedKilometersPerWorkerVehiculePerYear() {
    return (
      (this.avoidedKilometersPerOtherActivityEmployeeTraveler +
        this.avoidedKilometersPerTertiaryActivityEmployeeTraveler) /
      PEOPLE_PER_VEHICULE
    );
  }

  get avoidedKilometersPerResidentVehiculePerYear() {
    return this.avoidedKilometersPerInhabitantTraveler / PEOPLE_PER_VEHICULE;
  }

  get avoidedKilometersPerVehiculePerYear() {
    return this.avoidedKilometersPerTravelerPerYear / PEOPLE_PER_VEHICULE;
  }

  get travelTimeSavedPerInhabitantTraveler() {
    return (
      AVERAGE_TIME_SAVED_IN_HOURS *
      this.impactedInhabitants *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_INHABITANTS
    );
  }

  get travelTimeSavedPerOtherActivityEmployeeTraveler() {
    return (
      AVERAGE_TIME_SAVED_IN_HOURS *
      this.impactedTertiaryActivityEmployees *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_WORKERS
    );
  }

  get travelTimeSavedPerTertiaryActivityEmployeeTraveler() {
    return (
      AVERAGE_TIME_SAVED_IN_HOURS *
      this.impactedOtherActivityEmployees *
      PERCENT_OF_PEOPLE_IMPACTED *
      DAYS_IMPACTED_PER_YEAR_FOR_WORKERS
    );
  }

  get travelTimeSavedPerTravelerPerYear() {
    return (
      this.travelTimeSavedPerInhabitantTraveler +
      this.travelTimeSavedPerTertiaryActivityEmployeeTraveler +
      this.travelTimeSavedPerOtherActivityEmployeeTraveler
    );
  }

  get localPollutionPerVehiculeKilometer() {
    const municipalDensity =
      this.influenceAreaValuesService.municipalDensityInhabitantPerSquareMeter * 1000000;

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

  get deathsRatioPerAccident() {
    if (this.influenceAreaValuesService.cityPopulation < 5000) {
      return 9.6 / 100;
    } else if (this.influenceAreaValuesService.cityPopulation < 20000) {
      return 4.8 / 100;
    } else if (this.influenceAreaValuesService.cityPopulation < 50000) {
      return 3 / 100;
    } else if (this.influenceAreaValuesService.cityPopulation < 100000) {
      return 3.1 / 100;
    } else {
      return 2.3 / 100;
    }
  }

  get severeInjuriesRatioPerAccident() {
    if (this.influenceAreaValuesService.cityPopulation < 5000) {
      return 37.4 / 100;
    } else if (this.influenceAreaValuesService.cityPopulation < 20000) {
      return 23.4 / 100;
    } else if (this.influenceAreaValuesService.cityPopulation < 50000) {
      return 12.3 / 100;
    } else if (this.influenceAreaValuesService.cityPopulation < 100000) {
      return 11.9 / 100;
    } else {
      return 7.7 / 100;
    }
  }

  get minorInjuriesRatioPerAccident() {
    if (this.influenceAreaValuesService.cityPopulation < 5000) {
      return 101.6 / 100;
    } else if (this.influenceAreaValuesService.cityPopulation < 20000) {
      return 106.3 / 100;
    } else if (this.influenceAreaValuesService.cityPopulation < 50000) {
      return 115.8 / 100;
    } else if (this.influenceAreaValuesService.cityPopulation < 100000) {
      return 110.9 / 100;
    } else {
      return 123.2 / 100;
    }
  }

  get avoidedAccidentsPerYearForHundredMillionOfVehicule() {
    return (this.avoidedKilometersPerVehiculePerYear * 4.77) / 100000000;
  }

  get avoidedCO2EmissionsGramPerKilometerPerYear() {
    return this.avoidedKilometersPerVehiculePerYear * 157.2;
  }

  getTravelTimeSavedPerTraveler() {
    return this.durationInYears * this.travelTimeSavedPerTravelerPerYear;
  }

  getAvoidedKilometersPerWorkerVehicule() {
    return this.durationInYears * this.avoidedKilometersPerWorkerVehiculePerYear;
  }

  getAvoidedKilometersPerResidentVehicule() {
    return this.durationInYears * this.avoidedKilometersPerResidentVehiculePerYear;
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

  getTravelTimeSavedPerTravelerMonetaryAmount() {
    return this.getTravelTimeSavedPerTraveler() * 10;
  }

  getAvoidedTrafficCO2EmissionsInTons() {
    return (this.avoidedCO2EmissionsGramPerKilometerPerYear / 1000000) * this.durationInYears;
  }

  getAvoidedTrafficCO2EmissionsMonetaryValue() {
    return this.co2eqMonetaryValueService.getAnnualizedCO2MonetaryValueForDuration(
      this.avoidedCO2EmissionsGramPerKilometerPerYear / 1000000,
      this.operationFirstYear,
      this.durationInYears,
    );
  }

  getAvoidedAirPollution() {
    return this.getAvoidedKilometersPerVehicule() * this.localPollutionPerVehiculeKilometer;
  }

  getAvoidedAccidentsMinorInjuries() {
    return Math.floor(
      this.avoidedAccidentsPerYearForHundredMillionOfVehicule *
        this.minorInjuriesRatioPerAccident *
        this.durationInYears,
    );
  }

  getAvoidedAccidentsSevereInjuries() {
    return Math.floor(
      this.avoidedAccidentsPerYearForHundredMillionOfVehicule *
        this.severeInjuriesRatioPerAccident *
        this.durationInYears,
    );
  }

  getAvoidedAccidentsDeaths() {
    return Math.floor(
      this.avoidedAccidentsPerYearForHundredMillionOfVehicule *
        this.deathsRatioPerAccident *
        this.durationInYears,
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
}
