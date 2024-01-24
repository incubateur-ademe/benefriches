import ConversionFullTimeJobsInvolvedForm, {
  FormValues,
} from "./ConversionFullTimeJobsInvolvedForm";

import { AppDispatch } from "@/app/application/store";
import {
  goToStep,
  ProjectCreationStep,
  setConversionFullTimeJobsInvolved,
} from "@/features/create-project/application/createProject.reducer";
import { ProjectSite } from "@/features/create-project/domain/project.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, projectSite?: ProjectSite) => {
  return {
    askForReinstatementFullTimeJobs: projectSite?.isFriche ?? false,
    onSubmit: (data: FormValues) => {
      if (data.fullTimeJobs || data.reinstatementFullTimeJobsInvolved)
        dispatch(setConversionFullTimeJobsInvolved(data));
      dispatch(goToStep(ProjectCreationStep.STAKEHOLDERS_OPERATIONS_FULL_TIMES_JOBS));
    },
  };
};

function ConversionFullTimeJobsInvolvedFormContainer() {
  const dispatch = useAppDispatch();
  const projectSite = useAppSelector((state) => state.projectCreation.siteData);

  return <ConversionFullTimeJobsInvolvedForm {...mapProps(dispatch, projectSite)} />;
}

export default ConversionFullTimeJobsInvolvedFormContainer;
