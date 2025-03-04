const ENVIRONMENTAL_AMENITIES_PRAIRIE_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0071;
const ENVIRONMENTAL_AMENITIES_FOREST_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0315;
const WET_LAND_ECOSYSTEMIC_SERVICES_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0234;
type NatureAndRelatedWellnessProps = {
  prairieSurfaceArea?: number;
  forestSurfaceArea?: number;
  wetLandSurfaceArea?: number;
};
export const computeNatureRelatedWellnessAndLeisureMonetaryValue = ({
  prairieSurfaceArea = 0,
  forestSurfaceArea = 0,
  wetLandSurfaceArea = 0,
}: NatureAndRelatedWellnessProps) => {
  const prairieEnvironmentalAmenities =
    prairieSurfaceArea * ENVIRONMENTAL_AMENITIES_PRAIRIE_MONETARY_VALUE_EURO_PER_SQUARE_METER;
  const forestEnvironmentalAmenities =
    forestSurfaceArea * ENVIRONMENTAL_AMENITIES_FOREST_MONETARY_VALUE_EURO_PER_SQUARE_METER;

  const environmentalAmenities = prairieEnvironmentalAmenities + forestEnvironmentalAmenities;
  const wetLandEcosystemServices =
    wetLandSurfaceArea * WET_LAND_ECOSYSTEMIC_SERVICES_MONETARY_VALUE_EURO_PER_SQUARE_METER;

  return environmentalAmenities + wetLandEcosystemServices;
};

const FOREST_RELATED_PRODUCT_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0157;
export const computeForestRelatedProductMonetaryValue = (forestSurfaceArea: number) => {
  return forestSurfaceArea * FOREST_RELATED_PRODUCT_MONETARY_VALUE_EURO_PER_SQUARE_METER;
};

const POLLINATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0092;
export const computePollinisationMonetaryValue = (surfaceWithEcosystemBenefits: number) => {
  return surfaceWithEcosystemBenefits * POLLINATION_MONETARY_VALUE_EURO_PER_SQUARE_METER;
};

const INVASIVE_SPECIES_REGULATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0034;
export const computeInvasiveSpeciesRegulationMonetaryValue = (
  surfaceWithEcosystemBenefits: number,
) => {
  return (
    surfaceWithEcosystemBenefits * INVASIVE_SPECIES_REGULATION_MONETARY_VALUE_EURO_PER_SQUARE_METER
  );
};

const WATER_CYCLE_PERMANENT_VEGETATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.1356;
const WATER_CYCLE_NON_PERMANENT_VEGETATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0254;
export const computeWaterCycleMonetaryValue = (
  surfaceWithPermanentVegetation: number,
  permeableSurfaceWithoutPermanentVegetation: number,
) => {
  const permanentVegetation =
    surfaceWithPermanentVegetation *
    WATER_CYCLE_PERMANENT_VEGETATION_MONETARY_VALUE_EURO_PER_SQUARE_METER;
  const other =
    permeableSurfaceWithoutPermanentVegetation *
    WATER_CYCLE_NON_PERMANENT_VEGETATION_MONETARY_VALUE_EURO_PER_SQUARE_METER;

  return permanentVegetation + other;
};

type NitrogenCycleProps = { prairieSurfaceArea?: number; wetLandSurfaceArea?: number };
const NITROGEN_CYCLE_PRAIRIE_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0069;
const NITROGEN_CYCLE_WET_LAND_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0913;
export const computeNitrogenCycleMonetaryValue = ({
  prairieSurfaceArea = 0,
  wetLandSurfaceArea = 0,
}: NitrogenCycleProps) => {
  const prairie = prairieSurfaceArea * NITROGEN_CYCLE_PRAIRIE_MONETARY_VALUE_EURO_PER_SQUARE_METER;
  const wetLand = wetLandSurfaceArea * NITROGEN_CYCLE_WET_LAND_MONETARY_VALUE_EURO_PER_SQUARE_METER;

  return prairie + wetLand;
};

const SOIL_EROSION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.025;
export const computeSoilErosionMonetaryValue = (surfaceWithEcosystemBenefits: number) => {
  return surfaceWithEcosystemBenefits * SOIL_EROSION_MONETARY_VALUE_EURO_PER_SQUARE_METER;
};

type WaterRegulationProps = {
  prairieSurfaceArea?: number;
  wetLandSurfaceArea?: number;
  forestSurfaceArea?: number;
  decontaminatedSurfaceArea?: number;
};
const WATER_REGULATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0118;
export const computeWaterRegulationMonetaryValue = ({
  prairieSurfaceArea = 0,
  wetLandSurfaceArea = 0,
  forestSurfaceArea = 0,
  decontaminatedSurfaceArea = 0,
}: WaterRegulationProps) => {
  return (
    (forestSurfaceArea + prairieSurfaceArea + wetLandSurfaceArea + decontaminatedSurfaceArea) *
    WATER_REGULATION_MONETARY_VALUE_EURO_PER_SQUARE_METER
  );
};
