import { useAppSelector } from "@/app/hooks/store.hooks";

import { useCustomSiteForm } from "../site-form/useCustomSiteForm";
import UrbanZoneTypeForm, { FormValues } from "./UrbanZoneTypeForm";

function UrbanZoneTypeFormContainer() {
  const { onBack, onRequestStepCompletion, selectUrbanZoneTypeViewData } = useCustomSiteForm();
  const { urbanZoneType } = useAppSelector(selectUrbanZoneTypeViewData);

  return (
    <UrbanZoneTypeForm
      initialValues={urbanZoneType ? { urbanZoneType } : undefined}
      onSubmit={(data: FormValues) => {
        onRequestStepCompletion({
          stepId: "URBAN_ZONE_TYPE",
          answers: { urbanZoneType: data.urbanZoneType },
        });
      }}
      onBack={onBack}
    />
  );
}

export default UrbanZoneTypeFormContainer;
