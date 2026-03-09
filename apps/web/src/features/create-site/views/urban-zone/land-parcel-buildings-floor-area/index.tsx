import { useMemo } from "react";
import type { UrbanZoneLandParcelType } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { createParcelBuildingsFloorAreaSelector } from "@/features/create-site/core/urban-zone/steps/per-parcel-soils/parcelBuildingsFloorArea.selectors";
import { getParcelStepIds } from "@/features/create-site/core/urban-zone/steps/per-parcel-soils/parcelStepMapping";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import LandParcelBuildingsFloorAreaForm, {
  type FormValues,
} from "./LandParcelBuildingsFloorAreaForm";

type Props = {
  parcelType: UrbanZoneLandParcelType;
};

function LandParcelBuildingsFloorAreaContainer({ parcelType }: Props) {
  const dispatch = useAppDispatch();
  const selectViewData = useMemo(
    () => createParcelBuildingsFloorAreaSelector(parcelType),
    [parcelType],
  );
  const { initialBuildingsFloorSurfaceArea } = useAppSelector(selectViewData);
  const stepId = getParcelStepIds(parcelType).buildingsFloorArea;

  return (
    <LandParcelBuildingsFloorAreaForm
      currentParcelType={parcelType}
      initialValue={initialBuildingsFloorSurfaceArea}
      onSubmit={(data: FormValues) => {
        dispatch(
          stepCompletionRequested({
            stepId,
            answers: { buildingsFloorSurfaceArea: data.buildingsFloorSurfaceArea },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default LandParcelBuildingsFloorAreaContainer;
