import { sumListWithKey } from "shared";

import { ProjectImpactsState } from "../application/project-impacts/projectImpacts.reducer";

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
  impactsData?: ProjectImpactsState["impacts"],
): SocialImpact[] => {
  const impacts: SocialImpact[] = [];

  const fullTimeJobs = impactsData?.aggregatedReconversionImpacts.impactsMetrics.filter(
    (item) =>
      item.name === "conversionFullTimeJobs" ||
      item.name === "operationsFullTimeJobs" ||
      item.name === "oldOperationsFullTimeJobsLoss" ||
      item.name === "reinstatementFullTimeJobs",
  );

  if (fullTimeJobs && fullTimeJobs.length > 0) {
    const baseOperation =
      -1 * (fullTimeJobs.find((item) => item.name === "oldOperationsFullTimeJobsLoss")?.total ?? 0);
    const forecastOperation =
      fullTimeJobs.find((item) => item.name === "operationsFullTimeJobs")?.total ?? 0;

    const difference = sumListWithKey(fullTimeJobs, "total");

    impacts.push({
      name: "full_time_jobs",
      type: "etp",
      impact: {
        base: baseOperation,
        forecast: difference + baseOperation,
        difference: difference,
        details: [
          {
            name: "conversion_full_time_jobs",
            impact: {
              base: 0,
              forecast: difference + baseOperation - forecastOperation,
              difference: difference + baseOperation - forecastOperation,
            },
          },
          {
            name: "operations_full_time_jobs",
            impact: {
              base: baseOperation,
              forecast: forecastOperation,
              difference: forecastOperation - baseOperation,
            },
          },
        ],
      },
    });
  }

  const accidents = impactsData?.aggregatedReconversionImpacts.impactsMetrics.filter(
    (item) =>
      item.name === "avoidedFricheAccidentsDeaths" ||
      item.name === "avoidedFricheAccidentsSevereInjuries" ||
      item.name === "avoidedFricheAccidentsMinorInjuries",
  );

  if (accidents && accidents.length > 0) {
    const total = sumListWithKey(accidents, "total");

    impacts.push({
      name: "avoided_friche_accidents",
      type: "default",
      impact: {
        base: 0,
        forecast: total,
        difference: total,
        details: accidents.reduce<
          {
            name: SocialImpactDetailsName;
            impact: ImpactValue;
          }[]
        >((result, item) => {
          switch (item.name) {
            case "avoidedFricheAccidentsSevereInjuries":
              return result.concat({
                name: "avoided_friche_severe_accidents",
                impact: {
                  base: 0,
                  forecast: item.total,
                  difference: item.total,
                },
              });

            case "avoidedFricheAccidentsMinorInjuries":
              return result.concat({
                name: "avoided_friche_minor_accidents",
                impact: {
                  base: 0,
                  forecast: item.total,
                  difference: item.total,
                },
              });
            default:
              return result;
          }
        }, []),
      },
    });
  }

  const avoidedVehiculeKilometers = impactsData?.aggregatedReconversionImpacts.impactsMetrics.find(
    (item) => item.name === "avoidedVehiculeKilometers",
  )?.total;
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

  const travelTimeSaved = impactsData?.aggregatedReconversionImpacts.impactsMetrics.find(
    (item) => item.name === "timeTravelSavedInHours",
  )?.total;

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
  const avoidedTrafficAccidents = impactsData?.aggregatedReconversionImpacts.impactsMetrics.filter(
    (item) =>
      item.name === "avoidedTrafficAccidentsDeaths" ||
      item.name === "avoidedTrafficAccidentsSevereInjuries" ||
      item.name === "avoidedTrafficAccidentsMinorInjuries",
  );

  if (avoidedTrafficAccidents && avoidedTrafficAccidents.length > 0) {
    const total = sumListWithKey(avoidedTrafficAccidents, "total");

    impacts.push({
      name: "avoided_traffic_accidents",
      type: "default",
      impact: {
        base: 0,
        forecast: total,
        difference: total,
        details: avoidedTrafficAccidents.reduce<
          {
            name: SocialImpactDetailsName;
            impact: ImpactValue;
          }[]
        >((result, item) => {
          switch (item.name) {
            case "avoidedTrafficAccidentsSevereInjuries":
              return result.concat({
                name: "avoided_traffic_severe_injuries",
                impact: {
                  base: 0,
                  forecast: item.total,
                  difference: item.total,
                },
              });

            case "avoidedTrafficAccidentsMinorInjuries":
              return result.concat({
                name: "avoided_traffic_minor_injuries",
                impact: {
                  base: 0,
                  forecast: item.total,
                  difference: item.total,
                },
              });

            case "avoidedTrafficAccidentsDeaths":
              return result.concat({
                name: "avoided_traffic_deaths",
                impact: {
                  base: 0,
                  forecast: item.total,
                  difference: item.total,
                },
              });
            default:
              return result;
          }
        }, []),
      },
    });
  }
  const householdsPoweredByRenewableEnergy =
    impactsData?.aggregatedReconversionImpacts.impactsMetrics.find(
      (item) => item.name === "householdsPoweredByRenewableEnergy",
    )?.total;

  if (householdsPoweredByRenewableEnergy) {
    impacts.push({
      name: "households_powered_by_renewable_energy",
      type: "default",
      impact: {
        base: 0,
        forecast: householdsPoweredByRenewableEnergy,
        difference: householdsPoweredByRenewableEnergy,
      },
    });
  }

  return impacts;
};
