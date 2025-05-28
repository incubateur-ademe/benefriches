import { ReconversionProjectImpactsResult } from "../application/fetchImpactsForReconversionProject.action";

type ImpactValue = {
  base: number;
  forecast: number;
  difference: number;
};

type ImpactDetails = {
  name: EnvironmentalImpactDetailsName;
  impact: ImpactValue;
};

export type EnvironmentalMainImpactName =
  | "non_contaminated_surface_area"
  | "permeable_surface_area"
  | "co2_benefit";

export type CO2BenefitDetails =
  | "stored_co2_eq"
  | "avoided_co2_eq_emissions_with_production"
  | "avoided_air_conditioning_co2_eq_emissions"
  | "avoided_car_traffic_co2_eq_emissions";

export type PermeableSoilsDetails = "mineral_soil" | "green_soil";

export type EnvironmentalImpactDetailsName = CO2BenefitDetails | PermeableSoilsDetails;

export type EnvironmentalImpact = {
  name: EnvironmentalMainImpactName;
  type: "surface_area" | "co2" | "default";
  impact: ImpactValue & {
    details?: {
      name: EnvironmentalImpactDetailsName;
      impact: ImpactValue;
    }[];
  };
};

export const getEnvironmentalProjectImpacts = (
  impactsData?: ReconversionProjectImpactsResult["impacts"],
): EnvironmentalImpact[] => {
  if (!impactsData) return [];
  const {
    nonContaminatedSurfaceArea,
    avoidedCo2eqEmissions,
    soilsCo2eqStorage,
    permeableSurfaceArea,
  } = impactsData.environmental;

  const impacts: EnvironmentalImpact[] = [];

  if (nonContaminatedSurfaceArea && nonContaminatedSurfaceArea.difference !== 0) {
    impacts.push({
      name: "non_contaminated_surface_area",
      type: "surface_area",
      impact: {
        base: nonContaminatedSurfaceArea.base,
        forecast: nonContaminatedSurfaceArea.forecast,
        difference: nonContaminatedSurfaceArea.difference,
      },
    });
  }

  if (avoidedCo2eqEmissions || soilsCo2eqStorage) {
    const details: ImpactDetails[] = [];

    if (soilsCo2eqStorage) {
      details.push({
        name: "stored_co2_eq",
        impact: soilsCo2eqStorage,
      });
    }

    if (avoidedCo2eqEmissions?.withRenewableEnergyProduction) {
      details.push({
        name: "avoided_co2_eq_emissions_with_production",
        impact: {
          base: 0,
          forecast: avoidedCo2eqEmissions.withRenewableEnergyProduction,
          difference: avoidedCo2eqEmissions.withRenewableEnergyProduction,
        },
      });
    }

    if (avoidedCo2eqEmissions?.withAirConditioningDiminution) {
      details.push({
        name: "avoided_air_conditioning_co2_eq_emissions",
        impact: {
          base: 0,
          forecast: avoidedCo2eqEmissions.withAirConditioningDiminution,
          difference: avoidedCo2eqEmissions.withAirConditioningDiminution,
        },
      });
    }

    if (avoidedCo2eqEmissions?.withCarTrafficDiminution) {
      details.push({
        name: "avoided_car_traffic_co2_eq_emissions",
        impact: {
          base: 0,
          forecast: avoidedCo2eqEmissions.withCarTrafficDiminution,
          difference: avoidedCo2eqEmissions.withCarTrafficDiminution,
        },
      });
    }

    if (details.length > 0) {
      impacts.push({
        name: "co2_benefit",
        type: "co2",
        impact: {
          ...details.reduce(
            (result, { impact }) => ({
              base: result.base + impact.base,
              forecast: result.forecast + impact.forecast,
              difference: result.difference + impact.difference,
            }),
            { base: 0, forecast: 0, difference: 0 },
          ),
          details,
        },
      });
    }
  }

  const { base, forecast, difference, mineralSoil, greenSoil } = permeableSurfaceArea;

  impacts.push({
    name: "permeable_surface_area",
    type: "surface_area",
    impact: {
      base,
      forecast,
      difference,
      details: [
        {
          name: "mineral_soil",
          impact: {
            base: mineralSoil.base,
            forecast: mineralSoil.forecast,
            difference: mineralSoil.difference,
          },
        },
        {
          name: "green_soil",
          impact: {
            base: greenSoil.base,
            forecast: greenSoil.forecast,
            difference: greenSoil.difference,
          },
        },
      ],
    },
  });

  return impacts;
};
