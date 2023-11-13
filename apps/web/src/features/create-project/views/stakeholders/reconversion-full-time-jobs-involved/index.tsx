import ProjectFullTimeJobsInvolvedForm, {
  FormValues,
} from "./ProjectFullTimeJobsInvolvedForm";

import {
  goToStep,
  ProjectCreationStep,
  setFullTimeJobsInvolved,
} from "@/features/create-project/application/createProject.reducer";
import { ProjectSite } from "@/features/create-project/domain/project.types";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch, projectSite: ProjectSite | null) => {
  return {
    askForReinstatementFullTimeJobs: projectSite?.isFriche ?? false,
    onSubmit: (data: FormValues) => {
      dispatch(setFullTimeJobsInvolved(data));
      dispatch(
        goToStep(ProjectCreationStep.STAKEHOLDERS_OPERATIONS_FULL_TIMES_JOBS),
      );
    },
  };
};

function ProjectFullTimeJobsInvolvedFormContainer() {
  const dispatch = useAppDispatch();
  const projectSite = useAppSelector((state) => state.projectCreation.siteData);

  return (
    <ProjectFullTimeJobsInvolvedForm {...mapProps(dispatch, projectSite)} />
  );
}

export default ProjectFullTimeJobsInvolvedFormContainer;
