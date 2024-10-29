import { AppDispatch } from "@/app/application/store";
import {
  completeYearlyProjectedRevenue,
  revertYearlyProjectedRevenue,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { getDefaultValuesForYearlyProjectedRecurringRevenue } from "@/features/create-project/application/renewable-energy/renewableEnergy.selector";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import YearlyProjectedsRevenueForm, { FormValues } from "./ProjectYearlyProjectedRevenueForm";

const revenuesFormMap = {
  operationsAmount: "operations",
  otherAmount: "other",
} as const;

const mapProps = (dispatch: AppDispatch, defaultOperationsValue?: number) => {
  return {
    defaultValues: {
      operationsAmount: defaultOperationsValue,
    },
    onSubmit: (revenues: FormValues) => {
      const yearlyProjectedRevenues = typedObjectKeys(revenues)
        .filter((sourceKey) => !!revenues[sourceKey])
        .map((sourceKey) => ({
          source: revenuesFormMap[sourceKey],
          amount: revenues[sourceKey] as number,
        }));

      dispatch(completeYearlyProjectedRevenue(yearlyProjectedRevenues));
    },
    onBack: () => {
      dispatch(revertYearlyProjectedRevenue());
    },
  };
};

function YearlyProjectedRevenueFormContainer() {
  const dispatch = useAppDispatch();
  const defaultOperationsValue = useAppSelector(getDefaultValuesForYearlyProjectedRecurringRevenue);

  return <YearlyProjectedsRevenueForm {...mapProps(dispatch, defaultOperationsValue)} />;
}

export default YearlyProjectedRevenueFormContainer;
