import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectExpensesAndIncomeSummaryViewData } from "@/features/create-site/core/urban-zone/steps/expenses/expenses-summary/expensesAndIncomeSummary.selectors";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import UrbanZoneExpensesAndIncomeSummary from "./UrbanZoneExpensesAndIncomeSummary";

function ExpensesAndIncomeSummaryContainer() {
  const dispatch = useAppDispatch();
  const { ownerExpenses, ownerIncome } = useAppSelector(selectExpensesAndIncomeSummaryViewData);

  return (
    <UrbanZoneExpensesAndIncomeSummary
      ownerExpenses={ownerExpenses}
      ownerIncome={ownerIncome}
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default ExpensesAndIncomeSummaryContainer;
