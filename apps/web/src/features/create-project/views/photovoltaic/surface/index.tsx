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

// 14000 m² for 1000 kWc
const RATIO_M2_PER_KWC = 14;

const computeSurfaceFromPower = (power = 0) => {
  return Math.round(power * RATIO_M2_PER_KWC);
};

function PhotovoltaicSurfaceContainer() {
  const dispatch = useAppDispatch();
  const surfaceArea = useAppSelector(
    (state) => state.projectCreation.siteData?.surfaceArea,
  );
  const photovoltaicPower = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicPower,
  );

  const photovoltaicKeyParameter = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicKeyParameter,
  );

  if (photovoltaicKeyParameter === PhotovoltaicKeyParameter.POWER) {
    return (
      <PhotovoltaicSurfaceFromPowerForm
        recommendedSurface={computeSurfaceFromPower(photovoltaicPower)}
        siteSurfaceArea={surfaceArea ?? 0}
        photovoltaicPower={photovoltaicPower ?? 0}
        computationRatio={RATIO_M2_PER_KWC}
        onSubmit={(data) => {
          dispatch(setPhotovoltaicSurface(data.photovoltaicSurface));
          dispatch(
            goToStep(
              ProjectCreationStep.PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION,
            ),
          );
        }}
      />
    );
  }

  return (
    <PhotovoltaicSurfaceForm
      siteSurfaceArea={surfaceArea ?? 0}
      onSubmit={(data) => {
        dispatch(setPhotovoltaicSurface(data.photovoltaicSurface));
        dispatch(goToStep(ProjectCreationStep.PHOTOVOLTAIC_POWER));
      }}
    />
  );
}

export default PhotovoltaicSurfaceContainer;
