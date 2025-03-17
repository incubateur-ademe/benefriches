import { SiteYearlyExpense, SiteYearlyIncome } from "shared";

import { Owner, Tenant } from "../siteFoncier.types";
import { createStepCompletedAction, createStepRevertedAction } from "./actionsUtils";

export const managementIntroductionCompleted = createStepCompletedAction("MANAGEMENT_INTRODUCTION");
export const managementIntroductionReverted = createStepRevertedAction("MANAGEMENT_INTRODUCTION");

export const ownerStepCompleted = createStepCompletedAction<{ owner: Owner }>("OWNER");
export const ownerStepReverted = () =>
  createStepRevertedAction("OWNER")({ resetFields: ["owner"] });

export const isFricheLeasedStepCompleted = createStepCompletedAction<{ isFricheLeased: boolean }>(
  "IS_FRICHE_LEASED",
);
export const isFricheLeasedStepReverted = () =>
  createStepRevertedAction("IS_FRICHE_LEASED")({ resetFields: ["isFricheLeased"] });

export const isSiteOperatedStepCompleted = createStepCompletedAction<{ isSiteOperated: boolean }>(
  "IS_SITE_OPERATED",
);
export const isSiteOperatedStepReverted = () =>
  createStepRevertedAction("IS_SITE_OPERATED")({ resetFields: ["isSiteOperated"] });

export const tenantStepCompleted = createStepCompletedAction<{ tenant: Tenant | undefined }>(
  "TENANT",
);
export const tenantStepReverted = () =>
  createStepRevertedAction("TENANT")({ resetFields: ["tenant"] });

export const operatorStepCompleted = createStepCompletedAction<{ tenant: Tenant | undefined }>(
  "OPERATOR",
);
export const operatorStepReverted = () =>
  createStepRevertedAction("OPERATOR")({ resetFields: ["tenant"] });

export const yearlyExpensesAndIncomeIntroductionCompleted = createStepCompletedAction(
  "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
);
export const yearlyExpensesAndIncomeIntroductionReverted = createStepRevertedAction(
  "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
);

export const yearlyExpensesStepCompleted =
  createStepCompletedAction<SiteYearlyExpense[]>("YEARLY_EXPENSES");
export const yearlyExpensesStepReverted = () =>
  createStepRevertedAction("YEARLY_EXPENSES")({ resetFields: ["yearlyExpenses"] });

export const yearlyExpensesSummaryCompleted = createStepCompletedAction("YEARLY_EXPENSES_SUMMARY");
export const yearlyExpensesSummaryReverted = createStepRevertedAction("YEARLY_EXPENSES_SUMMARY");

export const yearlyIncomeStepCompleted =
  createStepCompletedAction<SiteYearlyIncome[]>("YEARLY_INCOME");
export const yearlyIncomeStepReverted = () =>
  createStepRevertedAction("YEARLY_INCOME")({ resetFields: ["yearlyIncomes"] });
