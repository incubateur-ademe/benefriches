import { ReconversionProjectImpactsResult } from "../application/fetchImpactsForReconversionProject.action";

type ImpactValue = {
  base: number;
  forecast: number;
  difference: number;
};

export type SocialImpactName = SocialMainImpactName | SocialImpactDetailsName;

export type SocialMainImpactName =
  | "full_time_jobs"
  | "avoided_friche_accidents"
  | "avoided_traffic_accidents"
  | "travel_time_saved"
  | "avoided_vehicule_kilometers"
  | "households_powered_by_renewable_energy";

export type SocialImpactDetailsName =
  | "operations_full_time_jobs"
  | "conversion_full_time_jobs"
  | "avoided_friche_severe_accidents"
  | "avoided_friche_minor_accidents"
  | "avoided_traffic_minor_injuries"
  | "avoided_traffic_severe_injuries"
  | "avoided_traffic_deaths";

export type SocialImpact = {
  name: SocialMainImpactName;
  type: "default" | "etp" | "time";
  impact: ImpactValue & {
    details?: {
      name: SocialImpactDetailsName;
      impact: ImpactValue;
    }[];
  };
};

export const getSocialProjectImpacts = (
  impactsData?: ReconversionProjectImpactsResult["impacts"],
): SocialImpact[] => {
  const {
    fullTimeJobs,
    accidents,
    householdsPoweredByRenewableEnergy,
    travelTimeSaved,
    avoidedTrafficAccidents,
    avoidedVehiculeKilometers,
  } = impactsData?.social || {};

  const impacts: SocialImpact[] = [];

  if (fullTimeJobs) {
    const { conversion, operations, ...fullTimeJobsImpact } = fullTimeJobs;
    impacts.push({
      name: "full_time_jobs",
      type: "etp",
      impact: {
        ...fullTimeJobsImpact,
        details: [
          {
            name: "conversion_full_time_jobs",
            impact: conversion,
          },
          {
            name: "operations_full_time_jobs",
            impact: operations,
          },
        ],
      },
    });
  }

  if (accidents) {
    const { minorInjuries, severeInjuries, base, forecast, difference } = accidents;

    impacts.push({
      name: "avoided_friche_accidents",
      type: "default",
      impact: {
        base: forecast,
        forecast: base,
        difference: -difference,
        details: [
          {
            name: "avoided_friche_minor_accidents",
            impact: {
              base: minorInjuries.forecast,
              forecast: minorInjuries.base,
              difference: -minorInjuries.difference,
            },
          },
          {
            name: "avoided_friche_severe_accidents",
            impact: {
              base: severeInjuries.forecast,
              forecast: severeInjuries.base,
              difference: -severeInjuries.difference,
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
      type: "time",
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
        base: householdsPoweredByRenewableEnergy.base,
        forecast: householdsPoweredByRenewableEnergy.forecast,
        difference:
          householdsPoweredByRenewableEnergy.forecast - householdsPoweredByRenewableEnergy.base,
      },
    });
  }

  return impacts;
};
