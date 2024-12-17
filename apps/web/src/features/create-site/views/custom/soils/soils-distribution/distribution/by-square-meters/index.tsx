import { createSoilSurfaceAreaDistribution } from "shared";

import { revertSoilsDistributionStep } from "@/features/create-site/application/createSite.actions";
import { completeSoilsDistribution } from "@/features/create-site/application/createSite.reducer";
import { selectSiteSoilsDistribution } from "@/features/create-site/application/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSoilsDistributionBySquareMetersForm, { type FormValues } from "./BySquareMeters";

function SiteSoilsDistributionBySquareMetersFormContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);
  const soilsDistribution = useAppSelector(selectSiteSoilsDistribution);

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
    <SiteSoilsDistributionBySquareMetersForm
      initialValues={soilsDistribution}
      onSubmit={onSubmit}
      onBack={onBack}
      soils={siteData.soils ?? []}
      totalSurfaceArea={siteData.surfaceArea ?? 0}
    />
  );
}

export default SiteSoilsDistributionBySquareMetersFormContainer;
