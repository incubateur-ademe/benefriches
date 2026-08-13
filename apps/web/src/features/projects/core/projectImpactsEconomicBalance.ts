import { ProjectEconomicBalance } from "shared";

import { ProjectImpactsState } from "../application/project-impacts/projectImpacts.reducer";
import { ProjectDevelopmentPlanType } from "../core/projects.types";
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
  | EconomicBalanceMainImpactKeyName
  | EconomicBalanceDetailsImpactKeyName;

export const groupEconomicBalanceByListViewCategory = (
  projectType: ProjectDevelopmentPlanType,
  projectEconomicBalance: ProjectEconomicBalance["details"],
) => {
  return filterNonEmptyImpacts([
    groupImpactsByName(
      projectEconomicBalance,
      "realEstateAcquisition",
      "sitePurchase",
      "siteResaleRevenue",
      "buildingsResaleRevenue",
    ),
    extractDetailsGroup(projectEconomicBalance, "siteReinstatement"),
    extractDetailsGroup(projectEconomicBalance, "projectInstallation", {
      keyGroupName:
        projectType === "PHOTOVOLTAIC_POWER_PLANT"
          ? "photovoltaicProjectInstallation"
          : "urbanProjectInstallation",
    }),
    extractDetailsGroup(projectEconomicBalance, "projectBuildingsInstallation"),
    extractDetailsGroup(projectEconomicBalance, "financialAssistanceRevenues"),
    extractDetailsGroup(projectEconomicBalance, "projectOperatingExpenses"),
    extractDetailsGroup(projectEconomicBalance, "projectOperatingRevenues"),
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
  );

  return {
    total: impactsData.projectEconomicBalance.total,
    bearerName: impactsData.stakeholders.project.developer.structureName,
    economicBalance,
  };
};
