import PhotovoltaicInfrastructureSurfacesForm from "./InfrastructureSurfacesForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicInfrastructureSurfaces,
} from "@/features/create-project/application/createProject.reducer";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

const RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS = 0.88;
const RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS = 0.02;

function PhotovoltaicInfrastructureSurfacesContainer() {
  const dispatch = useAppDispatch();

  const photovoltaicPower = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaic.power,
  );

  const suggestedAccessPathsSurface = Math.round(
    photovoltaicPower * RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS,
  );
  const suggestedFoundationsSurface = Math.round(
    photovoltaicPower * RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS,
  );

  return (
    <PhotovoltaicInfrastructureSurfacesForm
      suggestedAccessPathsSurface={suggestedAccessPathsSurface}
      suggestedFoundationsSurface={suggestedFoundationsSurface}
      accessPathsRatio={RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS}
      foundationsRatio={RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS}
      onSubmit={(data) => {
        dispatch(setPhotovoltaicInfrastructureSurfaces(data.photovoltaic));
        dispatch(goToStep(ProjectCreationStep.CREATION_CONFIRMATION));
      }}
    />
  );
}

export default PhotovoltaicInfrastructureSurfacesContainer;
