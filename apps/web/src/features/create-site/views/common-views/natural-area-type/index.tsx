import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import NaturalAreaTypeForm, { FormValues } from "./NaturalAreaTypeForm";

export default function NaturalAreaTypeFormContainer() {
  const { onBack, onRequestStepCompletion, selectDerivedSiteData } = useCustomSiteForm();
  const naturalAreaType = useAppSelector((state) => selectDerivedSiteData(state).naturalAreaType);

  return (
    <NaturalAreaTypeForm
      initialValues={naturalAreaType ? { type: naturalAreaType } : undefined}
      onSubmit={(data: FormValues) => {
        onRequestStepCompletion({
          stepId: "NATURAL_AREA_TYPE",
          answers: { naturalAreaType: data.type },
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}
