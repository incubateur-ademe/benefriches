import { createSoilSurfaceAreaDistribution } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { soilsDistributionStepCompleted } from "@/features/create-site/core/steps/spaces/spaces.actions";
import { selectSiteSoilsDistributionViewData } from "@/features/create-site/core/steps/spaces/spaces.selectors";

import SiteSpacesDistributionForm, { FormValues } from "./SiteSpacesDistributionForm";

export default function SiteSpacesDistributionContainer() {
  const dispatch = useAppDispatch();
  const { siteSoils, siteSurfaceArea, initialValues } = useAppSelector(
    selectSiteSoilsDistributionViewData,
  );

  const onSubmit = (formData: FormValues) => {
    dispatch(
      soilsDistributionStepCompleted({
        distribution: createSoilSurfaceAreaDistribution(formData).toJSON(),
      }),
    );
  };

  const onBack = () => {
    dispatch(stepReverted());
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
