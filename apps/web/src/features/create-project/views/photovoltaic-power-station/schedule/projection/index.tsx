import { AppDispatch } from "@/app/application/store";
import {
  completeScheduleStep,
  revertScheduleStep,
} from "@/features/create-project/application/createProject.reducer";
import { ProjectSite } from "@/features/create-project/domain/project.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ScheduleProjectionForm, { FormValues } from "./ScheduleProjectionForm";

const mapProps = (dispatch: AppDispatch, projectSite?: ProjectSite) => {
  const nextYear = new Date().getFullYear() + 1;
  return {
    askForReinstatementSchedule: projectSite?.isFriche ?? false,
    defaultFirstYearOfOperation: nextYear,
    onBack: () => {
      dispatch(revertScheduleStep());
    },
    onSubmit: (formData: FormValues) => {
      const reinstatementSchedule =
        formData.reinstatementSchedule?.startDate && formData.reinstatementSchedule.endDate
          ? {
              startDate: formData.reinstatementSchedule.startDate,
              endDate: formData.reinstatementSchedule.endDate,
            }
          : undefined;
      const photovoltaicInstallationSchedule =
        formData.photovoltaicInstallationSchedule?.startDate &&
        formData.photovoltaicInstallationSchedule.endDate
          ? {
              startDate: formData.photovoltaicInstallationSchedule.startDate,
              endDate: formData.photovoltaicInstallationSchedule.endDate,
            }
          : undefined;
      dispatch(
        completeScheduleStep({
          firstYearOfOperation: formData.firstYearOfOperation,
          photovoltaicInstallationSchedule,
          reinstatementSchedule,
        }),
      );
    },
  };
};

function ScheduleProjectionFormContainer() {
  const dispatch = useAppDispatch();
  const projectSite = useAppSelector((state) => state.projectCreation.siteData);

  return <ScheduleProjectionForm {...mapProps(dispatch, projectSite)} />;
}

export default ScheduleProjectionFormContainer;
