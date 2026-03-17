import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import type { LocalAuthorityExpenses } from "@/features/create-site/core/urban-zone/steps/expenses/local-authority-expenses/localAuthorityExpenses.schema";
import { selectLocalAuthorityExpensesViewData } from "@/features/create-site/core/urban-zone/steps/expenses/local-authority-expenses/localAuthorityExpenses.selectors";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import LocalAuthorityExpensesForm from "./LocalAuthorityExpensesForm";

function LocalAuthorityExpensesContainer() {
  const dispatch = useAppDispatch();
  const { initialValues } = useAppSelector(selectLocalAuthorityExpensesViewData);

  const onSubmit = (data: LocalAuthorityExpenses) => {
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES",
        answers: data,
      }),
    );
  };

  return (
    <LocalAuthorityExpensesForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default LocalAuthorityExpensesContainer;
