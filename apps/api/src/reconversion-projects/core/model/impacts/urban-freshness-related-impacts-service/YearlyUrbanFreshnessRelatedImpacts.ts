import {
  BuildingsUseDistribution,
  BUILDINGS_ECONOMIC_ACTIVITY_USE,
  filterObjectWithKeys,
  SpacesDistribution,
  sumObjectValues,
} from "shared";

import { InfluenceAreaService } from "../influence-area-service/InfluenceAreaService";

const CO2_BENEFIT_AMOUNT_GRAM_PER_HOUSING_SQUARE_METER_PER_YEAR = 15;
const CO2_BENEFIT_AMOUNT_GRAM_PER_BUSINESS_SQUARE_METER_PER_YEAR = 26.4;

const FRESHNESS_BENEFIT_AMOUNT_EUROS_PER_HOUSEHOLD_PER_YEAR = 4.2;
const FRESHNESS_BENEFIT_AMOUNT_EUROS_PER_BUSINESS_SQUARE_METER_PER_YEAR = 0.07;

type Props = {
  siteSquareMetersSurfaceArea: number;
  citySquareMetersSurfaceArea: number;
  cityPopulation: number;
  buildingsFloorAreaDistribution: BuildingsUseDistribution;
  spacesDistribution: SpacesDistribution;
};

export class YearlyUrbanFreshnessRelatedImpacts extends InfluenceAreaService {
  private readonly projectHousingSurfaceArea: number;
  private readonly projectOfficesActivitySurface: number;
  private readonly projectOtherEconomicActivitySurface: number;
  private readonly projectPublicGreenSpaceSurface: number;
  private readonly siteSurfaceArea: number;

  constructor({
    siteSquareMetersSurfaceArea,
    citySquareMetersSurfaceArea,
    cityPopulation,
    buildingsFloorAreaDistribution,
    spacesDistribution,
  }: Props) {
    super({
      siteSquareMetersSurfaceArea,
      citySquareMetersSurfaceArea,
      cityPopulation,
    });
    const { RESIDENTIAL = 0, OFFICES = 0 } = buildingsFloorAreaDistribution;
    this.projectHousingSurfaceArea = RESIDENTIAL;
    this.projectOfficesActivitySurface = OFFICES;

    const economicActivityBuildings = filterObjectWithKeys(
      buildingsFloorAreaDistribution,
      BUILDINGS_ECONOMIC_ACTIVITY_USE.filter((use) => use !== "OFFICES"),
    );

    this.projectOtherEconomicActivitySurface = sumObjectValues(economicActivityBuildings);
    this.projectPublicGreenSpaceSurface = spacesDistribution.PUBLIC_GREEN_SPACES ?? 0;

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

  protected get impactedHousing() {
    if (!this.hasUrbanFreshnessImpact) {
      return 0;
    }
    return this.projectHousingSurfaceArea + this.getInfluenceAreaSquareMetersHousingSurface();
  }
  protected get publicGreenSpaceSurfaceRatio() {
    return (this.projectPublicGreenSpaceSurface / this.siteSurfaceArea) * 100;
  }

  protected get impactedHouseholds() {
    return InfluenceAreaService.getHouseholdsFromHousingSurface(this.impactedHousing);
  }

  protected get impactedBusinessBuildings() {
    if (!this.hasUrbanFreshnessImpact) {
      return 0;
    }
    return this.projectOtherEconomicActivitySurface + this.projectOfficesActivitySurface;
  }

  protected get housingAvoidedAirConditioningCo2EmissionsPerYear() {
    return this.impactedHousing * CO2_BENEFIT_AMOUNT_GRAM_PER_HOUSING_SQUARE_METER_PER_YEAR;
  }

  protected get businessBuildingsAvoidedAirConditioningCo2EmissionsPerYear() {
    return (
      this.impactedBusinessBuildings * CO2_BENEFIT_AMOUNT_GRAM_PER_BUSINESS_SQUARE_METER_PER_YEAR
    );
  }

  protected get avoidedAirConditioningCo2EmissionsPerYear() {
    return (
      this.housingAvoidedAirConditioningCo2EmissionsPerYear +
      this.businessBuildingsAvoidedAirConditioningCo2EmissionsPerYear
    );
  }

  protected get avoidedInhabitantsAirConditioningExpensesPerYear() {
    return this.impactedHouseholds * FRESHNESS_BENEFIT_AMOUNT_EUROS_PER_HOUSEHOLD_PER_YEAR;
  }

  protected get avoidedBusinessBuildingsAirConditioningExpensesPerYear() {
    return (
      this.impactedBusinessBuildings *
      FRESHNESS_BENEFIT_AMOUNT_EUROS_PER_BUSINESS_SQUARE_METER_PER_YEAR
    );
  }

  protected get avoidedAirConditioningExpensesPerYear() {
    return (
      this.avoidedInhabitantsAirConditioningExpensesPerYear +
      this.avoidedBusinessBuildingsAirConditioningExpensesPerYear
    );
  }

  protected get housingAvoidedAirConditioningCo2EmissionsInTonsPerYear() {
    return this.housingAvoidedAirConditioningCo2EmissionsPerYear / 1000000;
  }

  protected get businessBuildingsAvoidedAirConditioningCo2EmissionsInTonsPerYear() {
    return this.businessBuildingsAvoidedAirConditioningCo2EmissionsPerYear / 1000000;
  }

  protected get avoidedAirConditioningCo2EmissionsInTonsPerYear() {
    return this.avoidedAirConditioningCo2EmissionsPerYear / 1000000;
  }
}
