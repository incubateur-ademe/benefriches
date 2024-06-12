import { createSelector } from "@reduxjs/toolkit";
import { convertCarbonToCO2eq } from "../views/shared/convertCarbonToCO2eq";
import { ProjectImpactsState } from "./projectImpacts.reducer";

import { RootState } from "@/app/application/store";

const selectSelf = (state: RootState) => state.projectImpacts;

const selectImpactsData = createSelector(
  selectSelf,
  (state): ProjectImpactsState["impactsData"] => state.impactsData,
);

const selectCurrentFilter = createSelector(
  selectSelf,
  (state): ProjectImpactsState["currentCategoryFilter"] => state.currentCategoryFilter,
);

type ImpactValue = {
  base: number;
  forecast: number;
  difference: number;
};

export type ImpactDetails = {
  name:
    | "stored_co2_eq"
    | "avoided_co2_eq_emissions_with_production"
    | "mineral_soil"
    | "green_soil";
  impact: ImpactValue;
};

export type EnvironmentalImpactName = EnvironmentalMainImpactName | EnvironmentalImpactDetailsName;

export type EnvironmentalMainImpactName =
  | "soils_carbon_storage"
  | "non_contaminated_surface_area"
  | "permeable_surface_area"
  | "co2_benefit";

export type SoilsCarbonStorageDetails =
  | "buildings"
  | "impermeable_soils"
  | "mineral_soil"
  | "artificial_grass_or_bushes_filled"
  | "artificial_tree_filled"
  | "forest_deciduous"
  | "forest_conifer"
  | "forest_poplar"
  | "forest_mixed"
  | "prairie_grass"
  | "prairie_bushes"
  | "prairie_trees"
  | "orchard"
  | "cultivation"
  | "vineyard"
  | "wet_land"
  | "water";

export type CO2BenefitDetails = "stored_co2_eq" | "avoided_co2_eq_emissions_with_production";

export type PermeableSoilsDetails = "mineral_soil" | "green_soil";

export type EnvironmentalImpactDetailsName =
  | CO2BenefitDetails
  | PermeableSoilsDetails
  | SoilsCarbonStorageDetails;

export type EnvironmentalImpact = {
  name: EnvironmentalMainImpactName;
  type: "surfaceArea" | "co2" | "default";
  impact: ImpactValue & {
    details?: {
      name: EnvironmentalImpactDetailsName;
      impact: ImpactValue;
    }[];
  };
};

export const getEnvironmentalProjectImpacts = createSelector(
  selectCurrentFilter,
  selectImpactsData,
  (currentFilter, impactsData): EnvironmentalImpact[] => {
    const {
      nonContaminatedSurfaceArea,
      avoidedCO2TonsWithEnergyProduction,
      soilsCarbonStorage,
      permeableSurfaceArea,
    } = impactsData || {};

    const impacts: EnvironmentalImpact[] = [];
    const displayAll = currentFilter === "all";
    const displayEnvironmentData = displayAll || currentFilter === "environment";

    if (!(displayAll || displayEnvironmentData)) {
      return [];
    }

    if (nonContaminatedSurfaceArea) {
      impacts.push({
        name: "non_contaminated_surface_area",
        type: "surfaceArea",
        impact: {
          base: nonContaminatedSurfaceArea.current,
          forecast: nonContaminatedSurfaceArea.forecast,
          difference: nonContaminatedSurfaceArea.forecast - nonContaminatedSurfaceArea.current,
        },
      });
    }

    if (soilsCarbonStorage) {
      const current = soilsCarbonStorage.current.soils;
      const forecast = soilsCarbonStorage.forecast.soils;
      const soilsTypes = Array.from(new Set([...current, ...forecast].map(({ type }) => type)));

      impacts.push({
        name: "soils_carbon_storage",
        type: "co2",
        impact: {
          base: soilsCarbonStorage.current.total,
          forecast: soilsCarbonStorage.forecast.total,
          difference: soilsCarbonStorage.forecast.total - soilsCarbonStorage.current.total,
          details: soilsTypes.map((soilType) => {
            const { carbonStorage: baseCarbonStorage = 0 } =
              current.find(({ type }) => type === soilType) ?? {};
            const { carbonStorage: forecastCarbonStorage = 0 } =
              forecast.find(({ type }) => type === soilType) ?? {};
            return {
              name: soilType.toLowerCase() as SoilsCarbonStorageDetails,
              impact: {
                base: baseCarbonStorage,
                forecast: forecastCarbonStorage,
                difference: forecastCarbonStorage - baseCarbonStorage,
              },
            };
          }),
        },
      });
    }

    if (avoidedCO2TonsWithEnergyProduction || soilsCarbonStorage) {
      const details: ImpactDetails[] = [];

      if (soilsCarbonStorage) {
        const base = convertCarbonToCO2eq(soilsCarbonStorage.current.total);
        const forecast = convertCarbonToCO2eq(soilsCarbonStorage.forecast.total);

        details.push({
          name: "stored_co2_eq",
          impact: { base, forecast, difference: forecast - base },
        });
      }

      if (avoidedCO2TonsWithEnergyProduction) {
        details.push({
          name: "avoided_co2_eq_emissions_with_production",
          impact: {
            base: avoidedCO2TonsWithEnergyProduction.current,
            forecast: avoidedCO2TonsWithEnergyProduction.forecast,
            difference: avoidedCO2TonsWithEnergyProduction.forecast,
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

    if (permeableSurfaceArea) {
      const { base, forecast, mineralSoil, greenSoil } = permeableSurfaceArea;

      impacts.push({
        name: "permeable_surface_area",
        type: "surfaceArea",
        impact: {
          base,
          forecast,
          difference: forecast - base,
          details: [
            {
              name: "mineral_soil",
              impact: {
                base: mineralSoil.base,
                forecast: mineralSoil.forecast,
                difference: mineralSoil.forecast - mineralSoil.base,
              },
            },
            {
              name: "green_soil",
              impact: {
                base: greenSoil.base,
                forecast: greenSoil.forecast,
                difference: greenSoil.forecast - greenSoil.base,
              },
            },
          ],
        },
      });
    }

    return impacts;
  },
);
