import { createSoilSurfaceAreaDistribution } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectSiteSoilsDistributionViewData } from "@/features/create-site/core/steps/spaces/spaces.selectors";

import SiteSpacesDistributionForm, { FormValues } from "./SiteSpacesDistributionForm";

export default function SiteSpacesDistributionContainer() {
  const dispatch = useAppDispatch();
  const { siteSoils, siteSurfaceArea, initialValues } = useAppSelector(
    selectSiteSoilsDistributionViewData,
  );

  const onSubmit = (formData: FormValues) => {
    dispatch(
      stepCompletionRequested({
        stepId: "SPACES_SURFACE_AREA_DISTRIBUTION",
        answers: { distribution: createSoilSurfaceAreaDistribution(formData).toJSON() },
      }),
    );
  };

  const onBack = () => {
    dispatch(previousStepRequested());
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
