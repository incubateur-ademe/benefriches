import { SiteYearlyExpense, SiteYearlyIncome } from "shared";

import { createStepCompletedAction } from "../../actions/actionsUtils";
import { Owner, Tenant } from "../../siteFoncier.types";

export const managementIntroductionCompleted = createStepCompletedAction("MANAGEMENT_INTRODUCTION");

export const ownerStepCompleted = createStepCompletedAction<{ owner: Owner }>("OWNER");

export const isFricheLeasedStepCompleted = createStepCompletedAction<{ isFricheLeased: boolean }>(
  "IS_FRICHE_LEASED",
);

export const isSiteOperatedStepCompleted = createStepCompletedAction<{ isSiteOperated: boolean }>(
  "IS_SITE_OPERATED",
);

export const tenantStepCompleted = createStepCompletedAction<{ tenant: Tenant | undefined }>(
  "TENANT",
);

export const operatorStepCompleted = createStepCompletedAction<{ tenant: Tenant | undefined }>(
  "OPERATOR",
);

export const yearlyExpensesAndIncomeIntroductionCompleted = createStepCompletedAction(
  "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
);

export const yearlyExpensesStepCompleted =
  createStepCompletedAction<SiteYearlyExpense[]>("YEARLY_EXPENSES");

export const yearlyExpensesSummaryCompleted = createStepCompletedAction("YEARLY_EXPENSES_SUMMARY");

export const yearlyIncomeStepCompleted =
  createStepCompletedAction<SiteYearlyIncome[]>("YEARLY_INCOME");
