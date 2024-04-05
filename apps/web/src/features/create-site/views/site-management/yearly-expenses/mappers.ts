import { FormValues } from "./SiteYearlyExpensesForm";

import { Expense } from "@/features/create-site/domain/siteFoncier.types";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";

const expensesConfig = [
  { purpose: "rent", purposeCategory: "rent", defaultBearer: "tenant" },
  { purpose: "propertyTaxes", purposeCategory: "taxes", defaultBearer: "owner" },
  { purpose: "operationsTaxes", purposeCategory: "taxes", defaultBearer: "tenant" },
  { purpose: "maintenance", purposeCategory: "site_management", defaultBearer: "tenant" },
  { purpose: "otherManagementCosts", purposeCategory: "site_management", defaultBearer: "tenant" },
  { purpose: "security", purposeCategory: "safety", defaultBearer: "tenant" },
  { purpose: "illegalDumpingCost", purposeCategory: "safety", defaultBearer: "tenant" },
  { purpose: "accidentsCost", purposeCategory: "safety", defaultBearer: "tenant" },
  { purpose: "otherSecuringCosts", purposeCategory: "safety", defaultBearer: "tenant" },
] as const;

const getDefaultBearerForExpense = (
  expenseConfig: (typeof expensesConfig)[number],
  siteHasTenant: boolean,
): Expense["bearer"] => {
  if (!siteHasTenant) return "owner";

  return expenseConfig.defaultBearer;
};

export const mapFormDataToExpenses = (
  formData: FormValues,
  { siteHasTenant }: { siteHasTenant: boolean },
): Expense[] => {
  return typedObjectKeys(formData).reduce<Expense[]>((acc, key) => {
    const formValue = formData[key];
    const expenseConfig = expensesConfig.find((e) => e.purpose === key);
    if (!formValue.amount || !expenseConfig) return acc;

    const expense: Expense = {
      amount: formValue.amount,
      bearer:
        "bearer" in formValue && formValue.bearer
          ? formValue.bearer
          : getDefaultBearerForExpense(expenseConfig, siteHasTenant),
      purpose: expenseConfig.purpose,
      purposeCategory: expenseConfig.purposeCategory,
    };
    return [...acc, expense];
  }, []);
};
