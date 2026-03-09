import { useMemo } from "react";
import type { SoilsDistribution, UrbanZoneLandParcelType } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { createParcelSoilsDistributionSelector } from "@/features/create-site/core/urban-zone/steps/per-parcel-soils/parcelSoilsDistribution.selectors";
import { getParcelStepIds } from "@/features/create-site/core/urban-zone/steps/per-parcel-soils/parcelStepMapping";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import LandParcelSoilsDistributionForm from "./LandParcelSoilsDistributionForm";

type Props = {
  parcelType: UrbanZoneLandParcelType;
};

function LandParcelSoilsDistributionContainer({ parcelType }: Props) {
  const dispatch = useAppDispatch();
  const selectViewData = useMemo(
    () => createParcelSoilsDistributionSelector(parcelType),
    [parcelType],
  );
  const { totalSurfaceArea, initialSoilsDistribution } = useAppSelector(selectViewData);
  const stepId = getParcelStepIds(parcelType).soilsDistribution;

  return (
    <LandParcelSoilsDistributionForm
      currentParcelType={parcelType}
      totalSurfaceArea={totalSurfaceArea}
      initialValues={initialSoilsDistribution}
      onSubmit={(data: SoilsDistribution) => {
        dispatch(
          stepCompletionRequested({
            stepId,
            answers: { soilsDistribution: data },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default LandParcelSoilsDistributionContainer;
