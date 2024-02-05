import TimetableProjectionForm, { FormValues } from "./TimetableProjectionForm";

import { AppDispatch } from "@/app/application/store";
import {
  goToStep,
  ProjectCreationStep,
  setFirstYearOfOperation,
  setPhotovoltaicPanelsInstallationTimetableTimetable,
  setReinstatementTimetable,
} from "@/features/create-project/application/createProject.reducer";
import { ProjectSite } from "@/features/create-project/domain/project.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, projectSite?: ProjectSite) => {
  return {
    askForReinstatementTimetable: projectSite?.isFriche ?? false,
    onSubmit: ({
      firstYearOfOperation,
      photovoltaicInstallationTimetable: photovoltaicTimetable,
      reinstatementTimetable,
    }: FormValues) => {
      if (firstYearOfOperation) {
        dispatch(setFirstYearOfOperation(firstYearOfOperation));
      }
      if (photovoltaicTimetable.startDate || photovoltaicTimetable.endDate) {
        dispatch(setPhotovoltaicPanelsInstallationTimetableTimetable(photovoltaicTimetable));
      }

      if (reinstatementTimetable?.startDate || reinstatementTimetable?.endDate) {
        dispatch(setReinstatementTimetable(reinstatementTimetable));
      }
      dispatch(goToStep(ProjectCreationStep.NAMING));
    },
  };
};

function TimetableProjectionFormContainer() {
  const dispatch = useAppDispatch();
  const projectSite = useAppSelector((state) => state.projectCreation.siteData);

  return <TimetableProjectionForm {...mapProps(dispatch, projectSite)} />;
}

export default TimetableProjectionFormContainer;
