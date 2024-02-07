import ScheduleProjectionForm, { FormValues } from "./ScheduleProjectionForm";

import { AppDispatch } from "@/app/application/store";
import {
  goToStep,
  ProjectCreationStep,
  setFirstYearOfOperation,
  setPhotovoltaicPanelsInstallationSchedule,
  setReinstatementSchedule,
} from "@/features/create-project/application/createProject.reducer";
import { ProjectSite } from "@/features/create-project/domain/project.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, projectSite?: ProjectSite) => {
  return {
    askForReinstatementSchedule: projectSite?.isFriche ?? false,
    onSubmit: ({
      firstYearOfOperation,
      photovoltaicInstallationSchedule: photovoltaicSchedule,
      reinstatementSchedule,
    }: FormValues) => {
      if (firstYearOfOperation) {
        dispatch(setFirstYearOfOperation(firstYearOfOperation));
      }
      if (photovoltaicSchedule.startDate || photovoltaicSchedule.endDate) {
        dispatch(setPhotovoltaicPanelsInstallationSchedule(photovoltaicSchedule));
      }

      if (reinstatementSchedule?.startDate || reinstatementSchedule?.endDate) {
        dispatch(setReinstatementSchedule(reinstatementSchedule));
      }
      dispatch(goToStep(ProjectCreationStep.NAMING));
    },
  };
};

function ScheduleProjectionFormContainer() {
  const dispatch = useAppDispatch();
  const projectSite = useAppSelector((state) => state.projectCreation.siteData);

  return <ScheduleProjectionForm {...mapProps(dispatch, projectSite)} />;
}

export default ScheduleProjectionFormContainer;
