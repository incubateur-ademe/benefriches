import { ReactNode } from "react";
import { RecurringExpense } from "shared";

import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";

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
  defaultValues?: {
    rent: number;
    maintenance: number;
    taxes: number;
  };
};

function YearlyProjectedExpensesFormContainer({
  onSubmit,
  onBack,
  title,
  instructions,
  defaultValues,
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
      defaultValues={defaultValues}
      title={title}
      instructions={instructions}
    />
  );
}

export default YearlyProjectedExpensesFormContainer;
