import ProjectNameAndDescriptionForm, {
  FormValues,
} from "./ProjectNameAndDescriptionForm";

import {
  goToStep,
  ProjectCreationStep,
  setNameAndDescription,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormValues) => {
      dispatch(setNameAndDescription(formData));
      dispatch(goToStep(ProjectCreationStep.CREATION_CONFIRMATION));
    },
  };
};

function ProjectNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();

  return <ProjectNameAndDescriptionForm {...mapProps(dispatch)} />;
}

export default ProjectNameAndDescriptionFormContainer;
