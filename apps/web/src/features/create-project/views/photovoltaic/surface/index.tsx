import PhotovoltaicSurfaceForm from "./SurfaceForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicSurface,
} from "@/features/create-project/application/createProject.reducer";
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

  const recommendedSurface = (photovoltaicPower || 0) * 14;

  return (
    <PhotovoltaicSurfaceForm
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

export default PhotovoltaicSurfaceContainer;
