import { Expense } from "@/features/create-site/domain/siteFoncier.types";

import { FormValues } from "./SiteYearlyExpensesForm";

const PURPOSE_CATEGORIES = {
  rent: "rent",
  propertyTaxes: "taxes",
  operationsTaxes: "taxes",
  maintenance: "site_management",
  otherManagementCosts: "site_management",
  security: "safety",
  illegalDumpingCost: "safety",
  accidentsCost: "safety",
  otherSecuringCosts: "safety",
} as const;

export const mapFormDataToExpenses = (
  formData: FormValues,
  expectedExpenses: { name: Expense["purpose"]; bearer?: "tenant" | "owner" }[],
): Expense[] =>
  expectedExpenses
    .map(({ name, bearer }) => ({
      purpose: name,
      bearer: bearer ?? formData[name]?.bearer ?? "tenant",
      amount: formData[name]?.amount,
      purposeCategory: PURPOSE_CATEGORIES[name],
    }))
    .filter(({ amount }) => !!amount) as Expense[];

export const getSiteManagementExpensesWithBearer = (
  isFriche: boolean,
  isWorked: boolean,
  hasTenant: boolean,
): { name: Expense["purpose"]; bearer?: "tenant" | "owner" }[] => {
  const isFricheLeased = isFriche && hasTenant;
  const isSiteOperatedByTenant = !isFriche && isWorked && hasTenant;
  if (isFricheLeased) {
    return [
      { name: "rent", bearer: "tenant" },
      { name: "maintenance", bearer: "tenant" },
      { name: "propertyTaxes", bearer: "owner" },
      { name: "otherManagementCosts", bearer: undefined },
    ];
  }
  if (isSiteOperatedByTenant) {
    return [
      { name: "rent", bearer: "tenant" },
      { name: "operationsTaxes", bearer: "tenant" },
      { name: "maintenance", bearer: "tenant" },
      { name: "propertyTaxes", bearer: "owner" },
      { name: "otherManagementCosts", bearer: undefined },
    ];
  }

  const isSiteOperatedByOwner = !isFriche && isWorked;
  if (isSiteOperatedByOwner) {
    return [
      { name: "operationsTaxes", bearer: "owner" },
      { name: "maintenance", bearer: "owner" },
      { name: "propertyTaxes", bearer: "owner" },
      { name: "otherManagementCosts", bearer: "owner" },
    ];
  }

  return [
    { name: "maintenance", bearer: "owner" },
    { name: "propertyTaxes", bearer: "owner" },
    { name: "otherManagementCosts", bearer: "owner" },
  ];
};

export const getSiteSecurityExpensesWithBearer = (
  hasTenant: boolean,
  hasRecentAccidents: boolean,
) => {
  const expensesOwner = hasTenant ? undefined : "owner";
  const expenses = [
    { name: "security", bearer: expensesOwner },
    { name: "illegalDumpingCost", bearer: expensesOwner },
    { name: "otherSecuringCosts", bearer: expensesOwner },
  ];
  if (hasRecentAccidents) {
    expenses.push({ name: "accidentsCost", bearer: expensesOwner });
  }
  return expenses as { name: Expense["purpose"]; bearer?: "tenant" | "owner" }[];
};
