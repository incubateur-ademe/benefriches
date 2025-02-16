import {
  namingCompleted,
  namingReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectNameAndDescriptionInitialValues } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import ProjectNameAndDescriptionForm from "@/features/create-project/views/common-views/name-and-description/ProjectNameAndDescriptionForm";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectNameAndDescriptionInitialValues);

  return (
    <ProjectNameAndDescriptionForm
      initialValues={initialValues}
      onBack={() => {
        dispatch(namingReverted());
      }}
      onSubmit={(data) => {
        dispatch(namingCompleted(data));
      }}
    />
  );
}

export default ProjectNameAndDescriptionFormContainer;
