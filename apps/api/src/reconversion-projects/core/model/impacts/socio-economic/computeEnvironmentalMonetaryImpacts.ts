import {
  isForest,
  isPermeableSurfaceWithoutPermanentVegetation,
  isPrairie,
  isSurfaceWithEcosystemBenefits,
  isSurfaceWithPermanentVegetation,
  isWetLand,
  SoilsDistribution,
  SoilType,
  sumSoilsSurfaceAreasWhere,
} from "src/soils/domain/soils";

type EnvironmentalMonetaryImpactInput = {
  evaluationPeriodInYears: number;
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
  baseSoilsCarbonStorage: number;
  forecastSoilsCarbonStorage: number;
  operationsFirstYear: number;
  decontaminatedSurface?: number;
};

export type EnvironmentalMonetaryImpact = EcosystemServicesImpact | WaterRegulationImpact;

type WaterRegulationImpact = {
  amount: number;
  actor: "community";
  impactCategory: "environmental_monetary";
  impact: "water_regulation";
};
type EcosystemServicesImpact = {
  amount: number;
  actor: "human_society";
  impact: "ecosystem_services";
  impactCategory: "environmental_monetary";
  details: {
    amount: number;
    impact:
      | "nature_related_wellness_and_leisure"
      | "forest_related_product"
      | "pollination"
      | "invasive_species_regulation"
      | "water_cycle"
      | "nitrogen_cycle"
      | "soil_erosion"
      | "carbon_storage";
  }[];
};

const ENVIRONMENTAL_AMENITIES_PRAIRIE_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0071;
const ENVIRONMENTAL_AMENITIES_FOREST_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0315;
const WET_LAND_ECOSYSTEMIC_SERVICES_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0234;

const computeNatureRelatedWellnessAndLeisure = (
  prairieSurface: number,
  forestSurface: number,
  wetLandSurface: number,
) => {
  const prairieEnvironmentalAmenities =
    prairieSurface * ENVIRONMENTAL_AMENITIES_PRAIRIE_MONETARY_VALUE_EURO_PER_SQUARE_METER;
  const forestEnvironmentalAmenities =
    forestSurface * ENVIRONMENTAL_AMENITIES_FOREST_MONETARY_VALUE_EURO_PER_SQUARE_METER;

  const environmentalAmenities = prairieEnvironmentalAmenities + forestEnvironmentalAmenities;
  const wetLandEcosystemServices =
    wetLandSurface * WET_LAND_ECOSYSTEMIC_SERVICES_MONETARY_VALUE_EURO_PER_SQUARE_METER;

  return environmentalAmenities + wetLandEcosystemServices;
};

const FOREST_RELATED_PRODUCT_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0157;
const computeForestRelatedProduct = (forestSurface: number) =>
  Math.max(0, forestSurface * FOREST_RELATED_PRODUCT_MONETARY_VALUE_EURO_PER_SQUARE_METER);

const POLLINATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0092;
const computePollination = (surfaceWithEcosystemBenefits: number) =>
  surfaceWithEcosystemBenefits * POLLINATION_MONETARY_VALUE_EURO_PER_SQUARE_METER;

const INVASIVE_SPECIES_REGULATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0034;
const computeInvasiveSpeciesRegulation = (surfaceWithEcosystemBenefits: number) =>
  Math.max(
    0,
    surfaceWithEcosystemBenefits * INVASIVE_SPECIES_REGULATION_MONETARY_VALUE_EURO_PER_SQUARE_METER,
  );

const WATER_CYCLE_PERMANENT_VEGETATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.1356;
const WATER_CYCLE_NON_PERMANENT_VEGETATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0254;
const computeWaterCycle = (soilsDifferentiel: SoilsDistribution) => {
  const permanentVegetation =
    sumSoilsSurfaceAreasWhere(soilsDifferentiel, isSurfaceWithPermanentVegetation) *
    WATER_CYCLE_PERMANENT_VEGETATION_MONETARY_VALUE_EURO_PER_SQUARE_METER;
  const other =
    sumSoilsSurfaceAreasWhere(soilsDifferentiel, isPermeableSurfaceWithoutPermanentVegetation) *
    WATER_CYCLE_NON_PERMANENT_VEGETATION_MONETARY_VALUE_EURO_PER_SQUARE_METER;

  return permanentVegetation + other;
};

const NITROGEN_CYCLE_PRAIRIE_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0069;
const NITROGEN_CYCLE_WET_LAND_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0913;
const computeNitrogenCycle = (prairieSurface: number, wetLandSurface: number) => {
  const prairie = prairieSurface * NITROGEN_CYCLE_PRAIRIE_MONETARY_VALUE_EURO_PER_SQUARE_METER;
  const wetLand = wetLandSurface * NITROGEN_CYCLE_WET_LAND_MONETARY_VALUE_EURO_PER_SQUARE_METER;

  return prairie + wetLand;
};

const SOIL_EROSION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.025;
const computeSoilErosion = (surfaceWithEcosystemBenefits: number) => {
  return Math.max(
    0,
    surfaceWithEcosystemBenefits * SOIL_EROSION_MONETARY_VALUE_EURO_PER_SQUARE_METER,
  );
};

const CO2_EQ_MONETARY_VALUE_EURO_2020 = 90;
const CO2_EQ_MONETARY_VALUE_EURO_2030 = 250;

export const computeCO2eqMonetaryValueForYear = (year: number) => {
  const ratioKnownPeriods = Math.pow(
    CO2_EQ_MONETARY_VALUE_EURO_2030 / CO2_EQ_MONETARY_VALUE_EURO_2020,
    1 / (2030 - 2020),
  );

  return Math.round(
    CO2_EQ_MONETARY_VALUE_EURO_2020 * Math.pow(1 + ratioKnownPeriods - 1, year - 2020),
  );
};

const RATIO_CO2_TO_CARBON = 12 / 44;
export const computeSoilsCarbonStorage = (
  baseSoilsCarbonStorage: number,
  forecastSoilsCarbonStorage: number,
  operationsFirstYear: number,
) => {
  const co2eqMonetaryValue = computeCO2eqMonetaryValueForYear(operationsFirstYear);

  const soilsCarbonStorageDifference = forecastSoilsCarbonStorage - baseSoilsCarbonStorage;
  return (soilsCarbonStorageDifference / RATIO_CO2_TO_CARBON) * co2eqMonetaryValue;
};

export const computeAvoidedCO2eqMonetaryValue = (
  avoidedCO2Tons: number,
  operationsFirstYear: number,
) => {
  const co2eqMonetaryValue = computeCO2eqMonetaryValueForYear(operationsFirstYear);

  return avoidedCO2Tons * co2eqMonetaryValue;
};

const WATER_REGULATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0118;
const computeWaterRegulation = (
  forestSurface: number,
  prairieSurface: number,
  wetLandSurface: number,
  decontaminatedSurfaceArea: number,
) => {
  return (
    (forestSurface + prairieSurface + wetLandSurface + decontaminatedSurfaceArea) *
    WATER_REGULATION_MONETARY_VALUE_EURO_PER_SQUARE_METER
  );
};

export const computeSoilsDifferential = (
  baseSoilsDistribution: SoilsDistribution,
  forecastSoilsDistribution: SoilsDistribution,
): SoilsDistribution => {
  const soilTypes = Array.from(
    new Set([...Object.keys(baseSoilsDistribution), ...Object.keys(forecastSoilsDistribution)]),
  ) as SoilType[];

  return soilTypes.reduce(
    (difference, soilType) => ({
      ...difference,
      [soilType]:
        (forecastSoilsDistribution[soilType] ?? 0) - (baseSoilsDistribution[soilType] ?? 0),
    }),
    {},
  );
};

export type EnvironmentalMonetaryImpactResult = EnvironmentalMonetaryImpact[];

export const computeEnvironmentalMonetaryImpacts = (
  input: EnvironmentalMonetaryImpactInput,
): EnvironmentalMonetaryImpactResult => {
  const impacts: EnvironmentalMonetaryImpactResult = [];

  const soilsDifferential = computeSoilsDifferential(
    input.baseSoilsDistribution,
    input.forecastSoilsDistribution,
  );

  const forestSurfaceDifference = sumSoilsSurfaceAreasWhere(soilsDifferential, isForest);
  const prairieSurfaceDifference = sumSoilsSurfaceAreasWhere(soilsDifferential, isPrairie);
  const wetLandSurfaceDifference = sumSoilsSurfaceAreasWhere(soilsDifferential, isWetLand);
  const surfaceWithEcosystemBenefitsDifference = sumSoilsSurfaceAreasWhere(
    soilsDifferential,
    isSurfaceWithEcosystemBenefits,
  );

  const waterRegulationImpact = computeWaterRegulation(
    forestSurfaceDifference,
    prairieSurfaceDifference,
    wetLandSurfaceDifference,
    input.decontaminatedSurface ?? 0,
  );

  if (waterRegulationImpact !== 0) {
    impacts.push({
      amount: Math.round(waterRegulationImpact * input.evaluationPeriodInYears),
      impact: "water_regulation",
      impactCategory: "environmental_monetary",
      actor: "community",
    });
  }

  const ecosystemServicesImpacts: EcosystemServicesImpact["details"] = [
    {
      amount: Math.round(
        computeSoilsCarbonStorage(
          input.baseSoilsCarbonStorage,
          input.forecastSoilsCarbonStorage,
          input.operationsFirstYear,
        ),
      ),
      impact: "carbon_storage",
    },
    {
      amount: Math.round(
        computeNatureRelatedWellnessAndLeisure(
          prairieSurfaceDifference,
          forestSurfaceDifference,
          wetLandSurfaceDifference,
        ) * input.evaluationPeriodInYears,
      ),
      impact: "nature_related_wellness_and_leisure",
    },
    {
      amount: Math.round(
        computeForestRelatedProduct(forestSurfaceDifference) * input.evaluationPeriodInYears,
      ),
      impact: "forest_related_product",
    },
    {
      amount: Math.round(
        computePollination(surfaceWithEcosystemBenefitsDifference) * input.evaluationPeriodInYears,
      ),
      impact: "pollination",
    },
    {
      amount: Math.round(
        computeInvasiveSpeciesRegulation(surfaceWithEcosystemBenefitsDifference) *
          input.evaluationPeriodInYears,
      ),
      impact: "invasive_species_regulation",
    },
    {
      amount: Math.round(computeWaterCycle(soilsDifferential) * input.evaluationPeriodInYears),
      impact: "water_cycle",
    },
    {
      amount: Math.round(
        computeNitrogenCycle(prairieSurfaceDifference, wetLandSurfaceDifference) *
          input.evaluationPeriodInYears,
      ),
      impact: "nitrogen_cycle",
    },
    {
      amount: Math.round(
        computeSoilErosion(surfaceWithEcosystemBenefitsDifference) * input.evaluationPeriodInYears,
      ),
      impact: "soil_erosion",
    },
  ].filter(({ amount }) => amount !== 0) as EcosystemServicesImpact["details"];

  const ecosystemServicesTotalImpact = ecosystemServicesImpacts.reduce(
    (total, { amount }) => total + amount,
    0,
  );

  if (ecosystemServicesTotalImpact !== 0) {
    impacts.push({
      amount: ecosystemServicesTotalImpact,
      impact: "ecosystem_services",
      impactCategory: "environmental_monetary",
      actor: "human_society",
      details: ecosystemServicesImpacts,
    });
  }

  return impacts;
};
