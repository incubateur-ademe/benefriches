import { createSoilSurfaceAreaDistribution } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteSpacesDistributionForm, { FormValues } from "./SiteSpacesDistributionForm";

export default function SiteSpacesDistributionContainer() {
  const {
    onBack,
    onRequestStepCompletion,
    selectSiteSoilsDistributionViewData,
    selectSurfaceAreaInputMode,
    onSurfaceAreaInputModeChange,
  } = useCustomSiteForm();
  const { siteSoils, siteSurfaceArea, initialValues } = useAppSelector(
    selectSiteSoilsDistributionViewData,
  );
  const inputMode = useAppSelector(selectSurfaceAreaInputMode);

  const onSubmit = (formData: FormValues) => {
    onRequestStepCompletion({
      stepId: "SPACES_SURFACE_AREA_DISTRIBUTION",
      answers: { distribution: createSoilSurfaceAreaDistribution(formData).toJSON() },
    });
  };

  return (
    <SiteSpacesDistributionForm
      initialValues={initialValues.value}
      siteSoils={siteSoils}
      totalSurfaceArea={siteSurfaceArea}
      inputMode={inputMode}
      onInputModeChange={onSurfaceAreaInputModeChange}
      onBack={onBack}
      onSubmit={onSubmit}
    />
  );
}
