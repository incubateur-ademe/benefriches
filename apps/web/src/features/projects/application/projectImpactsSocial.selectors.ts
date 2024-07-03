import { createSelector } from "@reduxjs/toolkit";
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

export type SocialImpactName = SocialMainImpactName | SocialImpactDetailsName;

type SocialMainImpactName =
  | "full_time_jobs"
  | "avoided_friche_accidents"
  | "avoided_traffic_accidents"
  | "travel_time_saved"
  | "avoided_vehicule_kilometers"
  | "households_powered_by_renewable_energy";

type SocialImpactDetailsName =
  | "operations_full_time_jobs"
  | "conversion_full_time_jobs"
  | "avoided_friche_severe_accidents"
  | "avoided_friche_minor_accidents"
  | "avoided_traffic_minor_injuries"
  | "avoided_traffic_severe_injuries"
  | "avoided_traffic_deaths";

export type SocialImpact = {
  name: SocialMainImpactName;
  type: "default";
  impact: ImpactValue & {
    details?: {
      name: SocialImpactDetailsName;
      impact: ImpactValue;
    }[];
  };
};

export const getSocialProjectImpacts = createSelector(
  selectCurrentFilter,
  selectImpactsData,
  (currentFilter, impactsData): SocialImpact[] => {
    const {
      fullTimeJobs,
      accidents,
      householdsPoweredByRenewableEnergy,
      travelTimeSaved,
      avoidedTrafficAccidents,
      avoidedVehiculeKilometers,
    } = impactsData || {};

    const impacts: SocialImpact[] = [];
    const displayAll = currentFilter === "all";
    const displaySocialData = displayAll || currentFilter === "social";

    if (!(displayAll || displaySocialData)) {
      return [];
    }

    if (fullTimeJobs) {
      const { current, forecast, conversion, operations } = fullTimeJobs;
      impacts.push({
        name: "full_time_jobs",
        type: "default",
        impact: {
          base: current,
          forecast,
          difference: forecast - current,
          details: [
            {
              name: "conversion_full_time_jobs",
              impact: {
                base: conversion.current,
                forecast: conversion.forecast,
                difference: conversion.forecast - conversion.current,
              },
            },
            {
              name: "operations_full_time_jobs",
              impact: {
                base: operations.current,
                forecast: operations.forecast,
                difference: operations.forecast - operations.current,
              },
            },
          ],
        },
      });
    }

    if (accidents) {
      const { current, forecast, minorInjuries, severeInjuries } = accidents;

      impacts.push({
        name: "avoided_friche_accidents",
        type: "default",
        impact: {
          base: forecast,
          forecast: current,
          difference: current - forecast,
          details: [
            {
              name: "avoided_friche_minor_accidents",
              impact: {
                base: minorInjuries.forecast,
                forecast: minorInjuries.current,
                difference: minorInjuries.current - minorInjuries.forecast,
              },
            },
            {
              name: "avoided_friche_severe_accidents",
              impact: {
                base: severeInjuries.forecast,
                forecast: severeInjuries.current,
                difference: severeInjuries.current - severeInjuries.forecast,
              },
            },
          ],
        },
      });
    }

    if (avoidedVehiculeKilometers) {
      impacts.push({
        name: "avoided_vehicule_kilometers",
        type: "default",
        impact: {
          base: 0,
          forecast: avoidedVehiculeKilometers,
          difference: avoidedVehiculeKilometers,
        },
      });
    }

    if (travelTimeSaved) {
      impacts.push({
        name: "travel_time_saved",
        type: "default",
        impact: {
          base: 0,
          forecast: travelTimeSaved,
          difference: travelTimeSaved,
        },
      });
    }

    if (avoidedTrafficAccidents) {
      const details: SocialImpact["impact"]["details"] = [];
      if (avoidedTrafficAccidents.minorInjuries) {
        details.push({
          name: "avoided_traffic_minor_injuries",
          impact: {
            base: 0,
            forecast: avoidedTrafficAccidents.minorInjuries,
            difference: avoidedTrafficAccidents.minorInjuries,
          },
        });
      }

      if (avoidedTrafficAccidents.severeInjuries) {
        details.push({
          name: "avoided_traffic_severe_injuries",
          impact: {
            base: 0,
            forecast: avoidedTrafficAccidents.severeInjuries,
            difference: avoidedTrafficAccidents.severeInjuries,
          },
        });
      }

      if (avoidedTrafficAccidents.deaths) {
        details.push({
          name: "avoided_traffic_deaths",
          impact: {
            base: 0,
            forecast: avoidedTrafficAccidents.deaths,
            difference: avoidedTrafficAccidents.deaths,
          },
        });
      }

      impacts.push({
        name: "avoided_traffic_accidents",
        type: "default",
        impact: {
          base: 0,
          forecast: avoidedTrafficAccidents.total,
          difference: avoidedTrafficAccidents.total,
          details,
        },
      });
    }

    if (householdsPoweredByRenewableEnergy) {
      impacts.push({
        name: "households_powered_by_renewable_energy",
        type: "default",
        impact: {
          base: householdsPoweredByRenewableEnergy.current,
          forecast: householdsPoweredByRenewableEnergy.forecast,
          difference:
            householdsPoweredByRenewableEnergy.forecast -
            householdsPoweredByRenewableEnergy.current,
        },
      });
    }

    return impacts;
  },
);
