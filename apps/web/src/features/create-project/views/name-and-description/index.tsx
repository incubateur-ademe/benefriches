import { saveProjectAction } from "../../application/createProject.actions";
import { Project } from "../../domain/project.types";
import { generateProjectName } from "../../domain/projectName";
import ProjectNameAndDescriptionForm, { FormValues } from "./ProjectNameAndDescriptionForm";

import { AppDispatch } from "@/app/application/store";
import {
  goToStep,
  ProjectCreationStep,
  setNameAndDescription,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, projectData: Project) => {
  return {
    defaultProjectName: generateProjectName(projectData),
    onSubmit: (formData: FormValues) => {
      dispatch(setNameAndDescription(formData));
      void dispatch(saveProjectAction());
      dispatch(goToStep(ProjectCreationStep.CREATION_CONFIRMATION));
    },
  };
};

function ProjectNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();
  const projectData = useAppSelector((state) => state.projectCreation.projectData);

  return <ProjectNameAndDescriptionForm {...mapProps(dispatch, projectData as Project)} />;
}

export default ProjectNameAndDescriptionFormContainer;
