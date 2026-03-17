import { useAppDispatch } from "@/app/hooks/store.hooks";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import UrbanZoneExpensesAndIncomeIntroduction from "./UrbanZoneExpensesAndIncomeIntroduction";

function ExpensesAndIncomeIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <UrbanZoneExpensesAndIncomeIntroduction
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default ExpensesAndIncomeIntroductionContainer;
