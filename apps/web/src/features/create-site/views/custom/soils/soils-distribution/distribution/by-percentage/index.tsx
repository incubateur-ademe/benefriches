import { useMemo } from "react";
import { createSoilSurfaceAreaDistribution, SoilType } from "shared";

import { revertSoilsDistributionStep } from "@/features/create-site/application/createSite.actions";
import { completeSoilsDistribution } from "@/features/create-site/application/createSite.reducer";
import { selectSiteSoilsDistribution } from "@/features/create-site/application/createSite.selectors";
import { computeValueFromPercentage } from "@/shared/services/percentage/percentage";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSoilsDistributionByPercentageForm, { type FormValues } from "./ByPercentageForm";

const getFormatFormValuesFunction = (surfaceArea?: number) => (formData: FormValues) => {
  if (!surfaceArea) {
    return {};
  }
  const entries = Object.entries(formData) as [SoilType, number][];
  const formattedEntries = entries
    .filter(([, value]) => value && value > 0)
    .map(([key, percentage]) => [key, computeValueFromPercentage(percentage, surfaceArea)]);
  return Object.fromEntries(formattedEntries) as Record<SoilType, number>;
};

function SiteSoilsDistributionByPercentageContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);
  const siteSoilsDistribution = useAppSelector(selectSiteSoilsDistribution);

  const initialValues =
    createSoilSurfaceAreaDistribution(siteSoilsDistribution).getDistributionInPercentage();

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
    <SiteSoilsDistributionByPercentageForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      onBack={onBack}
      soils={siteData.soils ?? []}
    />
  );
}

export default SiteSoilsDistributionByPercentageContainer;
