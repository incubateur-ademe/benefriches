import {
  completePhotovoltaicInstallationSurface,
  revertPhotovoltaicInstallationSurface,
} from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectPhotovoltaicSurfaceViewData } from "@/features/create-project/core/renewable-energy/selectors/photovoltaicPowerStation.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import PhotovoltaicSurfaceForm from "./SurfaceForm";
import PhotovoltaicSurfaceFromPowerForm from "./SurfaceFromPowerForm";

function PhotovoltaicSurfaceContainer() {
  const dispatch = useAppDispatch();
  const {
    initialValue,
    keyParameter,
    siteSurfaceArea,
    recommendedSurfaceArea,
    electricalPowerKWc,
  } = useAppSelector(selectPhotovoltaicSurfaceViewData);

  const onSubmit = (data: { photovoltaicInstallationSurfaceSquareMeters: number }) => {
    dispatch(
      completePhotovoltaicInstallationSurface(data.photovoltaicInstallationSurfaceSquareMeters),
    );
  };

  const onBack = () => dispatch(revertPhotovoltaicInstallationSurface());

  if (keyParameter === "POWER") {
    return (
      <PhotovoltaicSurfaceFromPowerForm
        initialValues={{ photovoltaicInstallationSurfaceSquareMeters: initialValue }}
        recommendedSurface={recommendedSurfaceArea}
        siteSurfaceArea={siteSurfaceArea}
        electricalPowerKWc={electricalPowerKWc}
        onSubmit={onSubmit}
        onBack={onBack}
      />
    );
  }

  return (
    <PhotovoltaicSurfaceForm
      initialValues={
        initialValue ? { photovoltaicInstallationSurfaceSquareMeters: initialValue } : undefined
      }
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default PhotovoltaicSurfaceContainer;
