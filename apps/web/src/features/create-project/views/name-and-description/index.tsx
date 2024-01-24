import { saveProjectAction } from "../../application/createProject.actions";
import ProjectNameAndDescriptionForm, { FormValues } from "./ProjectNameAndDescriptionForm";

import { AppDispatch } from "@/app/application/store";
import {
  goToStep,
  ProjectCreationStep,
  setNameAndDescription,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormValues) => {
      dispatch(setNameAndDescription(formData));
      void dispatch(saveProjectAction());
      dispatch(goToStep(ProjectCreationStep.CREATION_CONFIRMATION));
    },
  };
};

function ProjectNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();

  return <ProjectNameAndDescriptionForm {...mapProps(dispatch)} />;
}

export default ProjectNameAndDescriptionFormContainer;
