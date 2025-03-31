import { createSoilSurfaceAreaDistribution } from "shared";

import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { soilsDistributionStepCompleted } from "@/features/create-site/core/actions/spaces.actions";
import { selectSiteSoilsDistributionViewData } from "@/features/create-site/core/selectors/spaces.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

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
    dispatch(stepRevertAttempted());
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
