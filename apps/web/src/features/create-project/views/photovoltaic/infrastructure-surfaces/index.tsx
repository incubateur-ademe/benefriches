import PhotovoltaicInfrastructureSurfacesForm from "./InfrastructureSurfacesForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicInfrastructureSurfaces,
} from "@/features/create-project/application/createProject.reducer";
import {
  RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS,
  RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS,
} from "@/features/create-project/domain/photovoltaic";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

const computeAccessPathsAverageSurfaceFromElectricalPower = (
  electricalPower: number,
) => Math.round(electricalPower * RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS);

const computeFoundationsAverageSurfaceFromElectricalPower = (
  electricalPower: number,
) => Math.round(electricalPower * RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS);

function PhotovoltaicInfrastructureSurfacesContainer() {
  const dispatch = useAppDispatch();

  const electricalPowerKWc = useAppSelector(
    (state) =>
      state.projectCreation.projectData
        .photovoltaicInstallationElectricalPowerKWc ?? 0,
  );

  return (
    <PhotovoltaicInfrastructureSurfacesForm
      suggestedAccessPathsSurface={computeAccessPathsAverageSurfaceFromElectricalPower(
        electricalPowerKWc,
      )}
      suggestedFoundationsSurface={computeFoundationsAverageSurfaceFromElectricalPower(
        electricalPowerKWc,
      )}
      onSubmit={(data) => {
        dispatch(setPhotovoltaicInfrastructureSurfaces(data));
        dispatch(goToStep(ProjectCreationStep.STAKEHOLDERS_INTRODUCTION));
      }}
    />
  );
}

export default PhotovoltaicInfrastructureSurfacesContainer;
