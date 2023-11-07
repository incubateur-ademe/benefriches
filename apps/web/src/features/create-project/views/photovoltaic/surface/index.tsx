import PhotovoltaicSurfaceForm from "./SurfaceForm";
import PhotovoltaicSurfaceFromPowerForm from "./SurfaceFromPowerForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicSurface,
} from "@/features/create-project/application/createProject.reducer";
import { PhotovoltaicKeyParameter } from "@/features/create-project/domain/project.types";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

function PhotovoltaicSurfaceContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector(
    (state) => state.projectCreation.siteData,
  );
  const photovoltaicPower = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicPower,
  );
  const { surfaceArea } = siteData;

  const photovoltaicKeyParameter = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicKeyParameter,
  );

  if (photovoltaicKeyParameter === PhotovoltaicKeyParameter.POWER) {
    const recommendedSurface = Math.round((photovoltaicPower || 0) * 14);
    return (
      <PhotovoltaicSurfaceFromPowerForm
        recommendedSurface={recommendedSurface}
        siteSurfaceArea={surfaceArea}
        photovoltaicPower={photovoltaicPower || 0}
        onSubmit={(data) => {
          dispatch(setPhotovoltaicSurface(data.photovoltaicSurface));
          dispatch(goToStep(ProjectCreationStep.CREATION_CONFIRMATION));
        }}
      />
    );
  }

  return (
    <PhotovoltaicSurfaceForm
      siteSurfaceArea={surfaceArea}
      onSubmit={(data) => {
        dispatch(setPhotovoltaicSurface(data.photovoltaicSurface));
        dispatch(goToStep(ProjectCreationStep.PHOTOVOLTAIC_POWER));
      }}
    />
  );
}

export default PhotovoltaicSurfaceContainer;