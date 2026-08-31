import { useAppSelector } from "@/app/hooks/store.hooks";
import type { ZoneManagementIncome } from "@/features/create-site/core/urban-zone/steps/expenses/zone-management-income/zoneManagementIncome.schema";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import ZoneManagementIncomeForm from "./ZoneManagementIncomeForm";

function ZoneManagementIncomeContainer() {
  const { onBack, onRequestStepCompletion, selectZoneManagementIncomeViewData } =
    useUrbanZoneSiteForm();
  const { initialValues } = useAppSelector(selectZoneManagementIncomeViewData);

  const onSubmit = (data: ZoneManagementIncome) => {
    onRequestStepCompletion({
      stepId: "URBAN_ZONE_ZONE_MANAGEMENT_INCOME",
      answers: data,
    });
  };

  return (
    <ZoneManagementIncomeForm initialValues={initialValues} onSubmit={onSubmit} onBack={onBack} />
  );
}

export default ZoneManagementIncomeContainer;
