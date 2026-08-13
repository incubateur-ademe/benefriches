import { AggregatedProjectImpactMetric, DevelopmentPlanType, sumListWithKey } from "shared";

import { filterByName } from "@/shared/core/filter-by-name/filterByName";

import { ExtractDetailsKeyName } from "./group-impacts/extractDetailsKeyName.type";
import { filterNonEmptyImpacts } from "./group-impacts/filterNonEmpty";
import { findTotalByName } from "./group-impacts/findTotalByName";
import { groupImpactsByName } from "./group-impacts/groupImpactsByName";
import { withBreakdown } from "./group-impacts/withBreakdown";

export type SocialImpactMetricsByListViewCategory = ReturnType<
  typeof groupSocialMetricsByListViewCategory
>;

type JobsSectionImpacts = SocialImpactMetricsByListViewCategory["jobs"][number];
type LocalPeopleOrCompanySectionImpacts =
  SocialImpactMetricsByListViewCategory["localPeopleOrCompany"][number];
type HumanitySectionImpacts = SocialImpactMetricsByListViewCategory["humanity"][number];

export type SocialImpactMetricMainKeyName =
  | JobsSectionImpacts["keyName"]
  | LocalPeopleOrCompanySectionImpacts["keyName"]
  | HumanitySectionImpacts["keyName"];

export type SocialImpactMetricDetailsKeyName =
  | ExtractDetailsKeyName<JobsSectionImpacts, "fullTimeJobs">
  | ExtractDetailsKeyName<LocalPeopleOrCompanySectionImpacts, "avoidedTrafficAccidents">
  | ExtractDetailsKeyName<HumanitySectionImpacts, "avoidedFricheAccidents">;

export type SocialImpactMetricKeyName =
  | SocialImpactMetricMainKeyName
  | SocialImpactMetricDetailsKeyName;

function groupETPImpacts(
  items: readonly AggregatedProjectImpactMetric[],
  projectType: DevelopmentPlanType,
) {
  const conversionFullTimeJobs = groupImpactsByName(
    items,
    "fullTimeJobs.conversionFullTimeJobs",
    "conversionFullTimeJobs",
    "reinstatementFullTimeJobs",
  );
  const operationsFullTimeJobs = groupImpactsByName(
    items,
    projectType === "PHOTOVOLTAIC_POWER_PLANT"
      ? "fullTimeJobs.photovoltaicOperationsFullTimeJobs"
      : "fullTimeJobs.urbanOperationsFullTimeJobs",
    "operationsFullTimeJobs",
    "oldOperationsFullTimeJobsLoss",
  );
  const baseOperationsFullTimeJobs = findTotalByName(items, "oldOperationsFullTimeJobsLoss") * -1;
  const details = [
    conversionFullTimeJobs,
    withBreakdown(operationsFullTimeJobs, baseOperationsFullTimeJobs),
  ];

  return withBreakdown(
    {
      total: sumListWithKey(details, "total"),
      details,
      keyName: "fullTimeJobs" as const,
    },
    baseOperationsFullTimeJobs,
  );
}

export const groupSocialMetricsByListViewCategory = (
  indirectImpactMetrics: readonly AggregatedProjectImpactMetric[],
  projectType: DevelopmentPlanType,
) => {
  return {
    jobs: filterNonEmptyImpacts([groupETPImpacts(indirectImpactMetrics, projectType)]),
    localPeopleOrCompany: filterNonEmptyImpacts([
      groupImpactsByName(
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
    ]),
    humanity: filterNonEmptyImpacts([
      groupImpactsByName(
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
    ]),
  };
};
