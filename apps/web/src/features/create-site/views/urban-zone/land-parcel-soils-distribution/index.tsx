import { useMemo } from "react";
import type { SoilsDistribution, UrbanZoneLandParcelType } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { getParcelStepIds } from "@/features/create-site/core/urban-zone/steps/per-parcel-soils/parcelStepMapping";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import LandParcelSoilsDistributionForm from "./LandParcelSoilsDistributionForm";

type Props = {
  parcelType: UrbanZoneLandParcelType;
};

function LandParcelSoilsDistributionContainer({ parcelType }: Props) {
  const { onBack, onRequestStepCompletion, createParcelSoilsDistributionSelector } =
    useUrbanZoneSiteForm();
  const selectViewData = useMemo(
    () => createParcelSoilsDistributionSelector(parcelType),
    [parcelType, createParcelSoilsDistributionSelector],
  );
  const { totalSurfaceArea, initialSoilsDistribution } = useAppSelector(selectViewData);
  const stepId = getParcelStepIds(parcelType).soilsDistribution;

  return (
    <LandParcelSoilsDistributionForm
      currentParcelType={parcelType}
      totalSurfaceArea={totalSurfaceArea}
      initialValues={initialSoilsDistribution}
      onSubmit={(data: SoilsDistribution) => {
        onRequestStepCompletion({
          stepId,
          answers: { soilsDistribution: data },
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default LandParcelSoilsDistributionContainer;
