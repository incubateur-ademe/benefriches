import { typedObjectEntries, type SiteYearlyExpense, type SiteYearlyIncome } from "shared";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../../stateHelpers";
import type { UrbanZoneStepsState } from "../../../urbanZoneSteps";

export type ExpensesAndIncomeSummaryViewData = {
  expenses: SiteYearlyExpense[];
  incomes: SiteYearlyIncome[];
  ownerExpenses: SiteYearlyExpense[];
  ownerIncome: SiteYearlyIncome[];
};

function toExpenses(
  amounts: Record<string, number | undefined>,
  bearer: "owner" | "tenant",
  purposeMap: Record<string, SiteYearlyExpense["purpose"]>,
): SiteYearlyExpense[] {
  return typedObjectEntries(amounts).reduce<SiteYearlyExpense[]>((acc, [key, amount]) => {
    const purpose = purposeMap[key];
    if (typeof amount === "number" && amount > 0 && purpose !== undefined) {
      acc.push({ purpose, amount, bearer });
    }
    return acc;
  }, []);
}

export const getExpensesAndIncomeSummaryViewData = (
  stepsState: UrbanZoneStepsState,
): ExpensesAndIncomeSummaryViewData => {
  const vacantExpenses = ReadStateHelper.getStepAnswers(
    stepsState,
    "URBAN_ZONE_VACANT_PREMISES_EXPENSES",
  );
  const zoneExpenses = ReadStateHelper.getStepAnswers(
    stepsState,
    "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES",
  );
  const zoneIncome = ReadStateHelper.getStepAnswers(
    stepsState,
    "URBAN_ZONE_ZONE_MANAGEMENT_INCOME",
  );
  const localAuthorityExpenses = ReadStateHelper.getStepAnswers(
    stepsState,
    "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES",
  );

  const ownerPurposeMap: Record<string, SiteYearlyExpense["purpose"]> = {
    ownerPropertyTaxes: "propertyTaxes",
    ownerMaintenance: "maintenance",
    ownerSecurity: "security",
    ownerIllegalDumpingCost: "illegalDumpingCost",
    ownerOtherManagementCosts: "otherManagementCosts",
    propertyTaxes: "propertyTaxes",
    maintenance: "maintenance",
    security: "security",
    illegalDumpingCost: "illegalDumpingCost",
    otherManagementCosts: "otherManagementCosts",
  };

  const tenantPurposeMap: Record<string, SiteYearlyExpense["purpose"]> = {
    tenantRent: "rent",
    tenantOperationsTaxes: "operationsTaxes",
    tenantOtherOperationsCosts: "otherOperationsCosts",
  };

  const incomePurposeMap: Record<string, SiteYearlyIncome["source"]> = {
    rent: "rent",
    subsidies: "subsidies",
    otherIncome: "other",
  };

  const expenses: SiteYearlyExpense[] = [
    ...toExpenses(
      {
        ownerPropertyTaxes: vacantExpenses?.ownerPropertyTaxes,
        ownerMaintenance: vacantExpenses?.ownerMaintenance,
        ownerSecurity: vacantExpenses?.ownerSecurity,
        ownerIllegalDumpingCost: vacantExpenses?.ownerIllegalDumpingCost,
        ownerOtherManagementCosts: vacantExpenses?.ownerOtherManagementCosts,
      },
      "owner",
      ownerPurposeMap,
    ),
    ...toExpenses(
      {
        tenantRent: vacantExpenses?.tenantRent,
        tenantOperationsTaxes: vacantExpenses?.tenantOperationsTaxes,
        tenantOtherOperationsCosts: vacantExpenses?.tenantOtherOperationsCosts,
      },
      "tenant",
      tenantPurposeMap,
    ),
    ...toExpenses(zoneExpenses ?? {}, "owner", ownerPurposeMap),
    ...toExpenses(localAuthorityExpenses ?? {}, "owner", ownerPurposeMap),
  ];

  const incomes: SiteYearlyIncome[] = typedObjectEntries(zoneIncome ?? {}).reduce<
    SiteYearlyIncome[]
  >((acc, [key, amount]) => {
    const source = incomePurposeMap[key];
    if (typeof amount === "number" && amount > 0 && source !== undefined) {
      acc.push({ source, amount });
    }
    return acc;
  }, []);

  const ownerExpenses = expenses.filter((e) => e.bearer === "owner");
  const tenantRentAsIncome: SiteYearlyIncome[] = expenses
    .filter((e) => e.bearer === "tenant" && e.purpose === "rent")
    .map((e) => ({ source: "rent" as const, amount: e.amount }));
  const ownerIncome = [...incomes, ...tenantRentAsIncome];

  return { expenses, incomes, ownerExpenses, ownerIncome };
};

export const selectExpensesAndIncomeSummaryViewData = (
  state: RootState,
): ExpensesAndIncomeSummaryViewData => {
  return getExpensesAndIncomeSummaryViewData(state.siteCreation.urbanZone.steps);
};
