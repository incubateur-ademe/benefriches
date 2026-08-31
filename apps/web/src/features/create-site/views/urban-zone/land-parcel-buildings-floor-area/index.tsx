import { useMemo } from "react";
import type { UrbanZoneLandParcelType } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { getParcelStepIds } from "@/features/create-site/core/urban-zone/steps/per-parcel-soils/parcelStepMapping";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import LandParcelBuildingsFloorAreaForm, {
  type FormValues,
} from "./LandParcelBuildingsFloorAreaForm";

type Props = {
  parcelType: UrbanZoneLandParcelType;
};

function LandParcelBuildingsFloorAreaContainer({ parcelType }: Props) {
  const { onBack, onRequestStepCompletion, createParcelBuildingsFloorAreaSelector } =
    useUrbanZoneSiteForm();
  const selectViewData = useMemo(
    () => createParcelBuildingsFloorAreaSelector(parcelType),
    [parcelType, createParcelBuildingsFloorAreaSelector],
  );
  const { initialBuildingsFloorSurfaceArea, buildingsFootprintSurfaceArea } =
    useAppSelector(selectViewData);
  const stepId = getParcelStepIds(parcelType).buildingsFloorArea;

  return (
    <LandParcelBuildingsFloorAreaForm
      currentParcelType={parcelType}
      buildingsFootprintSurfaceArea={buildingsFootprintSurfaceArea}
      initialValue={initialBuildingsFloorSurfaceArea}
      onSubmit={(data: FormValues) => {
        onRequestStepCompletion({
          stepId,
          answers: { buildingsFloorSurfaceArea: data.buildingsFloorSurfaceArea },
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default LandParcelBuildingsFloorAreaContainer;
