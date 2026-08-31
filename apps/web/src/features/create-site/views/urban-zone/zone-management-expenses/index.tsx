import { useAppSelector } from "@/app/hooks/store.hooks";
import type { ZoneManagementExpenses } from "@/features/create-site/core/urban-zone/steps/expenses/zone-management-expenses/zoneManagementExpenses.schema";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import ZoneManagementExpensesForm from "./ZoneManagementExpensesForm";

function ZoneManagementExpensesContainer() {
  const { onBack, onRequestStepCompletion, selectZoneManagementExpensesViewData } =
    useUrbanZoneSiteForm();
  const { initialValues } = useAppSelector(selectZoneManagementExpensesViewData);

  const onSubmit = (data: ZoneManagementExpenses) => {
    onRequestStepCompletion({
      stepId: "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES",
      answers: data,
    });
  };

  return (
    <ZoneManagementExpensesForm initialValues={initialValues} onSubmit={onSubmit} onBack={onBack} />
  );
}

export default ZoneManagementExpensesContainer;
