import { AppDispatch } from "@/app/application/store";
import {
  completeNaming,
  revertNaming,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { selectCreationData } from "@/features/create-project/application/renewable-energy/renewableEnergy.selector";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { ReconversionProjectCreationData } from "../../../domain/project.types";
import { generateRenewableEnergyProjectName } from "../../../domain/projectName";
import ProjectNameAndDescriptionForm, {
  FormValues,
} from "../../common-views/name-and-description/ProjectNameAndDescriptionForm";

const mapProps = (dispatch: AppDispatch, projectData: ReconversionProjectCreationData) => {
  return {
    defaultProjectName: generateRenewableEnergyProjectName(projectData.renewableEnergyType),
    onSubmit: (formData: FormValues) => {
      dispatch(completeNaming(formData));
    },
    onBack: () => {
      dispatch(revertNaming());
    },
  };
};

function ProjectNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();
  const projectData = useAppSelector(selectCreationData);

  return (
    <ProjectNameAndDescriptionForm
      {...mapProps(dispatch, projectData as ReconversionProjectCreationData)}
    />
  );
}

export default ProjectNameAndDescriptionFormContainer;
