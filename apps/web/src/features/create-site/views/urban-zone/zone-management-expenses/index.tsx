import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import type { ZoneManagementExpenses } from "@/features/create-site/core/urban-zone/steps/expenses/zone-management-expenses/zoneManagementExpenses.schema";
import { selectZoneManagementExpensesViewData } from "@/features/create-site/core/urban-zone/steps/expenses/zone-management-expenses/zoneManagementExpenses.selectors";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import ZoneManagementExpensesForm from "./ZoneManagementExpensesForm";

function ZoneManagementExpensesContainer() {
  const dispatch = useAppDispatch();
  const { initialValues } = useAppSelector(selectZoneManagementExpensesViewData);

  const onSubmit = (data: ZoneManagementExpenses) => {
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES",
        answers: data,
      }),
    );
  };

  return (
    <ZoneManagementExpensesForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default ZoneManagementExpensesContainer;
