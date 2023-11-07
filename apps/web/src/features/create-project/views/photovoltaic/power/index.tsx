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

const RATIO_KWC_PER_M2 = 0.0714;

function PhotovoltaicPowerContainer() {
  const dispatch = useAppDispatch();
  const relatedSite = useAppSelector(
    (state) => state.projectCreation.projectData.relatedSite,
  );
  const { surfaceArea } = relatedSite;

  const photovoltaicSurface = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaic.surface,
  );

  const photovoltaicKeyParameter = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaic.keyParameter,
  );

  if (photovoltaicKeyParameter === PhotovoltaicKeyParameter.SURFACE) {
    const maxRecommendedPower = Math.round(
      photovoltaicSurface * RATIO_KWC_PER_M2,
    );

    return (
      <PhotovoltaicPowerFromSurfaceForm
        maxRecommendedPower={maxRecommendedPower}
        photovoltaicSurfaceArea={photovoltaicSurface}
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
