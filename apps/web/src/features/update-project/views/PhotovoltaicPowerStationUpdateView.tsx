import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { RENEWABLE_ENERGY_PROJECT_CREATION_STEP_QUERY_STRING_MAP } from "@/features/create-project/views/photovoltaic-power-station/creationStepQueryStringMap";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import { reconversionProjectUpdateSaved } from "../core/updateProject.actions";
import { selectIsFormStatusValid } from "../core/updateProject.selectors";
import PhotovoltaicPowerStationUpdateNavigationBlockerDialog from "./photovoltaic-power-station/PhotovoltaicPowerStationUpdateNavigationBlockerDialog";
import PhotovoltaicPowerStationUpdateStepper from "./photovoltaic-power-station/PhotovoltaicPowerStationUpdateStepper";
import PhotovoltaicPowerStationUpdateWizard from "./photovoltaic-power-station/PhotovoltaicPowerStationUpdateWizard";
import { useSidebarActions } from "./useSidebarActions";
import { useSyncUpdateStepWithRouteQuery } from "./useSyncUpdateStepWithRouteQuery";

function PhotovoltaicPowerStationUpdateView() {
  const dispatch = useAppDispatch();
  const { currentStep, saveState } = useAppSelector(
    (state) => state.projectUpdate.renewableEnergyProject,
  );
  const projectId = useAppSelector((state) => state.projectUpdate.projectData.id);
  const projectName = useAppSelector((state) => state.projectUpdate.projectData.projectName ?? "");
  const siteId = useAppSelector((state) => state.projectUpdate.siteData?.id);
  const isFormValid = useAppSelector(selectIsFormStatusValid);

  const sidebarActions = useSidebarActions({
    onSave: () => {
      void dispatch(reconversionProjectUpdateSaved());
    },
    isFormValid,
    saveState,
    projectId,
    siteId,
  });

  useSyncUpdateStepWithRouteQuery(
    RENEWABLE_ENERGY_PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep],
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  return (
    <SidebarLayout
      title={`Modification du projet « ${projectName} »`}
      header="sticky"
      actions={sidebarActions}
      sidebarChildren={<PhotovoltaicPowerStationUpdateStepper />}
      mainChildren={
        saveState === "loading" ? (
          <LoadingSpinner />
        ) : (
          <>
            <PhotovoltaicPowerStationUpdateWizard currentStep={currentStep} />
            <PhotovoltaicPowerStationUpdateNavigationBlockerDialog
              shouldBlock={saveState === "dirty"}
            />
          </>
        )
      }
    />
  );
}

export default PhotovoltaicPowerStationUpdateView;
