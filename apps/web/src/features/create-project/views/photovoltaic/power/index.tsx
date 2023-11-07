import PhotovoltaicPowerForm from "./PowerForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicPower,
} from "@/features/create-project/application/createProject.reducer";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

function PhotovoltaicPowerContainer() {
  const dispatch = useAppDispatch();
  const relatedSite = useAppSelector(
    (state) => state.projectCreation.projectData.relatedSite,
  );
  const { surfaceArea } = relatedSite;

  const maxRecommendedPower = surfaceArea / 14;

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
