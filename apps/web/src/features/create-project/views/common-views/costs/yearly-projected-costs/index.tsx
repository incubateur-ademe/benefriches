import { ReactNode } from "react";
import { RecurringExpense } from "shared";

import { typedObjectKeys } from "@/shared/core/object-keys/objectKeys";

import YearlyProjectedsExpensesForm, { FormValues } from "./YearlyProjectedCostsForm";

const expensesFormMap = {
  rentAmount: "rent",
  maintenanceAmount: "maintenance",
  taxesAmount: "taxes",
  otherAmount: "other",
} as const;

type Props = {
  onSubmit: (data: RecurringExpense[]) => void;
  onBack: () => void;
  title?: ReactNode;
  instructions?: ReactNode;
  initialValues: {
    rent: number;
    maintenance: number;
    taxes: number;
    other: number;
  };
};

function YearlyProjectedExpensesFormContainer({
  onSubmit,
  onBack,
  title,
  instructions,
  initialValues,
}: Props) {
  return (
    <YearlyProjectedsExpensesForm
      onSubmit={(expenses: FormValues) => {
        onSubmit(
          typedObjectKeys(expenses)
            .filter((sourceKey) => !!expenses[sourceKey])
            .map((sourceKey) => ({
              purpose: expensesFormMap[sourceKey],
              amount: expenses[sourceKey] as number,
            })),
        );
      }}
      onBack={onBack}
      initialValues={{
        taxesAmount: initialValues.taxes,
        maintenanceAmount: initialValues.maintenance,
        rentAmount: initialValues.rent,
        otherAmount: initialValues.other,
      }}
      title={title}
      instructions={instructions}
    />
  );
}

export default YearlyProjectedExpensesFormContainer;
