import { SiteYearlyExpense, SiteYearlyExpensePurpose } from "shared";

import { FormValues } from "./SiteYearlyExpensesForm";

export const mapFormDataToExpenses = (
  formData: FormValues,
  expectedExpenses: { name: SiteYearlyExpensePurpose; bearer?: "tenant" | "owner" }[],
): SiteYearlyExpense[] =>
  expectedExpenses
    .map(({ name, bearer }) => ({
      purpose: name,
      bearer: bearer ?? formData[name]?.bearer ?? "tenant",
      amount: formData[name]?.amount,
    }))
    .filter(({ amount }) => !!amount) as SiteYearlyExpense[];

export const getSiteManagementExpensesWithBearer = (
  isFriche: boolean,
  isWorked: boolean,
  hasTenant: boolean,
): { name: SiteYearlyExpensePurpose; bearer?: "tenant" | "owner" }[] => {
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
  return expenses as { name: SiteYearlyExpensePurpose; bearer?: "tenant" | "owner" }[];
};
