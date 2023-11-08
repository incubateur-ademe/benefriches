import PhotovoltaicPowerForm from "./PowerForm";
import PhotovoltaicPowerFromSurfaceForm from "./PowerFromSurfaceForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicPower,
} from "@/features/create-project/application/createProject.reducer";
import { PhotovoltaicKeyParameter } from "@/features/create-project/domain/project.types";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

// 714 kWc pour 10000 m²
const RATIO_KWC_PER_M2 = 0.0714;

const computePowerFromSurface = (surface: number) => {
  return Math.round(surface * RATIO_KWC_PER_M2);
};

function PhotovoltaicPowerContainer() {
  const dispatch = useAppDispatch();
  const surfaceArea = useAppSelector(
    (state) => state.projectCreation.projectData.relatedSite.surfaceArea,
  );

  const photovoltaicSurface = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaic.surface,
  );

  const photovoltaicKeyParameter = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaic.keyParameter,
  );

  if (photovoltaicKeyParameter === PhotovoltaicKeyParameter.SURFACE) {
    return (
      <PhotovoltaicPowerFromSurfaceForm
        maxRecommendedPower={computePowerFromSurface(photovoltaicSurface)}
        photovoltaicSurfaceArea={photovoltaicSurface}
        computationRatio={RATIO_KWC_PER_M2}
        onSubmit={(data) => {
          dispatch(setPhotovoltaicPower(data.photovoltaic.power));
          dispatch(
            goToStep(
              ProjectCreationStep.PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION,
            ),
          );
        }}
      />
    );
  }

  const maxRecommendedPower = Math.round(surfaceArea / 14);

  return (
    <PhotovoltaicPowerForm
      maxRecommendedPower={maxRecommendedPower}
      siteSurfaceArea={surfaceArea}
      onSubmit={(data) => {
        dispatch(setPhotovoltaicPower(data.photovoltaicPower));
        dispatch(goToStep(ProjectCreationStep.PHOTOVOLTAIC_SURFACE));
      }}
    />
  );
}

export default PhotovoltaicPowerContainer;
