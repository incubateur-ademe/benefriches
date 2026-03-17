import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectExpensesAndIncomeSummaryViewData } from "@/features/create-site/core/urban-zone/steps/expenses/expenses-summary/expensesAndIncomeSummary.selectors";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import UrbanZoneExpensesAndIncomeSummary from "./UrbanZoneExpensesAndIncomeSummary";

function ExpensesAndIncomeSummaryContainer() {
  const dispatch = useAppDispatch();
  const { expenses, incomes } = useAppSelector(selectExpensesAndIncomeSummaryViewData);

  return (
    <UrbanZoneExpensesAndIncomeSummary
      expenses={expenses}
      incomes={incomes}
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default ExpensesAndIncomeSummaryContainer;
