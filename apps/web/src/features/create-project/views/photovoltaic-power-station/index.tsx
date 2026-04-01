import { useAppSelector } from "@/app/hooks/store.hooks";

import NavigationBlockerDialog from "../NavigationBlockerDialog";
import { useSyncCreationStepWithRouteQuery } from "../useSyncCreationStepWithRouteQuery";
import PhotovoltaicPowerStationCustomCreationWizard from "./PhotovoltaicPowerStationCreationWizard";
import { RENEWABLE_ENERGY_PROJECT_CREATION_STEP_QUERY_STRING_MAP } from "./creationStepQueryStringMap";

function PhotovoltaicPowerStationCreationWizard() {
  const { saveState, currentStep } = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject,
  );

  useSyncCreationStepWithRouteQuery(
    RENEWABLE_ENERGY_PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep],
  );

  return (
    <>
      <PhotovoltaicPowerStationCustomCreationWizard currentStep={currentStep} />
      <NavigationBlockerDialog shouldBlock={saveState !== "success"} />
    </>
  );
}

export default PhotovoltaicPowerStationCreationWizard;
