import type { ProjectEconomicBalance } from "shared";

import type { ProjectImpactsState } from "../application/project-impacts/projectImpacts.reducer";
import type { ProjectDevelopmentPlanType } from "../core/projects.types";
import { extractDetailsGroup } from "./group-impacts/extractDetailsGroup";
import { filterNonEmptyImpacts } from "./group-impacts/filterNonEmpty";
import { groupImpactsByName } from "./group-impacts/groupImpactsByName";

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
  EconomicBalanceMainImpactKeyName | EconomicBalanceDetailsImpactKeyName;

export const groupEconomicBalanceByListViewCategory = (
  projectType: ProjectDevelopmentPlanType,
  projectEconomicBalance: ProjectEconomicBalance["details"],
  bearerName?: string,
) => {
  return filterNonEmptyImpacts([
    groupImpactsByName(
      projectEconomicBalance,
      "realEstateAcquisition",
      "sitePurchase",
      "siteResaleRevenue",
      "buildingsResaleRevenue",
    ),
    extractDetailsGroup(projectEconomicBalance, "siteReinstatement", {
      bearerName: bearerName,
    }),
    extractDetailsGroup(projectEconomicBalance, "projectInstallation", {
      keyGroupName:
        projectType === "PHOTOVOLTAIC_POWER_PLANT"
          ? "photovoltaicProjectInstallation"
          : "urbanProjectInstallation",
      bearerName: bearerName,
    }),
    extractDetailsGroup(projectEconomicBalance, "projectBuildingsInstallation", {
      bearerName: bearerName,
    }),
    extractDetailsGroup(projectEconomicBalance, "financialAssistanceRevenues", {
      bearerName: bearerName,
    }),
    extractDetailsGroup(projectEconomicBalance, "projectOperatingExpenses", {
      bearerName: bearerName,
    }),
    extractDetailsGroup(projectEconomicBalance, "projectOperatingRevenues", {
      bearerName: bearerName,
    }),
  ]);
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
    impactsData.stakeholders.project.developer.structureName,
  );

  return {
    total: impactsData.projectEconomicBalance.total,
    bearerName: impactsData.stakeholders.project.developer.structureName,
    economicBalance,
  };
};
