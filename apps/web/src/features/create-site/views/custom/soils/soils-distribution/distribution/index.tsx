import { createSoilSurfaceAreaDistribution } from "shared";

import { revertSoilsDistributionStep } from "@/features/create-site/core/actions/createSite.actions";
import { completeSoilsDistribution } from "@/features/create-site/core/createSite.reducer";
import { selectSiteSoilsDistributionViewData } from "@/features/create-site/core/selectors/spaces.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSoilsDistributionForm, { FormValues } from "./SiteSoilsDistributionForm";

function SiteSoilsDistributionContainer() {
  const dispatch = useAppDispatch();
  const { siteSoils, siteSurfaceArea, initialValues } = useAppSelector(
    selectSiteSoilsDistributionViewData,
  );

  const onSubmit = (formData: FormValues) => {
    dispatch(
      completeSoilsDistribution({
        distribution: createSoilSurfaceAreaDistribution(formData).toJSON(),
      }),
    );
  };

  const onBack = () => {
    dispatch(revertSoilsDistributionStep());
  };

  return (
    <SiteSoilsDistributionForm
      initialValues={initialValues.value}
      siteSoils={siteSoils}
      totalSurfaceArea={siteSurfaceArea}
      onBack={onBack}
      onSubmit={onSubmit}
    />
  );
}

export default SiteSoilsDistributionContainer;
