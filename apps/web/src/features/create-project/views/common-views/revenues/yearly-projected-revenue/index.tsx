import { ReactNode } from "react";
import { RecurringRevenue } from "shared";

import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";

import YearlyProjectedsRevenueForm, { FormValues } from "./ProjectYearlyProjectedRevenueForm";

const revenuesFormMap = {
  operationsAmount: "operations",
  otherAmount: "other",
} as const;

type Props = {
  onSubmit: (data: RecurringRevenue[]) => void;
  onBack: () => void;
  title?: ReactNode;
  instructions?: ReactNode;
  defaultValues?: {
    operationsAmount?: number;
  };
};

function YearlyProjectedRevenueFormContainer({ onSubmit, ...props }: Props) {
  return (
    <YearlyProjectedsRevenueForm
      onSubmit={(revenues: FormValues) => {
        const yearlyProjectedRevenues = typedObjectKeys(revenues)
          .filter((sourceKey) => !!revenues[sourceKey])
          .map((sourceKey) => ({
            source: revenuesFormMap[sourceKey],
            amount: revenues[sourceKey] as number,
          }));

        onSubmit(yearlyProjectedRevenues);
      }}
      {...props}
    />
  );
}

export default YearlyProjectedRevenueFormContainer;
