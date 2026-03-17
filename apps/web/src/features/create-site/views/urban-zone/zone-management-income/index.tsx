import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import type { ZoneManagementIncome } from "@/features/create-site/core/urban-zone/steps/expenses/zone-management-income/zoneManagementIncome.schema";
import { selectZoneManagementIncomeViewData } from "@/features/create-site/core/urban-zone/steps/expenses/zone-management-income/zoneManagementIncome.selectors";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import ZoneManagementIncomeForm from "./ZoneManagementIncomeForm";

function ZoneManagementIncomeContainer() {
  const dispatch = useAppDispatch();
  const { initialValues } = useAppSelector(selectZoneManagementIncomeViewData);

  const onSubmit = (data: ZoneManagementIncome) => {
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_ZONE_MANAGEMENT_INCOME",
        answers: data,
      }),
    );
  };

  return (
    <ZoneManagementIncomeForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default ZoneManagementIncomeContainer;
