import { completeNaming } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { namingStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { selectNameAndDescriptionInitialValues } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectNameAndDescriptionForm, {
  FormValues,
} from "../../common-views/name-and-description/ProjectNameAndDescriptionForm";

function ProjectNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectNameAndDescriptionInitialValues);

  return (
    <ProjectNameAndDescriptionForm
      initialValues={initialValues}
      onSubmit={(formData: FormValues) => {
        dispatch(completeNaming(formData));
      }}
      onBack={() => {
        dispatch(namingStepReverted());
      }}
    />
  );
}

export default ProjectNameAndDescriptionFormContainer;
