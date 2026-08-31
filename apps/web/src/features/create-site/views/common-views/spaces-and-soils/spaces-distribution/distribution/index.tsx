import { createSoilSurfaceAreaDistribution } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteSpacesDistributionForm, { FormValues } from "./SiteSpacesDistributionForm";

export default function SiteSpacesDistributionContainer() {
  const { onBack, onRequestStepCompletion, selectSiteSoilsDistributionViewData } =
    useCustomSiteForm();
  const { siteSoils, siteSurfaceArea, initialValues } = useAppSelector(
    selectSiteSoilsDistributionViewData,
  );

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
      onBack={onBack}
      onSubmit={onSubmit}
    />
  );
}
