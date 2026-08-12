import { AggregatedProjectImpactMetric, DevelopmentPlanType, sumListWithKey } from "shared";

import { filterByName } from "@/shared/core/filter-by-name/filterByName";

export type SocialImpactMetricKeyName =
  | SocialImpactMetricMainKeyName
  | SocialImpactMetricDetailsKeyName;

export type SocialImpactMetricsByListViewCategory = ReturnType<
  typeof groupSocialMetricsByListViewCategory
>;
export type SocialImpactMetricMainKeyName =
  | JobsSectionImpacts["keyName"]
  | LocalPeopleOrCompanySectionImpacts["keyName"]
  | HumanitySectionImpacts["keyName"];

export type SocialImpactMetricDetailsKeyName =
  | ExtractDetails<JobsSectionImpacts, "fullTimeJobs">
  | ExtractDetails<LocalPeopleOrCompanySectionImpacts, "avoidedTrafficAccidents">
  | ExtractDetails<HumanitySectionImpacts, "avoidedFricheAccidents">;

type JobsSectionImpacts = SocialImpactMetricsByListViewCategory["jobs"][number];
type LocalPeopleOrCompanySectionImpacts =
  SocialImpactMetricsByListViewCategory["localPeopleOrCompany"][number];
type HumanitySectionImpacts = SocialImpactMetricsByListViewCategory["humanity"][number];

type ExtractDetails<
  T extends JobsSectionImpacts | LocalPeopleOrCompanySectionImpacts | HumanitySectionImpacts,
  N extends "fullTimeJobs" | "avoidedTrafficAccidents" | "avoidedFricheAccidents",
> = Extract<
  T,
  {
    keyName: N;
  }
>["details"][number]["keyName"];

function groupImpacts<
  T extends AggregatedProjectImpactMetric,
  G extends string,
  N extends T["name"],
>(items: readonly T[], groupName: G, ...names: N[]) {
  const details = filterByName(items, ...names).map((item) => ({
    name: item.name,
    total: item.total,
    keyName: `${groupName}.${item.name}` as const,
  }));

  return {
    total: sumListWithKey(details, "total"),
    details,
    keyName: groupName,
  };
}

function groupETPImpacts(
  items: readonly AggregatedProjectImpactMetric[],
  projectType: DevelopmentPlanType,
) {
  const details = [
    groupImpacts(
      items,
      `fullTimeJobs.conversionFullTimeJobs`,
      "conversionFullTimeJobs",
      "reinstatementFullTimeJobs",
    ),
    groupImpacts(
      items,
      projectType === "PHOTOVOLTAIC_POWER_PLANT"
        ? `fullTimeJobs.photovoltaicOperationsFullTimeJobs`
        : `fullTimeJobs.urbanOperationsFullTimeJobs`,
      "operationsFullTimeJobs",
      "oldOperationsFullTimeJobsLoss",
    ),
  ];

  return {
    total: sumListWithKey(details, "total"),
    details,
    keyName: "fullTimeJobs" as const,
  };
}

export const groupSocialMetricsByListViewCategory = (
  indirectImpactMetrics: readonly AggregatedProjectImpactMetric[],
  projectType: DevelopmentPlanType,
) => {
  return {
    jobs: [groupETPImpacts(indirectImpactMetrics, projectType)].filter(
      (item) => ("details" in item && item.details.length !== 0) || item.total !== 0,
    ),
    localPeopleOrCompany: [
      groupImpacts(
        indirectImpactMetrics,
        "avoidedTrafficAccidents",
        "avoidedTrafficAccidentsDeaths",
        "avoidedTrafficAccidentsSevereInjuries",
        "avoidedTrafficAccidentsMinorInjuries",
      ),
      ...filterByName(
        indirectImpactMetrics,
        "timeTravelSavedInHours",
        "avoidedVehiculeKilometers",
      ).map((item) => ({
        name: item.name,
        total: item.total,
        keyName: item.name,
      })),
    ].filter((item) => ("details" in item && item.details.length !== 0) || item.total !== 0),
    humanity: [
      groupImpacts(
        indirectImpactMetrics,
        "avoidedFricheAccidents",
        "avoidedFricheAccidentsDeaths",
        "avoidedFricheAccidentsSevereInjuries",
        "avoidedFricheAccidentsMinorInjuries",
      ),
      ...filterByName(indirectImpactMetrics, "householdsPoweredByRenewableEnergy").map((item) => ({
        name: item.name,
        total: item.total,
        keyName: item.name,
      })),
    ].filter((item) => ("details" in item && item.details.length !== 0) || item.total !== 0),
  };
};
