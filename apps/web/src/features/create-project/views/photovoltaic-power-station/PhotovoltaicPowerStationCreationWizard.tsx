import { useAppSelector } from "@/app/hooks/store.hooks";

import NavigationBlockerDialog from "../NavigationBlockerDialog";
import { HTML_MAIN_TITLE } from "../mainHtmlTitle";
import { useSyncCreationStepWithRouteQuery } from "../useSyncCreationStepWithRouteQuery";
import PhotovoltaicPowerStationCustomCreationWizard from "./custom-form";
import { RENEWABLE_ENERGY_PROJECT_CREATION_STEP_QUERY_STRING_MAP } from "./custom-form/creationStepQueryStringMap";

export const HTML_PV_PROJECT_FORM_MAIN_TITLE = `Projet photovoltaïque - ${HTML_MAIN_TITLE}`;

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
