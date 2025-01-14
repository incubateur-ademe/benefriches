import {
  AvoidedCO2EqEmissions,
  BuildingFloorAreaUsageDistribution,
  ECONOMIC_ACTIVITY_BUILDINGS_USE,
  filterObjectWithKeys,
  getAnnualizedCO2MonetaryValueForDuration,
  roundTo2Digits,
  SocioEconomicImpact,
  SpacesDistribution,
  sumObjectValues,
} from "shared";

import { PartialImpactsServiceInterface } from "../ReconversionProjectImpactsServiceInterface";
import { InfluenceAreaService } from "../influence-area-service/InfluenceAreaService";

const CO2_BENEFIT_AMOUNT_GRAM_PER_HOUSING_SQUARE_METER_PER_YEAR = 15;
const CO2_BENEFIT_AMOUNT_GRAM_PER_BUSINESS_SQUARE_METER_PER_YEAR = 26.4;

const FRESHNESS_BENEFIT_AMOUNT_EUROS_PER_HOUSEHOLD_PER_YEAR = 4.2;
const FRESHNESS_BENEFIT_AMOUNT_EUROS_PER_BUSINESS_SQUARE_METER_PER_YEAR = 0.07;
type Props = {
  siteSquareMetersSurfaceArea: number;
  citySquareMetersSurfaceArea: number;
  cityPopulation: number;
  buildingsFloorAreaDistribution: BuildingFloorAreaUsageDistribution;
  spacesDistribution: SpacesDistribution;
  evaluationPeriodInYears: number;
  operationsFirstYear: number;
};

export class UrbanFreshnessRelatedImpactsService
  extends InfluenceAreaService
  implements PartialImpactsServiceInterface
{
  private readonly projectHousingSurfaceArea: number;
  private readonly projectTertiaryActivitySurface: number;
  private readonly projectOtherEconomicActivitySurface: number;
  private readonly projectPublicGreenSpaceSurface: number;
  private readonly evaluationPeriodInYears: number;
  private readonly operationsFirstYear: number;
  private readonly siteSurfaceArea: number;

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
    });
    const { RESIDENTIAL = 0, TERTIARY_ACTIVITIES = 0 } = buildingsFloorAreaDistribution;
    this.projectHousingSurfaceArea = RESIDENTIAL;
    this.projectTertiaryActivitySurface = TERTIARY_ACTIVITIES;

    const economicActivityBuildings = filterObjectWithKeys(
      buildingsFloorAreaDistribution,
      ECONOMIC_ACTIVITY_BUILDINGS_USE.filter((use) => use !== "TERTIARY_ACTIVITIES"),
    );

    this.projectOtherEconomicActivitySurface = sumObjectValues(economicActivityBuildings);
    this.projectPublicGreenSpaceSurface = spacesDistribution.PUBLIC_GREEN_SPACES ?? 0;
    this.evaluationPeriodInYears = evaluationPeriodInYears;
    this.operationsFirstYear = operationsFirstYear;

    this.siteSurfaceArea = siteSquareMetersSurfaceArea;

    this.influenceRadius = this.urbanFreshnessInfluenceRadius;
  }

  get hasUrbanFreshnessImpact() {
    if (this.projectPublicGreenSpaceSurface === 0) {
      return false;
    }
    const minRatio =
      this.projectPublicGreenSpaceSurface < 5000
        ? 50
        : this.projectPublicGreenSpaceSurface < 10000
          ? 10
          : 0;

    if (this.publicGreenSpaceSurfaceRatio < minRatio) {
      return false;
    }

    return true;
  }

  protected get urbanFreshnessInfluenceRadius() {
    if (this.projectPublicGreenSpaceSurface < 5000) {
      return this.publicGreenSpaceSurfaceRatio < 95 ? 0 : 25;
    }

    if (this.projectPublicGreenSpaceSurface < 10000) {
      return this.publicGreenSpaceSurfaceRatio < 50 ? 25 : 50;
    }

    if (this.publicGreenSpaceSurfaceRatio < 10) {
      return 0;
    }

    return this.publicGreenSpaceSurfaceRatio < 75 ? 50 : 75;
  }

  private get impactedHousing() {
    return this.projectHousingSurfaceArea + this.getInfluenceAreaSquareMetersHousingSurface();
  }
  private get publicGreenSpaceSurfaceRatio() {
    return (this.projectPublicGreenSpaceSurface / this.siteSurfaceArea) * 100;
  }

  private get impactedHouseholds() {
    return InfluenceAreaService.getHouseholdsFromHousingSurface(this.impactedHousing);
  }

  private get impactedBusinessBuildings() {
    return this.projectOtherEconomicActivitySurface + this.projectTertiaryActivitySurface;
  }

  private get housingAvoidedAirConditioningCo2EmissionsPerYear() {
    return this.impactedHousing * CO2_BENEFIT_AMOUNT_GRAM_PER_HOUSING_SQUARE_METER_PER_YEAR;
  }

  private get businessBuildingsAvoidedAirConditioningCo2EmissionsPerYear() {
    return (
      this.impactedBusinessBuildings * CO2_BENEFIT_AMOUNT_GRAM_PER_BUSINESS_SQUARE_METER_PER_YEAR
    );
  }

  private get avoidedAirConditioningCo2EmissionsPerYear() {
    return (
      this.housingAvoidedAirConditioningCo2EmissionsPerYear +
      this.businessBuildingsAvoidedAirConditioningCo2EmissionsPerYear
    );
  }

  getAvoidedInhabitantsAirConditioningExpenses() {
    return (
      this.impactedHouseholds *
      FRESHNESS_BENEFIT_AMOUNT_EUROS_PER_HOUSEHOLD_PER_YEAR *
      this.evaluationPeriodInYears
    );
  }

  getAvoidedBusinessBuildingsAirConditioningExpenses() {
    return (
      this.impactedBusinessBuildings *
      FRESHNESS_BENEFIT_AMOUNT_EUROS_PER_BUSINESS_SQUARE_METER_PER_YEAR *
      this.evaluationPeriodInYears
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
      (this.housingAvoidedAirConditioningCo2EmissionsPerYear / 1000000) *
      this.evaluationPeriodInYears
    );
  }

  getBusinessBuildingsAvoidedAirConditioningCo2EmissionsInTons() {
    return (
      (this.businessBuildingsAvoidedAirConditioningCo2EmissionsPerYear / 1000000) *
      this.evaluationPeriodInYears
    );
  }

  getAvoidedAirConditioningCo2EmissionsInTons() {
    return (
      (this.avoidedAirConditioningCo2EmissionsPerYear / 1000000) * this.evaluationPeriodInYears
    );
  }

  getAvoidedAirConditioningCo2EmissionsMonetaryValue() {
    return getAnnualizedCO2MonetaryValueForDuration(
      this.avoidedAirConditioningCo2EmissionsPerYear / 1000000,
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
