import { RecurringRevenue } from "shared";

import {
  yearlyProjectedRevenueCompleted,
  yearlyProjectedRevenueReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import YearlyProjectedsRevenueForm from "@/features/create-project/views/common-views/revenues/yearly-projected-revenue";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function YearlyProjectedRevenueFormContainer() {
  const dispatch = useAppDispatch();

  return (
    <YearlyProjectedsRevenueForm
      title="Recettes annuelles d’exploitation des bâtiments"
      onBack={() => {
        dispatch(yearlyProjectedRevenueReverted());
      }}
      onSubmit={(revenues: RecurringRevenue[]) => {
        dispatch(yearlyProjectedRevenueCompleted(revenues));
      }}
    />
  );
}

export default YearlyProjectedRevenueFormContainer;
