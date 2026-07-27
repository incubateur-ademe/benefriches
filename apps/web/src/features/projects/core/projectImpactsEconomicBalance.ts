import { ProjectEconomicBalance, sumListWithKey } from "shared";

import { filterByName } from "@/shared/core/filter-by-name/filterByName";

import { ProjectImpactsState } from "../application/project-impacts/projectImpacts.reducer";
import { ProjectDevelopmentPlanType } from "../core/projects.types";

type EconomicBalanceByListViewCategory = ReturnType<typeof groupEconomicBalanceByListViewCategory>;

export type EconomicBalanceByCategory = {
  total: number;
  bearerName?: string;
  economicBalance: EconomicBalanceByListViewCategory;
};

export type EconomicBalanceMainImpactKeyName = EconomicBalanceByListViewCategory[number]["keyName"];
export type EconomicBalanceDetailsImpactKeyName =
  EconomicBalanceByListViewCategory[number]["details"][number]["keyName"];

export type EconomicBalanceImpactKeyName =
  | EconomicBalanceMainImpactKeyName
  | EconomicBalanceDetailsImpactKeyName;

function extractDetails<
  T extends ProjectEconomicBalance["details"][number],
  G extends Exclude<
    T["name"],
    "projectInstallation" | "sitePurchase" | "siteResaleRevenue" | "buildingsResaleRevenue"
  >,
>(
  items: readonly T[],
  groupName: G,
): {
  total: number;
  keyName: G;
  details: {
    name: Extract<T, { name: G }>["details"];
    total: number;
    keyName: `${G}.${Extract<T, { name: G }>["details"]}`;
  }[];
};

function extractDetails<
  T extends ProjectEconomicBalance["details"][number],
  G extends "projectInstallation",
>(
  items: readonly T[],
  groupName: G,
  keyGroupName: "photovoltaicProjectInstallation" | "urbanProjectInstallation",
): {
  total: number;
  keyName: typeof keyGroupName;
  details: {
    name: Extract<T, { name: G }>["details"];
    total: number;
    keyName: `${typeof keyGroupName}.${Extract<T, { name: G }>["details"]}`;
  }[];
};

function extractDetails<
  T extends ProjectEconomicBalance["details"][number],
  G extends Exclude<T["name"], "sitePurchase" | "siteResaleRevenue" | "buildingsResaleRevenue">,
>(
  items: readonly T[],
  groupName: G,
  keyGroupName?: "photovoltaicProjectInstallation" | "urbanProjectInstallation",
) {
  const details = filterByName(items, groupName).map((item) => ({
    name: item.details as Extract<T, { name: G }>["details"],
    total: item.total,
    keyName: `${keyGroupName ?? groupName}.${item.details}`,
  }));

  return {
    total: sumListWithKey(details, "total"),
    details,
    keyName: keyGroupName ?? groupName,
  };
}

function groupImpacts<T extends ProjectEconomicBalance["details"][number], G extends string>(
  items: readonly T[],
  groupName: G,
  impactList: Extract<T["name"], "sitePurchase" | "siteResaleRevenue" | "buildingsResaleRevenue">[],
) {
  const details = filterByName(items, ...impactList).map((item) => ({
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

export const groupEconomicBalanceByListViewCategory = (
  projectType: ProjectDevelopmentPlanType,
  projectEconomicBalance: ProjectEconomicBalance["details"],
) => {
  return [
    groupImpacts(projectEconomicBalance, "realEstateAcquisition", [
      "sitePurchase",
      "siteResaleRevenue",
      "buildingsResaleRevenue",
    ]),
    extractDetails(projectEconomicBalance, "siteReinstatement"),
    extractDetails(
      projectEconomicBalance,
      "projectInstallation",
      projectType === "PHOTOVOLTAIC_POWER_PLANT"
        ? "photovoltaicProjectInstallation"
        : "urbanProjectInstallation",
    ),
    extractDetails(projectEconomicBalance, "projectBuildingsInstallation"),
    extractDetails(projectEconomicBalance, "financialAssistanceRevenues"),
    extractDetails(projectEconomicBalance, "projectOperatingExpenses"),
    extractDetails(projectEconomicBalance, "projectOperatingRevenues"),
  ].filter((item) => item.details.length !== 0);
};

export const buildEconomicBalanceListView = (
  projectType: ProjectDevelopmentPlanType,
  impactsData?: ProjectImpactsState["impacts"],
): EconomicBalanceByCategory => {
  if (!impactsData) {
    return {
      total: 0,
      economicBalance: [],
    };
  }

  const economicBalance = groupEconomicBalanceByListViewCategory(
    projectType,
    impactsData.projectEconomicBalance.details,
  );

  return {
    total: impactsData.projectEconomicBalance.total,
    bearerName: impactsData.stakeholders.project.developer.structureName,
    economicBalance,
  };
};
