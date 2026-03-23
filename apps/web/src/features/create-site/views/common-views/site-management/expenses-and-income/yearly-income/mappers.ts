import { SiteYearlyIncome, typedObjectEntries } from "shared";

import { FormValues } from "./SiteYearlyIncomeForm";

export const mapFormDataToIncomes = (formData: FormValues): SiteYearlyIncome[] => {
  return typedObjectEntries(formData).map(([source, amount]) => ({
    source,
    amount: amount ?? 0,
  })) as SiteYearlyIncome[];
};

export const mapIncomesListToFormValues = (incomes: SiteYearlyIncome[]): FormValues => {
  return {
    "product-sales": incomes.find(({ source }) => source === "product-sales")?.amount ?? 0,
    subsidies: incomes.find(({ source }) => source === "subsidies")?.amount ?? 0,
    other: incomes.find(({ source }) => source === "other")?.amount ?? 0,
  };
};

// predefinedIncomes are from the store, when user has already entered incomes
export const getInitialValues = (
  predefinedIncomes: SiteYearlyIncome[],
  estimatedAmounts: SiteYearlyIncome[],
): FormValues => {
  return mapIncomesListToFormValues(
    predefinedIncomes.length > 0 ? predefinedIncomes : estimatedAmounts,
  );
};
