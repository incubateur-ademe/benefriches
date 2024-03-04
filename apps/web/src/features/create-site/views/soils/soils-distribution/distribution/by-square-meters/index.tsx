import { useMemo } from "react";
import SiteSoilsDistributionBySquareMetersForm, { type FormValues } from "./BySquareMeters";

import { revertSoilsDistributionStep } from "@/features/create-site/application/createSite.actions";
import { completeSoilsDistribution } from "@/features/create-site/application/createSite.reducer";
import { SoilType } from "@/shared/domain/soils";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const getFormatFormValuesFunction = (surfaceArea?: number) => (formData: FormValues) => {
  if (!surfaceArea) {
    return {};
  }
  const entries = Object.entries(formData) as [SoilType, number][];
  const formattedEntries = entries.filter(([, value]) => value && value > 0);
  return Object.fromEntries(formattedEntries) as Record<SoilType, number>;
};

function SiteSoilsDistributionBySquareMetersFormContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  const formatFormValues = useMemo(
    () => getFormatFormValuesFunction(siteData.surfaceArea),
    [siteData.surfaceArea],
  );

  const onSubmit = (formData: FormValues) => {
    dispatch(completeSoilsDistribution({ distribution: formatFormValues(formData) }));
  };

  const onBack = () => {
    dispatch(revertSoilsDistributionStep());
  };

  return (
    <SiteSoilsDistributionBySquareMetersForm
      onSubmit={onSubmit}
      onBack={onBack}
      soils={siteData.soils ?? []}
      totalSurfaceArea={siteData.surfaceArea ?? 0}
    />
  );
}

export default SiteSoilsDistributionBySquareMetersFormContainer;
