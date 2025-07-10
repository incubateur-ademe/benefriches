import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { completePhotovoltaicInstallationElectricalPower } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectPhotovoltaicPowerViewData } from "@/features/create-project/core/renewable-energy/selectors/photovoltaicPowerStation.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import PhotovoltaicPowerForm from "./PowerForm";
import PhotovoltaicPowerFromSurfaceForm from "./PowerFromSurfaceForm";

function PhotovoltaicPowerContainer() {
  const dispatch = useAppDispatch();
  const {
    initialValue,
    siteSurfaceArea,
    recommendedPowerKWc,
    photovoltaicInstallationSurfaceArea,
    keyParameter,
  } = useAppSelector(selectPhotovoltaicPowerViewData);

  const onSubmit = (data: { photovoltaicInstallationElectricalPowerKWc: number }) => {
    dispatch(
      completePhotovoltaicInstallationElectricalPower(
        data.photovoltaicInstallationElectricalPowerKWc,
      ),
    );
  };

  const onBack = () => {
    dispatch(stepRevertAttempted());
  };

  if (keyParameter === "SURFACE") {
    return (
      <PhotovoltaicPowerFromSurfaceForm
        initialValues={
          initialValue ? { photovoltaicInstallationElectricalPowerKWc: initialValue } : undefined
        }
        recommendedElectricalPowerKWc={recommendedPowerKWc}
        photovoltaicSurfaceArea={photovoltaicInstallationSurfaceArea}
        onSubmit={onSubmit}
        onBack={onBack}
      />
    );
  }

  return (
    <PhotovoltaicPowerForm
      initialValues={
        initialValue ? { photovoltaicInstallationElectricalPowerKWc: initialValue } : undefined
      }
      recommendedElectricalPowerKWc={recommendedPowerKWc}
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default PhotovoltaicPowerContainer;
