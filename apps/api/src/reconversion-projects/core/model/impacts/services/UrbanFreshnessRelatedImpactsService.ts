import { GetInfluenceAreaValuesServiceInterface } from "../../../gateways/GetInfluenceAreaValuesService";
import { CO2eqMonetaryValueService } from "./CO2eqMonetaryValueService";

const CO2_BENEFIT_AMOUNT_GRAM_PER_HOUSING_SQUARE_METER_PER_YEAR = 15;
const CO2_BENEFIT_AMOUNT_GRAM_PER_BUSINESS_SQUARE_METER_PER_YEAR = 26.4;

const FRESHNESS_BENEFIT_AMOUNT_EUROS_PER_HOUSEHOLD_PER_YEAR = 4.2;
const FRESHNESS_BENEFIT_AMOUNT_EUROS_PER_BUSINESS_SQUARE_METER_PER_YEAR = 0.07;

export class UrbanFreshnessRelatedImpactsService {
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

  get impactedHousing() {
    return (
      this.projectHousingSurfaceArea +
      this.influenceAreaValuesService.getInfluenceAreaSquareMetersHousingSurface()
    );
  }

  get impactedHouseholds() {
    return this.influenceAreaValuesService.getHouseholdsFromHousingSurface(this.impactedHousing);
  }

  get impactedBusinessBuildings() {
    return this.projectOtherActivitySurface + this.projectTertiaryActivitySurface;
  }

  get housingAvoidedAirConditioningCo2EmissionsPerYear() {
    return this.impactedHousing * CO2_BENEFIT_AMOUNT_GRAM_PER_HOUSING_SQUARE_METER_PER_YEAR;
  }

  get businessBuildingsAvoidedAirConditioningCo2EmissionsPerYear() {
    return (
      this.impactedBusinessBuildings * CO2_BENEFIT_AMOUNT_GRAM_PER_BUSINESS_SQUARE_METER_PER_YEAR
    );
  }

  get avoidedAirConditioningCo2EmissionsPerYear() {
    return (
      this.housingAvoidedAirConditioningCo2EmissionsPerYear +
      this.businessBuildingsAvoidedAirConditioningCo2EmissionsPerYear
    );
  }

  getAvoidedInhabitantsAirConditioningExpenses() {
    return (
      this.impactedHouseholds *
      FRESHNESS_BENEFIT_AMOUNT_EUROS_PER_HOUSEHOLD_PER_YEAR *
      this.durationInYears
    );
  }

  getAvoidedBusinessBuildingsAirConditioningExpenses() {
    return (
      this.impactedBusinessBuildings *
      FRESHNESS_BENEFIT_AMOUNT_EUROS_PER_BUSINESS_SQUARE_METER_PER_YEAR *
      this.durationInYears
    );
  }

  getAvoidedAirConditioningExpenses() {
    return (
      this.getAvoidedInhabitantsAirConditioningExpenses() +
      this.getAvoidedBusinessBuildingsAirConditioningExpenses()
    );
  }

  getHousingAvoidedAirConditioningCo2EmissionsInTons() {
    return (this.housingAvoidedAirConditioningCo2EmissionsPerYear / 1000000) * this.durationInYears;
  }

  getBusinessBuildingsAvoidedAirConditioningCo2EmissionsInTons() {
    return (
      (this.businessBuildingsAvoidedAirConditioningCo2EmissionsPerYear / 1000000) *
      this.durationInYears
    );
  }

  getAvoidedAirConditioningCo2EmissionsInTons() {
    return (this.avoidedAirConditioningCo2EmissionsPerYear / 1000000) * this.durationInYears;
  }

  getAvoidedAirConditioningCo2EmissionsMonetaryValue() {
    return this.co2eqMonetaryValueService.getAnnualizedCO2MonetaryValueForDuration(
      this.avoidedAirConditioningCo2EmissionsPerYear / 1000000,
      this.operationFirstYear,
      this.durationInYears,
    );
  }
}
