import {
  ComputedInstallationExpenses,
  typedObjectEntries,
  UrbanProjectDevelopmentExpense,
} from "shared";

import { FormValues } from "@/features/create-project/views/common-views/expenses/installation-expenses/InstallationExpensesForm";

const purposeMapKeys = {
  technicalStudyAmount: "technical_studies",
  worksAmount: "development_works",
  otherAmount: "other",
} as const satisfies Record<keyof FormValues, UrbanProjectDevelopmentExpense["purpose"]>;

const expensesToFormValuesMap = {
  technical_studies: "technicalStudyAmount",
  development_works: "worksAmount",
  other: "otherAmount",
} as const satisfies Record<UrbanProjectDevelopmentExpense["purpose"], keyof FormValues>;

export const mapFormValuesToExpenses = (
  formValues: FormValues,
): UrbanProjectDevelopmentExpense[] => {
  return typedObjectEntries(formValues)
    .filter(([, amount]) => amount && amount > 0)
    .map(([purpose, amount]) => ({
      amount: amount as number,
      purpose: purposeMapKeys[purpose],
    }));
};

const mapExpensesToFormValues = (expenses: UrbanProjectDevelopmentExpense[]): FormValues => {
  return expenses.reduce<FormValues>((acc, cur) => {
    return { ...acc, [expensesToFormValuesMap[cur.purpose]]: cur.amount };
  }, {});
};

const mapDefaultValuesToFormValues = (defaultValues: ComputedInstallationExpenses): FormValues => {
  const { developmentWorks, technicalStudies, other } = defaultValues;
  return {
    worksAmount: developmentWorks && Math.round(developmentWorks),
    technicalStudyAmount: technicalStudies && Math.round(technicalStudies),
    otherAmount: other && Math.round(other),
  };
};

export const mapInitialValues = (
  preEnteredData: UrbanProjectDevelopmentExpense[] | undefined,
  defaultValues: ComputedInstallationExpenses | undefined,
): FormValues | undefined => {
  if (preEnteredData) return mapExpensesToFormValues(preEnteredData);

  if (defaultValues) return mapDefaultValuesToFormValues(defaultValues);

  return undefined;
};
