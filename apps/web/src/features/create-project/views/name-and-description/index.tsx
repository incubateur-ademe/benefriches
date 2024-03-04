import { saveProjectAction } from "../../application/createProject.actions";
import { ReconversionProjectCreationData } from "../../domain/project.types";
import { generateProjectName } from "../../domain/projectName";
import ProjectNameAndDescriptionForm, { FormValues } from "./ProjectNameAndDescriptionForm";

import { AppDispatch } from "@/app/application/store";
import {
  completeNaming,
  revertNaming,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, projectData: ReconversionProjectCreationData) => {
  return {
    defaultProjectName: generateProjectName(projectData),
    onSubmit: (formData: FormValues) => {
      dispatch(completeNaming(formData));
      void dispatch(saveProjectAction());
    },
    onBack: () => {
      dispatch(revertNaming());
    },
  };
};

function ProjectNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();
  const projectData = useAppSelector((state) => state.projectCreation.projectData);

  return (
    <ProjectNameAndDescriptionForm
      {...mapProps(dispatch, projectData as ReconversionProjectCreationData)}
    />
  );
}

export default ProjectNameAndDescriptionFormContainer;
