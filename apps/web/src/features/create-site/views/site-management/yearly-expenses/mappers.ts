import { FormValues } from "./SiteYearlyExpensesForm";

import { Expense, ExpensePurpose } from "@/features/create-site/domain/siteFoncier.types";

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
  expectedExpenses: { name: ExpensePurpose; bearer?: "tenant" | "owner" }[],
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
) => {
  const isFricheLeased = isFriche && hasTenant;
  const isSiteWorkedByTenant = !isFriche && isWorked && hasTenant;
  if (isFricheLeased || isSiteWorkedByTenant) {
    return [
      { name: "rent", bearer: "tenant" },
      { name: "operationsTaxes", bearer: "tenant" },
      { name: "maintenance", bearer: "tenant" },
      { name: "propertyTaxes", bearer: "owner" },
      { name: "otherManagementCosts", bearer: undefined },
    ] as { name: ExpensePurpose; bearer?: "tenant" | "owner" }[];
  }

  const isSiteWorkedByOwner = !isFriche && isWorked;
  if (isSiteWorkedByOwner) {
    return [
      { name: "operationsTaxes", bearer: "owner" },
      { name: "maintenance", bearer: "owner" },
      { name: "propertyTaxes", bearer: "owner" },
      { name: "otherManagementCosts", bearer: "owner" },
    ] as { name: ExpensePurpose; bearer?: "tenant" | "owner" }[];
  }

  return [
    { name: "maintenance", bearer: "owner" },
    { name: "propertyTaxes", bearer: "owner" },
    { name: "otherManagementCosts", bearer: "owner" },
  ] as { name: ExpensePurpose; bearer?: "tenant" | "owner" }[];
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
  return expenses as { name: ExpensePurpose; bearer?: "tenant" | "owner" }[];
};
